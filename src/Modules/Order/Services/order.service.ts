import { Request, Response } from "express";
import { CartRepository, OrderRepository } from "../../../DB/Repositories";
import { CartModel, OrderModel } from "../../../DB/Models";
import { IOrder, IRequest, orderStatusEnum } from "../../../Common";
import {
  BadRequestException,
  NotFoundException,
  SuccessResponse,
} from "../../../Utils";
import { Schema, Types } from "mongoose";

class orderService {
  private orderRepo: OrderRepository = new OrderRepository(OrderModel);
  private cartRepo: CartRepository = new CartRepository(CartModel);

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

  // Cancel Order
  cancelOrder = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { orderId } = req.params;

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
      console.log(order.status)
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

    return res.json(SuccessResponse("Order Canceled Successfully"));
  };
}

export default new orderService();
