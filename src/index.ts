import "dotenv/config";
import { FailedResponse, HttpException } from "./Utils";
import * as controllers from "./Modules/controllers.index";
import dbConnection from "./DB/db.connection";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { cartLimiter, LoggerMiddleware, orderLimiter } from "./Middlewares";
import helmet from "helmet";

const app = express();

// Security
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 
const whitelist = ["http://localhost:4200"];
const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    if (!origin || whitelist.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});
app.use(cors(corsOptions));
app.options("/", cors(corsOptions));*/

app.use(cors({ origin: true, credentials: true })); // For Any Domain
app.options(/.*/, cors({ origin: true, credentials: true })); // For Any Route

// Database
dbConnection();

// Logger
app.use(LoggerMiddleware);

// Routes With Limiters
app.use("/api/auth", controllers.authController);
app.use("/api/profile", controllers.profileController);
app.use("/api/categories", controllers.categoriesController);
app.use("/api/admin", controllers.adminController);
app.use("/api/products", controllers.productController);
app.use("/api/cart", cartLimiter, controllers.cartController);
app.use("/api/wishlist", controllers.wishlistController);
app.use("/api/orders", orderLimiter, controllers.ordersController);
// app.use("/api/contact", controllers.contactController);
// app.use("/api/support", controllers.supportController);
// app.use("/api/subscribe", controllers.subscribeController);

// Global Error Handling Middleware
app.use(
  (
    err: HttpException | Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof HttpException) {
      res
        .status(err.statusCode)
        .json(
          FailedResponse(
            err.message,
            err.statusCode,
            err.error || { message: err.message }
          )
        );
    } else {
      console.log(err);
      res.status(500).json(
        FailedResponse("Something Went Wrong!", 500, {
          message: err.message,
          stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        })
      );
    }
  }
);

const port: number | string = process.env.PORT || 3000;
app.listen(3000, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
});
