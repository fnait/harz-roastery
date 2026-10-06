export type CourseTranslationRequest = {
  title: string;
  description: string;
  duration: string;
};

export type CourseTranslationResponse = {
  title: string;
  description: string;
  duration: string;
};

export type DeepLTranslationResponse = {
  translations: {
    detected_source_language?: string;
    text: string;
  }[];
};

export type ProductTranslationRequest = {
  description: string;
};

export type ProductTranslationResponse = {
  description: string;
};
