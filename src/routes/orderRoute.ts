import express from "express";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import orderController from "../controllers/orderController";

const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  orderController.createCheckoutSession
);
router.post("/checkout/webhook", orderController.stripeWebhookHandler);
router.get("/", jwtCheck, jwtParse, orderController.getAllOrdersOfUser);

export default router;
