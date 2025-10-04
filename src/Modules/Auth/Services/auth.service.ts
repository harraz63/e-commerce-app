import {
  IOTP,
  IRequest,
  IUser,
  OtpTypesEnum,
  ProviderEnum,
} from "../../../Common";
import { BlackListedModel, OtpModel, UserModel } from "../../../DB/Models";
import {
  BlackListedRepository,
  UserRepository,
} from "../../../DB/Repositories";

import { Request, Response } from "express";
import {
  BadRequestException,
  compareHash,
  emmiter,
  encrypt,
  generateHash,
  generateToken,
  getAge,
  NotFoundException,
  parseExpiry,
  SuccessResponse,
  verifyToken,
} from "../../../Utils";
import { customAlphabet } from "nanoid";
import { OAuth2Client } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import { SignOptions } from "jsonwebtoken";

const uniqueString = customAlphabet("0123456789", 5);

class AuthService {
  private userRepo: UserRepository = new UserRepository(UserModel);
  private blackListedRepo: BlackListedRepository = new BlackListedRepository(
    BlackListedModel
  );

  // Register
  register = async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      gender,
      DOB,
    }: Partial<IUser> = req.body;

    // Check On Email
    const isEmailExist = await this.userRepo.findUserByEmail(email as string);
    if (isEmailExist) throw new BadRequestException("Email Is Already Exist");

    // Encrypt Phone Number
    const encryptedPhone = encrypt(phone as string);
    // Hash Password
    const hashedPassword = generateHash(password as string);
    // Calculate User Age From DOB
    const age = getAge(DOB);

    // OTP Logic
    const otp = uniqueString();

    // Create User Document In DB
    const newUser = await this.userRepo.createNewDocument({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone: encryptedPhone,
      gender,
      DOB,
      age,
    });

    // Send Confirmation Email
    emmiter.emit("sendEmail", {
      to: email,
      subject: "Verify Your Email - OTP for Signup",
      content: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #fafafa;">
    <h2 style="text-align: center; color: #4CAF50;">🔐 Email Verification</h2>
    <p style="font-size: 16px; color: #333;">
      Hello <b>${firstName}</b>,
    </p>
    <p style="font-size: 15px; color: #333;">
      Thank you for signing up! Please use the following OTP to complete your registration:
    </p>
    
    <div style="text-align: center; margin: 20px 0;">
      <span style="display: inline-block; background: #4CAF50; color: white; font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 12px 24px; border-radius: 8px;">
        ${otp}
      </span>
    </div>

    <p style="font-size: 14px; color: #555;">
      ⚠️ This OTP will expire in <b>10 minutes</b>. Do not share it with anyone.
    </p>

    <p style="font-size: 14px; color: #777;">
      If you did not request this, please ignore this email.
    </p>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
    <p style="text-align: center; font-size: 12px; color: #aaa;">
      © ${new Date().getFullYear()} Social Media App. All rights reserved.
    </p>
  </div>
  `,
    });

    const confermitionEmailOtp: IOTP = {
      userId: newUser._id,
      value: generateHash(otp),
      otpType: OtpTypesEnum.EMAIL_VERIFICATION,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    await OtpModel.create(confermitionEmailOtp);

    return res.json(
      SuccessResponse("User Registered Successfully", 201, newUser)
    );
  };
  // Register With Gmail
  registerByGmail = async (req: Request, res: Response) => {
    const { idToken } = req.body;
    if (!idToken) throw new BadRequestException("Id Token Is Required");

    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new BadRequestException("Invalid Google Token");

    const { email, given_name, family_name, email_verified, sub } = payload;
    if (!email_verified) throw new BadRequestException("Email Is Not Verified");

    let user = await this.userRepo.findOneDocument({
      googleId: sub,
      provider: ProviderEnum.GOOGLE,
    });

    const isNewUser = !user;

    if (!user) {
      user = await this.userRepo.createNewDocument({
        firstName: given_name,
        lastName: family_name ?? "",
        email,
        provider: ProviderEnum.GOOGLE,
        isConfirmed: true,
        password: generateHash(uniqueString()),
        age: 18,
        googleId: sub,
        phone: "000",
      });
    } else {
      user.email = email as string;
      user.firstName = given_name as string;
      user.lastName = family_name ?? "";
      await user.save();
    }

    const accessToken = generateToken(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: process.env
          .JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
        jwtid: uuidv4(),
      }
    );

    const refreshToken = generateToken(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: process.env
          .JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
      }
    );

    return res.json(
      SuccessResponse(
        isNewUser
          ? "User Signed Up Successfully"
          : "User Logged In Successfully",
        200,
        { accessToken, refreshToken }
      )
    );
  };

  // Login
  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestException("Email And Password Are Required");
    }

    // Find User
    const user = await this.userRepo.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException("Invalid Email Or Password");
    }
    // Checks On Password
    const isPasswordMatches = compareHash(password, user.password);
    if (!isPasswordMatches) {
      throw new BadRequestException("Invalid Email Or Password");
    }

    // Generate Tokens
    const accessToken = generateToken(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: process.env
          .JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
        jwtid: uuidv4(),
      }
    );

    const refreshToken = generateToken(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: process.env
          .JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
      }
    );

    res.json(
      SuccessResponse("User Logged In Successfully", 200, {
        accessToken,
        refreshToken,
      })
    );
  };

  // Logout
  logout = async (req: Request, res: Response) => {
    const { tokenId, expirationDate } = (req as unknown as IRequest)
      .loggedInUser;

    // Add The Token To Black List
    await this.blackListedRepo.createNewDocument({
      tokenId,
      expiresAt: expirationDate!,
    });

    res.json(SuccessResponse("User Logged Out Successfully"));
  };

  // Forget Password
  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) throw new BadRequestException("Email Is Required");

    const user = await this.userRepo.findUserByEmail(email);
    if (!user) throw new NotFoundException("User Not Found");

    // OTP Logic
    const otp = uniqueString();
    const expiry =
      Date.now() + parseExpiry(process.env.OTP_EXPIRES_IN as string);

    // Create Otp Document
    const userOtp = await OtpModel.create({
      userId: user._id,
      otpType: OtpTypesEnum.FORGOT_PASSWORD,
      expiresAt: expiry,
      value: generateHash(otp),
    });

    // Send Email
    emmiter.emit("sendEmail", {
      to: email,
      subject: "Reset Your Password - OTP Verification",
      content: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #fafafa;">
    <h2 style="text-align: center; color: #2196F3;">🔒 Password Reset Request</h2>
    
    <p style="font-size: 16px; color: #333;">
      Hello <b>${user.firstName}</b>,
    </p>
    <p style="font-size: 15px; color: #333;">
      We received a request to reset your password. Please use the following OTP to verify your identity and continue with the reset process:
    </p>
    
    <div style="text-align: center; margin: 20px 0;">
      <span style="display: inline-block; background: #2196F3; color: white; font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 12px 24px; border-radius: 8px;">
        ${otp}
      </span>
    </div>

    <p style="font-size: 14px; color: #555;">
      ⚠️ This OTP will expire in <b>10 minutes</b>. Do not share it with anyone.
    </p>

    <p style="font-size: 14px; color: #777;">
      If you didn’t request a password reset, you can safely ignore this email — your account will remain secure.
    </p>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
    <p style="text-align: center; font-size: 12px; color: #aaa;">
      © ${new Date().getFullYear()} Social Media App. All rights reserved.
    </p>
  </div>
  `,
    });

    return res.json(SuccessResponse("Forget Password OTP Send Successfully"));
  };

  // Reset Password
  resetPassword = async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    if (!email) throw new BadRequestException("Email Is Required");
    if (!otp) throw new BadRequestException("OTP Is Required");
    if (!newPassword) throw new BadRequestException("New Password Is Required");

    const user = await this.userRepo.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException("User Not Found");
    }
    const userOtp = await OtpModel.findOne({
      userId: user._id,
      otpType: OtpTypesEnum.FORGOT_PASSWORD,
    });
    if (!userOtp) {
      throw new NotFoundException("OTP Not Found or Expired");
    }
    const isOtpMatched = compareHash(otp, userOtp?.value as string);
    if (!isOtpMatched) {
      throw new BadRequestException("Invalid OTP");
    }

    // Reset Password Logic
    const hashedNewPassword = generateHash(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    res.json(SuccessResponse("User Password Changed Successfully"));
  };

  // Refresh Token Handling
  refreshToken = async (req: Request, res: Response) => {
    const refreshtoken = req.headers["refreshtoken"] as string;
    if (!refreshtoken)
      throw new BadRequestException("Refresh Token Is Required");

    const decotedData = verifyToken(
      refreshtoken,
      process.env.JWT_REFRESH_SECRET as string
    );

    // Generate Tokens
    const accessToken = generateToken(
      {
        _id: decotedData._id,
        email: decotedData.email,
        role: decotedData.role,
      },
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: process.env
          .JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
        jwtid: uuidv4(),
      }
    );

    res.json(
      SuccessResponse("Token Refreshed Successfully", 200, { accessToken })
    );
  };
}

export default new AuthService();
