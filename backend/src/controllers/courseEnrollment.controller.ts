import type { Request, Response } from "express";

import { sendCourseEnrollmentNotification } from "../services/telegram.service";
import {
  createCourseEnrollment,
  deleteCourseEnrollment,
  getCourseEnrollments,
  updateCourseEnrollmentStatus,
  type CourseEnrollmentStatus,
  type CreateCourseEnrollmentInput,
} from "../services/courseEnrollment.service";

// ----------------------------------------------------------------------
// VALIDATION
// ----------------------------------------------------------------------

const ENROLLMENT_STATUSES: CourseEnrollmentStatus[] = [
  "new",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isCreateEnrollmentInput(
  value: unknown,
): value is CreateCourseEnrollmentInput {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Partial<CreateCourseEnrollmentInput>;

  if (
    typeof data.courseId !== "number" ||
    !Number.isInteger(data.courseId) ||
    data.courseId <= 0
  ) {
    return false;
  }

  if (data.language !== "en" && data.language !== "uk") {
    return false;
  }

  if (typeof data.customer !== "object" || data.customer === null) {
    return false;
  }

  return (
    isNonEmptyString(data.customer.name) &&
    isNonEmptyString(data.customer.email) &&
    isNonEmptyString(data.customer.phone)
  );
}

// ----------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------

export async function getAllCourseEnrollments(
  _request: Request,
  response: Response,
) {
  try {
    const enrollments = await getCourseEnrollments();
    response.json(enrollments);
  } catch (error) {
    console.error("Get course enrollments error:", error);
    response.status(500).json({ message: "Failed to load enrollments." });
  }
}

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------

export async function addCourseEnrollment(
  request: Request,
  response: Response,
) {
  if (!isCreateEnrollmentInput(request.body)) {
    response.status(400).json({ message: "Invalid enrollment data." });
    return;
  }

  try {
    const enrollment = await createCourseEnrollment(request.body);

    void sendCourseEnrollmentNotification(enrollment).catch(
      (error: unknown) => {
        console.error("Telegram course enrollment notification failed:", error);
      },
    );

    response.status(201).json(enrollment);
  } catch (error) {
    console.error("Create course enrollment error:", error);
    response.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to create enrollment.",
    });
  }
}

// ----------------------------------------------------------------------
// STATUS
// ----------------------------------------------------------------------

export async function changeCourseEnrollmentStatus(
  request: Request,
  response: Response,
) {
  const id = Number(request.params.id);
  const { status } = request.body as { status?: unknown };

  if (!Number.isSafeInteger(id) || id <= 0) {
    response.status(400).json({ message: "Invalid enrollment id." });
    return;
  }

  if (
    typeof status !== "string" ||
    !ENROLLMENT_STATUSES.includes(status as CourseEnrollmentStatus)
  ) {
    response.status(400).json({ message: "Invalid enrollment status." });
    return;
  }

  try {
    const enrollment = await updateCourseEnrollmentStatus(
      id,
      status as CourseEnrollmentStatus,
    );
    response.json(enrollment);
  } catch (error) {
    console.error("Update enrollment status error:", error);
    response.status(500).json({ message: "Failed to update enrollment." });
  }
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function removeCourseEnrollment(
  request: Request,
  response: Response,
) {
  const id = Number(request.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    response.status(400).json({ message: "Invalid enrollment id." });
    return;
  }

  try {
    await deleteCourseEnrollment(id);
    response.status(204).send();
  } catch (error) {
    console.error("Delete enrollment error:", error);
    response.status(500).json({ message: "Failed to delete enrollment." });
  }
}
