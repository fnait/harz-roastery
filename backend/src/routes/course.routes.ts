import { Router } from "express";

import {
  addCourse,
  editCourse,
  getAllCourses,
  removeCourse,
} from "../controllers/course.controller";

import { requireAdmin } from "../middleware/adminAuth.middleware";

const courseRouter = Router();

// Public
courseRouter.get("/", getAllCourses);

// Admin only
courseRouter.post("/", requireAdmin, addCourse);
courseRouter.put("/:id", requireAdmin, editCourse);
courseRouter.delete("/:id", requireAdmin, removeCourse);

export default courseRouter;
