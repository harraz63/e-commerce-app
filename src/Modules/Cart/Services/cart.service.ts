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

    // Validate color and size if provided
    if (color && !product.colors?.includes(color)) {
      throw new BadRequestException("Invalid Color Selection");
    }
    if (size && !product.sizes?.includes(size)) {
      throw new BadRequestException("Invalid Size Selection");
    }

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
      // Increment Quantity If Already Exist
      cart.items[existingItemIndex].quantity += 1;
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
}

export default new cartService();
