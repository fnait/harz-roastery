import { Router } from "express";

import {
  addCourseEnrollment,
  changeCourseEnrollmentStatus,
  getAllCourseEnrollments,
  removeCourseEnrollment,
} from "../controllers/courseEnrollment.controller";

import { requireAdmin } from "../middleware/adminAuth.middleware";

const courseEnrollmentRouter = Router();

// Public
courseEnrollmentRouter.post("/", addCourseEnrollment);

// Admin only
courseEnrollmentRouter.get("/", requireAdmin, getAllCourseEnrollments);
courseEnrollmentRouter.patch(
  "/:id/status",
  requireAdmin,
  changeCourseEnrollmentStatus,
);
courseEnrollmentRouter.delete("/:id", requireAdmin, removeCourseEnrollment);

export default courseEnrollmentRouter;
