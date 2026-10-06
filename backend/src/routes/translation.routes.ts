import { Router } from "express";

import {
  translateCourse,
  translateProduct,
} from "../controllers/translation.controller";

import { requireAdmin } from "../middleware/adminAuth.middleware";

const translationRouter = Router();

translationRouter.post("/course", requireAdmin, translateCourse);
translationRouter.post("/product", requireAdmin, translateProduct);

export default translationRouter;
