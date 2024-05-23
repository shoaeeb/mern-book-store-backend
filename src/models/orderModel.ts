import { kStringMaxLength } from "buffer";
import mongoose from "mongoose";

export type Order = {
  user: mongoose.Types.ObjectId;
  orderItems: {
    book: mongoose.Types.ObjectId;
    title: string;
    quantity: number;
  }[];
  deliveryDetails: {
    email: string;
    city: string;
    addressLine1: string;
    country: string;
  };
  total: number;
  status: string;
};

const orderSchema = new mongoose.Schema<Order>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderItems: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    deliveryDetails: {
      email: { type: String, required: true },
      city: { type: String, required: true },
      addressLine1: { type: String, required: true },
      country: { type: String, required: true },
    },
    total: Number,
    status: {
      type: String,
      enum: {
        values: ["placed", "paid", "inProgress", "outForDelivery", "delivered"],
        message: `{VALUE} is not supported. Supported values are placed, paid, inProgress, outForDelivery, delivered`,
      },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
