import type { Request, Response } from "express";

import { sendCustomRoastingNotification } from "../services/telegram.service";
import {
  createCustomRoastingRequest,
  deleteCustomRoastingRequest,
  getCustomRoastingRequests,
  updateCustomRoastingStatus,
  type CreateCustomRoastingInput,
  type CustomRoastingStatus,
} from "../services/customRoasting.service";

// ----------------------------------------------------------------------
// VALIDATION
// ----------------------------------------------------------------------

const CUSTOM_ROASTING_STATUSES: CustomRoastingStatus[] = [
  "new",
  "contacted",
  "in-progress",
  "completed",
  "cancelled",
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isCreateCustomRoastingInput(
  value: unknown,
): value is CreateCustomRoastingInput {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Partial<CreateCustomRoastingInput>;

  if (typeof data.customer !== "object" || data.customer === null) {
    return false;
  }

  if (typeof data.coffee !== "object" || data.coffee === null) {
    return false;
  }

  return (
    isNonEmptyString(data.customer.name) &&
    isNonEmptyString(data.customer.email) &&
    isNonEmptyString(data.customer.phone) &&
    isNonEmptyString(data.coffee.origin) &&
    isNonEmptyString(data.coffee.quantity) &&
    isNonEmptyString(data.coffee.roast) &&
    isNonEmptyString(data.coffee.purpose) &&
    typeof data.message === "string"
  );
}

// ----------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------

export async function getAllCustomRoastingRequests(
  _request: Request,
  response: Response,
) {
  try {
    const requests = await getCustomRoastingRequests();
    response.json(requests);
  } catch (error) {
    console.error("Get custom roasting requests error:", error);
    response.status(500).json({
      message: "Failed to load custom roasting requests.",
    });
  }
}

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------

export async function addCustomRoastingRequest(
  request: Request,
  response: Response,
) {
  if (!isCreateCustomRoastingInput(request.body)) {
    response.status(400).json({ message: "Invalid custom roasting request." });
    return;
  }

  try {
    const createdRequest = await createCustomRoastingRequest(request.body);

    void sendCustomRoastingNotification(createdRequest).catch(
      (error: unknown) => {
        console.error("Telegram custom roasting notification failed:", error);
      },
    );

    response.status(201).json(createdRequest);
  } catch (error) {
    console.error("Create custom roasting request error:", error);
    response.status(500).json({
      message: "Failed to create custom roasting request.",
    });
  }
}

// ----------------------------------------------------------------------
// STATUS
// ----------------------------------------------------------------------

export async function changeCustomRoastingStatus(
  request: Request,
  response: Response,
) {
  const id = Number(request.params.id);
  const { status } = request.body as { status?: unknown };

  if (!Number.isSafeInteger(id) || id <= 0) {
    response.status(400).json({
      message: "Invalid custom roasting request id.",
    });
    return;
  }

  if (
    typeof status !== "string" ||
    !CUSTOM_ROASTING_STATUSES.includes(status as CustomRoastingStatus)
  ) {
    response.status(400).json({ message: "Invalid custom roasting status." });
    return;
  }

  try {
    const updatedRequest = await updateCustomRoastingStatus(
      id,
      status as CustomRoastingStatus,
    );
    response.json(updatedRequest);
  } catch (error) {
    console.error("Update custom roasting status error:", error);
    response.status(500).json({
      message: "Failed to update custom roasting request.",
    });
  }
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function removeCustomRoastingRequest(
  request: Request,
  response: Response,
) {
  const id = Number(request.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    response.status(400).json({
      message: "Invalid custom roasting request id.",
    });
    return;
  }

  try {
    await deleteCustomRoastingRequest(id);
    response.status(204).send();
  } catch (error) {
    console.error("Delete custom roasting request error:", error);
    response.status(500).json({
      message: "Failed to delete custom roasting request.",
    });
  }
}
