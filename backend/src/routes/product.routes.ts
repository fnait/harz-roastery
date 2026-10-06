import { Router } from "express";

import {
  addProduct,
  editProduct,
  getAllProducts,
  removeProduct,
  resetAllProducts,
} from "../controllers/product.controller";

import { requireAdmin } from "../middleware/adminAuth.middleware";

const productRouter = Router();

// Public
productRouter.get("/", getAllProducts);

// Admin only
productRouter.post("/", requireAdmin, addProduct);
productRouter.post("/reset", requireAdmin, resetAllProducts);
productRouter.put("/:id", requireAdmin, editProduct);
productRouter.delete("/:id", requireAdmin, removeProduct);

export default productRouter;
