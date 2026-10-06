import { getCloudinaryClient } from "../config/cloudinary";

import {
  deleteProductImageFromFirebase,
  uploadProductImageToFirebase,
} from "./firebaseImageUpload.service";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type ImageUploadResult = {
  url: string;
  storagePath?: string;
  publicId?: string;
};

type ImageStorageProvider = "firebase" | "cloudinary";

// ----------------------------------------------------------------------
// CONFIG
// ----------------------------------------------------------------------

function getImageStorageProvider(): ImageStorageProvider {
  const provider = process.env.IMAGE_STORAGE_PROVIDER?.trim().toLowerCase();

  if (provider !== "firebase" && provider !== "cloudinary") {
    throw new Error(
      "IMAGE_STORAGE_PROVIDER must be either 'firebase' or 'cloudinary'.",
    );
  }

  return provider;
}

// ----------------------------------------------------------------------
// UPLOAD
// ----------------------------------------------------------------------

export async function uploadProductImage(
  dataUrl: string,
): Promise<ImageUploadResult> {
  const provider = getImageStorageProvider();

  if (provider === "firebase") {
    const result = await uploadProductImageToFirebase(dataUrl);

    return {
      url: result.url,
      storagePath: result.storagePath,
    };
  }

  const cloudinary = getCloudinaryClient();

  const result = await cloudinary.uploader.upload(dataUrl, {
    resource_type: "image",
    folder: "harz/products",
    overwrite: false,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function deleteProductImage(options: {
  storagePath?: string;
  publicId?: string;
}): Promise<void> {
  if (options.storagePath) {
    await deleteProductImageFromFirebase(options.storagePath);

    return;
  }

  if (options.publicId) {
    const cloudinary = getCloudinaryClient();

    await cloudinary.uploader.destroy(options.publicId, {
      resource_type: "image",
    });
  }
}
