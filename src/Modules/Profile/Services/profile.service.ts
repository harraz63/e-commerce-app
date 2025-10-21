import {
  IAddress,
  IRequest,
  IUser,
  PaymentGatewaysEnum,
  PaymentMethodsEnum,
} from "../../../Common";
import {
  AddressModel,
  PaymentMethodModel,
  UserModel,
} from "../../../DB/Models";
import {
  PaymentMethodRepository,
  UserRepository,
} from "../../../DB/Repositories";
import {
  BadRequestException,
  NotFoundException,
  SuccessResponse,
  compareHash,
  decrypt,
  generateHash,
} from "../../../Utils";

import mongoose from "mongoose";
import { Request, Response } from "express";

class ProfileService {
  private userRepo: UserRepository = new UserRepository(UserModel);
  private paymentMethodRepo: PaymentMethodRepository =
    new PaymentMethodRepository(PaymentMethodModel);

  // Get Profile Data
  getProfile = async (req: Request, res: Response) => {
    const { user: userId } = (req as unknown as IRequest).loggedInUser;

    const user = await this.userRepo.findUserById(
      userId as unknown as mongoose.Types.ObjectId
    );
    if (!user) throw new NotFoundException("User Not Found");

    const safeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone:
        user.phone && user.phone.includes(":")
          ? decrypt(user.phone)
          : user.phone,
      gender: user.gender,
      role: user.role,
      age: user.age,
      isVerified: user.isVerified,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.json(
      SuccessResponse("User Data Fetched Successfully", 200, { safeUser })
    );
  };

  // Update Profile Data
  updateProfile = async (req: Request, res: Response) => {
    const { firstName, lastName, phone, gender, age }: IUser = req.body;
    const { user: userId } = (req as unknown as IRequest).loggedInUser;

    const updatedUser: Partial<IUser> = {};
    if (firstName) updatedUser.firstName = firstName;
    if (lastName) updatedUser.lastName = lastName;
    if (phone) updatedUser.phone = phone;
    if (gender) updatedUser.gender = gender;
    if (age) updatedUser.age = age;

    // Find The User And Update Id
    const user = await this.userRepo.findByIdAndUpdateDocument(
      userId as unknown as mongoose.Types.ObjectId,
      updatedUser,
      { new: true }
    );
    if (!user) throw new NotFoundException("User Not Found");

    const safeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: decrypt(user.phone),
      addresses: user.addresses,
      paymentMethods: user.paymentMethods,
      wishlist: user.wishlist,
      gender: user.gender,
      role: user.role,
      age: user.age,
      isVerified: user.isVerified,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.json(
      SuccessResponse("User Data Updated Successfully", 200, { safeUser })
    );
  };

  // Get All User Addresses
  getAllAddresses = async (req: Request, res: Response) => {
    const { user: userId } = (req as unknown as IRequest).loggedInUser;

    const userAddresses = await AddressModel.findOne({
      user: userId as unknown as mongoose.Types.ObjectId,
    });

    if (!userAddresses) throw new NotFoundException("User Addresses Not Found");

    return res.json(
      SuccessResponse("User Addresses Fetched Successfully", 200, {
        addresses: userAddresses,
      })
    );
  };

  // Add New Address
  addNewAddress = async (req: Request, res: Response) => {
    const { user: userId } = (req as unknown as IRequest).loggedInUser;
    const { city, contry, street }: IAddress = req.body;

    const userAddress: Partial<IAddress> = {};

    if (city) userAddress.city = city;
    if (contry) userAddress.contry = contry;
    if (street) userAddress.street = street;

    // Check If Address Is Already Exist
    const existingAddress = await AddressModel.findOne({
      user: userId,
      street,
      city,
      contry,
    });
    if (existingAddress)
      throw new BadRequestException("This Address Already Exist For This User");

    // Add The Address To DB
    const address = await AddressModel.create({
      user: userId,
      ...userAddress,
    });

    const safeAddress = {
      _id: address._id,
      city: address.city,
      contry: address.contry,
      street: address.street,
    };

    return res.json(
      SuccessResponse("Address Added Successfully", 200, {
        address: safeAddress,
      })
    );
  };

  // Update Address
  updateAddress = async (req: Request, res: Response) => {
    const { id: addressId } = req.params;
    const {
      user: { _id: userId },
    } = (req as unknown as IRequest).loggedInUser;
    const { city, contry, street }: IAddress = req.body;

    if (!addressId) throw new BadRequestException("Address ID Is Required");

    // Get The Address
    const address = await AddressModel.findById(addressId);
    if (!address) throw new NotFoundException("Address Not Found");

    // Check If User Can Update This Address
    if (address.user.toString() !== userId.toString())
      throw new BadRequestException(
        "You Are Not Authorized To Update This Address"
      );

    // Update The Address
    const updatedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      { city, contry, street },
      {
        new: true,
      }
    );

    return res.json(
      SuccessResponse("Address Updated Successfully", 200, {
        address: updatedAddress,
      })
    );
  };

  // Delete Address
  deleteAddress = async (req: Request, res: Response) => {
    const { id: addressId } = req.params;
    const {
      user: { _id: userId },
    } = (req as unknown as IRequest).loggedInUser;

    if (!addressId) throw new BadRequestException("Address ID Is Required");

    // Get The Address
    const address = await AddressModel.findById(addressId);
    if (!address) throw new NotFoundException("Address Not Found");

    // Check If User Can Delete This Address
    if (address.user.toString() !== userId.toString())
      throw new BadRequestException(
        "You Are Not Authorized To Delete This Address"
      );

    // Delete The Address
    await AddressModel.findByIdAndDelete(addressId);

    return res.json(
      SuccessResponse("Address Deleted Successfully", 200, {
        deletedAddressId: addressId,
      })
    );
  };

  // Change Password
  changePassword = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      throw new BadRequestException(
        "Old Password And New Password Are Required"
      );

    // Get The User From DB
    const user = await this.userRepo.findUserById(userId);
    if (!user) throw new NotFoundException("User Not Found");

    // Check If Old Pass Is Right
    const isPasswordRight = compareHash(oldPassword, user.password);
    if (!isPasswordRight)
      throw new BadRequestException("Old Password Is Wrong");

    // Update The Password
    const hashedNewPassword = generateHash(newPassword);
    const updatedUser = this.userRepo.findByIdAndUpdateDocument(userId, {
      password: hashedNewPassword,
    });

    return res.json(SuccessResponse("Password Changed Successfully", 200));
  };
}

export default new ProfileService();
