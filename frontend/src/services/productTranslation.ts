import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export type ProductTranslationInput = {
  description: string;
};

export type ProductTranslationResult = {
  description: string;
};

export async function translateProduct(
  content: ProductTranslationInput,
): Promise<ProductTranslationResult> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Authentication required.");
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/api/translate/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(content),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Translation failed.");
  }

  return (await response.json()) as ProductTranslationResult;
}
