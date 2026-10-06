import { Router } from "express";

import {
  addCustomRoastingRequest,
  changeCustomRoastingStatus,
  getAllCustomRoastingRequests,
  removeCustomRoastingRequest,
} from "../controllers/customRoasting.controller";

import { requireAdmin } from "../middleware/adminAuth.middleware";

const customRoastingRouter = Router();

// Public
customRoastingRouter.post("/", addCustomRoastingRequest);

// Admin only
customRoastingRouter.get("/", requireAdmin, getAllCustomRoastingRequests);
customRoastingRouter.patch(
  "/:id/status",
  requireAdmin,
  changeCustomRoastingStatus,
);
customRoastingRouter.delete("/:id", requireAdmin, removeCustomRoastingRequest);

export default customRoastingRouter;
