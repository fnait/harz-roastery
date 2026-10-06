import { Router } from "express";

import { uploadProductImageController } from "../controllers/upload.controller";

import { requireAdmin } from "../middleware/adminAuth.middleware";

const uploadRouter = Router();

uploadRouter.post("/product-image", requireAdmin, uploadProductImageController);

export default uploadRouter;
