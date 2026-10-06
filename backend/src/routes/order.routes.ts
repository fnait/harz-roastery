import { Router } from "express";

import {
  addOrder,
  changeOrderStatus,
  getAllOrders,
  removeOrder,
} from "../controllers/order.controller";

import { requireAdmin } from "../middleware/adminAuth.middleware";

const orderRouter = Router();

// Public (customer checkout)
orderRouter.post("/", addOrder);

// Admin only
orderRouter.get("/", requireAdmin, getAllOrders);
orderRouter.patch("/:id/status", requireAdmin, changeOrderStatus);
orderRouter.delete("/:id", requireAdmin, removeOrder);

export default orderRouter;
