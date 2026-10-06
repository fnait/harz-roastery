import { randomUUID } from "node:crypto";

import { getDownloadURL } from "firebase-admin/storage";

import { firebaseStorage } from "../config/firebase";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type FirebaseImageUploadResult = {
  url: string;
  storagePath: string;
};

type SupportedImageType = "image/webp" | "image/jpeg" | "image/png";

// ----------------------------------------------------------------------
// CONFIG
// ----------------------------------------------------------------------

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const EXTENSIONS: Record<SupportedImageType, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// ----------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------

function parseImageDataUrl(dataUrl: string): {
  buffer: Buffer;
  contentType: SupportedImageType;
} {
  const match = dataUrl.match(/^data:(image\/(?:webp|jpeg|png));base64,(.+)$/);

  if (!match) {
    throw new Error(
      "Invalid image. Only WEBP, JPEG and PNG images are supported.",
    );
  }

  const contentType = match[1] as SupportedImageType;
  const buffer = Buffer.from(match[2], "base64");

  if (buffer.length === 0) {
    throw new Error("Image is empty.");
  }

  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new Error("Image is too large. Maximum size is 5 MB.");
  }

  return { buffer, contentType };
}

// ----------------------------------------------------------------------
// UPLOAD
// ----------------------------------------------------------------------

export async function uploadProductImageToFirebase(
  dataUrl: string,
): Promise<FirebaseImageUploadResult> {
  const { buffer, contentType } = parseImageDataUrl(dataUrl);
  const extension = EXTENSIONS[contentType];
  const storagePath = `products/${randomUUID()}.${extension}`;

  const bucket = firebaseStorage.bucket();
  const file = bucket.file(storagePath);

  await file.save(buffer, {
    resumable: false,
    metadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  const url = await getDownloadURL(file);

  return { url, storagePath };
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function deleteProductImageFromFirebase(
  storagePath: string,
): Promise<void> {
  if (!storagePath.trim()) {
    return;
  }

  const bucket = firebaseStorage.bucket();
  const file = bucket.file(storagePath);

  const [exists] = await file.exists();

  if (!exists) {
    return;
  }

  await file.delete();
}
