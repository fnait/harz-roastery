import type { NextFunction, Request, Response } from "express";

import { firebaseAuth } from "../config/firebase";

export async function requireAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    response.status(401).json({ message: "Authentication required." });
    return;
  }

  const token = authorization.substring("Bearer ".length);

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    const adminUid = process.env.ADMIN_UID;

    if (!adminUid) {
      console.error("ADMIN_UID is not configured.");
      response.status(500).json({
        message: "Admin authorization is not configured.",
      });
      return;
    }

    if (decodedToken.uid !== adminUid) {
      response.status(403).json({ message: "Admin access required." });
      return;
    }

    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    response.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
}
