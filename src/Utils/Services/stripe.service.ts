import Stripe from "stripe";

// interface CheckoutSessionDto {
//   line_items: {
//     price_data: {
//       currency: string;
//       product_data: {
//         name: string;
//         images: string[];
//       };
//       unit_amount: number;
//     };
//     quantity: number;
//   }[];
//   customer_email: string;
//   metadata: any;
// }

export class StripeServivce {
  private stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  // Create Checkout Session
  async createCheckoutSession({
    line_items = [],
    customer_email = "",
    metadata = {},
  }: Stripe.Checkout.SessionCreateParams) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: "http://localhost:3000/success-payment",
      cancel_url: "http://localhost:3000/canceled-payment",
      line_items,
      customer_email,
      metadata,
    });
  }

  // Refund Payment
  async refundPaymant(
    payment_intent: string,
    reason: Stripe.RefundCreateParams.Reason
  ) {
    return await this.stripe.refunds.create({
      payment_intent,
      reason,
    });
  }
}
