import { Request, Response } from "express";
import { CartRepository, OrderRepository } from "../../../DB/Repositories";
import { CartModel, OrderModel } from "../../../DB/Models";
import { IProduct, IRequest, orderStatusEnum } from "../../../Common";
import {
  BadRequestException,
  NotFoundException,
  S3ClientService,
  StripeServivce,
  SuccessResponse,
} from "../../../Utils";
import { Schema, Types } from "mongoose";

class orderService {
  private orderRepo: OrderRepository = new OrderRepository(OrderModel);
  private cartRepo: CartRepository = new CartRepository(CartModel);
  private s3Client = new S3ClientService();
  private stripe = new StripeServivce();

  // Create Order
  createOrder = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { address, phone, paymentMethod } = req.body;

    if (!address) throw new BadRequestException("Address Is Required");
    if (!phone) throw new BadRequestException("Phone Is Required");
    if (!paymentMethod)
      throw new BadRequestException("Payment Method Is Required");

    // Get The Cart
    const cart = await this.cartRepo.findCartByUser(userId);
    if (!cart) throw new NotFoundException("User Cart Not Founded");

    // Create The Order
    const createdOrder = await this.orderRepo.createOrder({
      cart: cart._id as Schema.Types.ObjectId,
      user: userId as unknown as Schema.Types.ObjectId,
      address,
      phone,
      paymentMethod,
    });

    return res.json(
      SuccessResponse("Order Created Successfully", 200, { createdOrder })
    );
  };

  // Get All Orders
  getAllOrders = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;

    // Get The Orders
    const orders = await this.orderRepo.findAllOrderByUser(userId);

    return res.json(
      SuccessResponse("User Orders Fetched Successfully", 200, { orders })
    );
  };

  // Get Specific Order Details
  getOrderDetails = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { orderId } = req.params;

    if (!orderId) throw new BadRequestException("Order ID Is Required");

    const order = await this.orderRepo.findOrderById(
      orderId as unknown as Types.ObjectId
    );
    if (!order || order.user.toString() !== userId.toString()) {
      throw new BadRequestException(
        "Order Not Founded Or You Do Not Have Permission To Access This Order"
      );
    }

    return res.json(
      SuccessResponse("Order Details Fetched Successfully", 200, { order })
    );
  };

  // Pay Order
  payOrder = async (req: Request, res: Response) => {
    const { user } = (req as IRequest).loggedInUser;
    const { orderId } = req.body;

    // Get The Order From DB
    const order = await this.orderRepo.findOneDocument(
      {
        _id: orderId,
        user: user._id,
        status: orderStatusEnum.PENDING,
      },
      {},
      {
        populate: [
          {
            path: "cart",
            select: "_id items coupon totalPrice",
            populate: {
              path: "items.product",
              select: "name price description imageKeys",
            },
          },
        ],
      }
    );
    if (!order) throw new NotFoundException("Order Not Found");

    // Prepare The line_items
    const line_items: any[] = await Promise.all(
      (order.cart as any).items.map(async (product: any) => {
        const imageUrl = await this.s3Client.getFileWithSignedUrl(
          product.product.imageKeys[0]
        );

        return {
          price_data: {
            currency: "EGP",
            product_data: {
              name: product.product.name,
              images: [imageUrl],
            },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        };
      })
    );

    // Create The Checkout Session
    const checkoutSession = await this.stripe.createCheckoutSession({
      customer_email: user.email,
      line_items,
      metadata: { orderId: String(order._id) },
    });

    return res.json(
      SuccessResponse(
        "Payment Session Created Successfully",
        200,
        checkoutSession
      )
    );
  };

  // Stripe Webhook
  stripeWebhook = async (req: Request, res: Response) => {
    const body = req.body;

    const orderId = body.data.object.metadata.orderId;
    const paymentIntent = body.data.object.payment_intent;

    await this.orderRepo.updateOneDocument(
      { _id: orderId },
      {
        status: orderStatusEnum.PAID,
        paymentIntent,
      }
    );
  };

  // Cancel Order
  cancelOrder = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { orderId } = req.params;

    // Get The Order From DB
    const order = await this.orderRepo.findOrderById(
      orderId as unknown as Types.ObjectId
    );
    if (!order || order.user.toString() !== userId.toString()) {
      throw new BadRequestException(
        "Order Not Founded Or You Do Not Have Permission To Access This Order"
      );
    }

    // Check The Cancelation Period
    if (
      ![
        orderStatusEnum.PENDING,
        orderStatusEnum.PAID,
        orderStatusEnum.PLACED,
      ].includes(order.status as orderStatusEnum)
    ) {
      throw new BadRequestException("You Can Not Cancel This Order");
    }

    const timeDiff = Date.now() - (order as any).createdAt?.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    if (dayDiff > 1) {
      throw new BadRequestException(
        "You Can Not Cancel This Order After 24 Hours"
      );
    }

    // Update Order Status To Cancelation Status
    await this.orderRepo.updateOneDocument(
      { _id: orderId, user: userId },
      { status: orderStatusEnum.CANCELLED }
    );

    // Refund Payment
    await this.stripe.refundPaymant(
      order.paymentIntent!,
      "requested_by_customer"
    );

    return res.json(SuccessResponse("Order Canceled Successfully"));
  };
}

export default new orderService();
