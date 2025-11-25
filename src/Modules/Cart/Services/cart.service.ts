import { Request, Response } from "express";
import { IRequest } from "../../../Common";
import { CartRepository, ProductRepository } from "../../../DB/Repositories";
import { ProductModel, CartModel } from "../../../DB/Models";
import {
  BadRequestException,
  NotFoundException,
  SuccessResponse,
} from "../../../Utils";

import { Schema } from "mongoose";

class cartService {
  private productRepo: ProductRepository = new ProductRepository(ProductModel);
  private cartRepo: CartRepository = new CartRepository(CartModel);

  // Add Product To Cart
  addProductToCart = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { productId } = req.params;
    const { color, size } = req.body;

    // Get The Product And Check If Is It Avilable In The Stock
    const product = await this.productRepo.findProductById(productId);
    if (!product) throw new NotFoundException("Product Not Found");
    if (product.stock === 0)
      throw new BadRequestException("Product Is Currently Out Of Stock");

    // Check If User Does Not Have Cart Yet
    let cart = await this.cartRepo.findCartByUser(userId);
    if (!cart) {
      // Create Cart Onle When Needed
      cart = await this.cartRepo.createCart(userId);
    }

    // Check If Product Already Exist In Cart With Same Color/Size
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.color === (color || null) &&
        item.size === (size || null)
    );

    if (existingItemIndex > -1) {
      // Check if there's enough stock
      const currentQty = cart.items[existingItemIndex].quantity;
      if (currentQty + 1 > product.stock) {
        throw new BadRequestException("Not Enough Stock Available");
      }
      // Throw Error That Say Product Already Added To Cart
      throw new BadRequestException("Product Is Already Added To Cart");
    } else {
      // Add New Product To Cart
      const cartItem = {
        product: product._id as Schema.Types.ObjectId,
        quantity: 1,
        color: color || null,
        size: size || null,
        price: product.price,
      };
      cart.items.push(cartItem);
    }

    // Save The Cart
    await cart.save();

    // Send Response
    return res.json(
      SuccessResponse("Product Added To Cart Successfully", 200, { cart })
    );
  };

  // Increment Cart Item
  incrementCartItem = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { productId } = req.params;
    const { color, size } = req.body;

    // Check About Item In Cart
    const cart = await this.cartRepo.findCartByUser(userId);
    if (!cart) throw new NotFoundException("Cart Not Found");

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId.toString() &&
        item.color === (color || null) &&
        item.size === (size || null)
    );
    if (existingItemIndex === -1)
      throw new NotFoundException("Product Not Found");

    // Check Stock
    const product = await this.productRepo.findProductById(productId);
    if (!product) throw new NotFoundException("Product Not Found");
    if (cart.items[existingItemIndex].quantity + 1 > product.stock!) {
      throw new BadRequestException("Insufficient stock");
    }

    // Increment Quantity
    cart.items[existingItemIndex].quantity += 1;

    await cart.save();

    return res.json(
      SuccessResponse("Item Quantity Incremented Successfully", 200, { cart })
    );
  };

  // Decremnt Cart Item
  decrementCartItem = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { productId } = req.params;

    // Find user's cart
    const cart = await this.cartRepo.findCartByUser(userId);
    if (!cart) throw new NotFoundException("Cart Not Found");

    // Find the matching item in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );
    if (existingItemIndex === -1)
      throw new NotFoundException("Product Not Found In Cart");

    // Decrease quantity or remove item if it's 1
    const currentQty = cart.items[existingItemIndex].quantity;
    if (currentQty > 1) {
      cart.items[existingItemIndex].quantity -= 1;
    } else {
      cart.items.splice(existingItemIndex, 1);
    }

    await cart.save();

    return res.json(
      SuccessResponse(
        currentQty > 1
          ? "Item Quantity Decremented Successfully"
          : "Item Removed From Cart Successfully",
        200,
        { cart }
      )
    );
  };

  // Delete Item From Cart
  deleteCartItem = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { productId } = req.params;

    const updatedCart = await this.cartRepo.findAndUpdateDocument(
      {
        user: userId,
        "items.product": productId,
      },
      {
        $pull: { items: { product: productId } },
      },
      {
        new: true,
      }
    );
    if (!updatedCart) {
      throw new NotFoundException("Cart Not Found or Product Not In Cart");
    }

    return res.json(
      SuccessResponse("Product Removed From Cart", 200, { updatedCart })
    );
  };

  // Get User Cart
  getCart = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;

    const cart = await this.cartRepo.findCartByUser(userId);
    // Create Empty Cart If Doesn't Exist
    if (!cart) {
      await this.cartRepo.createCart(userId);
    }

    return res.json(
      SuccessResponse("Cart Details Fetched Successfully", 200, { cart })
    );
  };
}

export default new cartService();
