import Stripe from "stripe";
import { Request, Response } from "express";
import Books, { BookType } from "../models/bookModel";
import Order from "../models/orderModel";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL as string;

const DELIVERY_PRICE = 50 * 100; // to lowest demomination paise

type CheckoutSessionRequest = {
  cartItems: {
    book: string;
    title: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
    country: string;
  };
};

const getAllOrdersOfUser = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({
      user: req.userId,
    })
      .populate("orderItems.book")
      .populate("user");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET as string
    );
  } catch (error: any) {
    console.log(error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
  if (event && event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    (order.total = event.data.object.amount_total as number),
      (order.status = "paid");
    await order.save();
    res.status(200).send();
  }
};

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;
    console.log(checkoutSessionRequest);
    let books: BookType[];
    books = await Promise.all(
      checkoutSessionRequest.cartItems.map(async (item) => {
        const book = await Books.findOne({ _id: item.book });
        if (!book) throw new Error("Book Not Found");
        return book;
      })
    );

    const newOrder = new Order({
      user: req.userId,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      status: "placed",
      orderItems: checkoutSessionRequest.cartItems,
    });

    const lineItems = createLineItems(checkoutSessionRequest, books);
    const session = await createSession(lineItems, newOrder._id.toString());

    if (!session.url) {
      return res.status(500).json({ message: "ERROR creating session" });
    }
    await newOrder.save();
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  books: BookType[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((item) => {
    const bookItem = books.find((book) => book._id.toString() === item.book);
    if (!bookItem) {
      throw new Error(`Book Not Found`);
    }

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "INR",
        unit_amount: bookItem.price,
        product_data: {
          name: bookItem.title,
        },
      },
      quantity: parseInt(item.quantity),
    };
    return lineItem;
  });
  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string
) => {
  console.log(orderId);
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: DELIVERY_PRICE,
            currency: "INR",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/checkout?cancelled=true`,
  });

  return sessionData;
};

export default {
  createCheckoutSession,
  stripeWebhookHandler,
  getAllOrdersOfUser,
};
