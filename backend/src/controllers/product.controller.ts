import type { Request, Response } from "express";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type LocalizedProductText,
  type Product,
  type ProductCategory,
  resetProducts,
} from "../services/product.service";

// ----------------------------------------------------------------------
// VALIDATION
// ----------------------------------------------------------------------

const PRODUCT_CATEGORIES: ProductCategory[] = [
  "single-origin",
  "espresso",
  "rare",
  "decaf",
];

function isProductCategory(value: unknown): value is ProductCategory {
  return (
    typeof value === "string" &&
    PRODUCT_CATEGORIES.includes(value as ProductCategory)
  );
}

function isLocalizedText(value: unknown): value is LocalizedProductText {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const text = value as Partial<LocalizedProductText>;

  return typeof text.en === "string" && typeof text.uk === "string";
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isValidProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const product = value as Partial<Product>;

  return (
    typeof product.id === "number" &&
    Number.isInteger(product.id) &&
    product.id > 0 &&
    typeof product.name === "string" &&
    product.name.trim().length > 0 &&
    typeof product.roast === "string" &&
    typeof product.roastColor === "string" &&
    typeof product.weight === "string" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    product.price > 0 &&
    isLocalizedText(product.description) &&
    isProductCategory(product.category) &&
    typeof product.inStock === "boolean" &&
    typeof product.image === "string" &&
    isOptionalString(product.imageStoragePath) &&
    isOptionalString(product.imagePublicId) &&
    typeof product.popularity === "number" &&
    Number.isFinite(product.popularity) &&
    product.popularity >= 0
  );
}

// ----------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------

export async function getAllProducts(_request: Request, response: Response) {
  try {
    const products = await getProducts();
    response.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    response.status(500).json({ message: "Failed to load products." });
  }
}

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------

export async function addProduct(request: Request, response: Response) {
  if (!isValidProduct(request.body)) {
    response.status(400).json({ message: "Invalid product data." });
    return;
  }

  try {
    const product = await createProduct(request.body);
    response.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    response.status(500).json({ message: "Failed to create product." });
  }
}

// ----------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------

export async function editProduct(request: Request, response: Response) {
  const id = Number(request.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    response.status(400).json({ message: "Invalid product id." });
    return;
  }

  if (!isValidProduct(request.body)) {
    response.status(400).json({ message: "Invalid product data." });
    return;
  }

  try {
    const product = await updateProduct(id, request.body);
    response.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    response.status(500).json({ message: "Failed to update product." });
  }
}

// ----------------------------------------------------------------------
// RESET
// ----------------------------------------------------------------------

export async function resetAllProducts(_request: Request, response: Response) {
  try {
    const products = await resetProducts();

    response.json(products);
  } catch (error) {
    console.error("Reset products error:", error);

    response.status(500).json({
      message: "Failed to reset products.",
    });
  }
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function removeProduct(request: Request, response: Response) {
  const id = Number(request.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    response.status(400).json({ message: "Invalid product id." });
    return;
  }

  try {
    await deleteProduct(id);
    response.status(204).send();
  } catch (error) {
    console.error("Delete product error:", error);
    response.status(500).json({ message: "Failed to delete product." });
  }
}
