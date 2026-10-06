import type {
  CourseTranslationRequest,
  CourseTranslationResponse,
  DeepLTranslationResponse,
  ProductTranslationRequest,
  ProductTranslationResponse,
} from "../types/translation";

const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

// Translates Ukrainian texts to English, keeping the order of the input.
async function translateTexts(texts: string[]): Promise<string[]> {
  const apiKey = process.env.DEEPL_API_KEY;

  if (!apiKey) {
    throw new Error("DEEPL_API_KEY is not configured.");
  }

  const response = await fetch(DEEPL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: texts,
      source_lang: "UK",
      target_lang: "EN-US",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("DeepL API error:", response.status, errorText);

    throw new Error(`DeepL request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as DeepLTranslationResponse;

  if (!data.translations || data.translations.length !== texts.length) {
    throw new Error("Unexpected DeepL response.");
  }

  return data.translations.map((translation) => translation.text);
}

// ----------------------------------------------------------------------
// COURSE
// ----------------------------------------------------------------------

export async function translateCourseWithDeepL(
  content: CourseTranslationRequest,
): Promise<CourseTranslationResponse> {
  const [title, description, duration] = await translateTexts([
    content.title,
    content.description,
    content.duration,
  ]);

  return { title, description, duration };
}

// ----------------------------------------------------------------------
// PRODUCT
// ----------------------------------------------------------------------

export async function translateProductWithDeepL(
  content: ProductTranslationRequest,
): Promise<ProductTranslationResponse> {
  const [description] = await translateTexts([content.description]);

  return { description };
}
