import type { Request, Response } from "express";

import {
  translateCourseWithDeepL,
  translateProductWithDeepL,
} from "../services/deepl.service";

import type { CourseTranslationRequest } from "../types/translation";

// ----------------------------------------------------------------------
// COURSE
// ----------------------------------------------------------------------

export async function translateCourse(
  request: Request<unknown, unknown, CourseTranslationRequest>,
  response: Response,
) {
  const { title, description, duration } = request.body;

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof duration !== "string"
  ) {
    response.status(400).json({
      message: "title, description and duration must be strings.",
    });
    return;
  }

  const normalizedContent = {
    title: title.trim(),
    description: description.trim(),
    duration: duration.trim(),
  };

  if (
    !normalizedContent.title &&
    !normalizedContent.description &&
    !normalizedContent.duration
  ) {
    response.status(400).json({ message: "Nothing to translate." });
    return;
  }

  try {
    const translation = await translateCourseWithDeepL(normalizedContent);
    response.json(translation);
  } catch (error) {
    console.error("Course translation error:", error);
    response.status(500).json({ message: "Course translation failed." });
  }
}

// ----------------------------------------------------------------------
// PRODUCT
// ----------------------------------------------------------------------

export async function translateProduct(request: Request, response: Response) {
  const { description } = request.body as { description?: unknown };

  if (typeof description !== "string") {
    response.status(400).json({ message: "Description must be a string." });
    return;
  }

  const normalizedDescription = description.trim();

  if (!normalizedDescription) {
    response.status(400).json({ message: "Description is required." });
    return;
  }

  try {
    const translation = await translateProductWithDeepL({
      description: normalizedDescription,
    });
    response.json(translation);
  } catch (error) {
    console.error("Product translation failed:", error);
    response.status(500).json({ message: "Failed to translate product." });
  }
}
