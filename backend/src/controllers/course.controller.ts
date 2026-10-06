import type { Request, Response } from "express";

import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
  type AcademyCourse,
  type LocalizedText,
} from "../services/course.service";

// ----------------------------------------------------------------------
// VALIDATION
// ----------------------------------------------------------------------

function isLocalizedText(value: unknown): value is LocalizedText {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Partial<LocalizedText>;

  return typeof data.en === "string" && typeof data.uk === "string";
}

function isValidCourse(value: unknown): value is AcademyCourse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const course = value as Partial<AcademyCourse>;

  return (
    typeof course.id === "number" &&
    Number.isInteger(course.id) &&
    course.id > 0 &&
    isLocalizedText(course.title) &&
    isLocalizedText(course.description) &&
    isLocalizedText(course.duration) &&
    typeof course.price === "number" &&
    Number.isFinite(course.price) &&
    course.price > 0 &&
    typeof course.active === "boolean"
  );
}

// ----------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------

export async function getAllCourses(_request: Request, response: Response) {
  try {
    const courses = await getCourses();
    response.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    response.status(500).json({ message: "Failed to load courses." });
  }
}

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------

export async function addCourse(request: Request, response: Response) {
  if (!isValidCourse(request.body)) {
    response.status(400).json({ message: "Invalid course data." });
    return;
  }

  try {
    const course = await createCourse(request.body);
    response.status(201).json(course);
  } catch (error) {
    console.error("Create course error:", error);
    response.status(500).json({ message: "Failed to create course." });
  }
}

// ----------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------

export async function editCourse(request: Request, response: Response) {
  const id = Number(request.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    response.status(400).json({ message: "Invalid course id." });
    return;
  }

  if (!isValidCourse(request.body)) {
    response.status(400).json({ message: "Invalid course data." });
    return;
  }

  try {
    const course = await updateCourse(id, request.body);
    response.json(course);
  } catch (error) {
    console.error("Update course error:", error);
    response.status(500).json({ message: "Failed to update course." });
  }
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function removeCourse(request: Request, response: Response) {
  const id = Number(request.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    response.status(400).json({ message: "Invalid course id." });
    return;
  }

  try {
    await deleteCourse(id);
    response.status(204).send();
  } catch (error) {
    console.error("Delete course error:", error);
    response.status(500).json({ message: "Failed to delete course." });
  }
}
