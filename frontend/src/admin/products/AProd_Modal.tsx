import { useState } from "react";
import { css } from "@emotion/css";

import ImageEditorModal from "../utils/ImageEditorModal";
import AProd_CustomSelect, { type SelectOption } from "./AProd_CustomSelect";

import { uploadProductImage } from "../../services/imageUploadApi";
import { translateProduct } from "../../services/productTranslation";

import type { CartProduct } from "../../data/products";
import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type ProductDraft = Omit<CartProduct, "id" | "popularity">;

type Props = {
  language: AdminLanguage;
  product: CartProduct | null;
  onClose: () => void;
  onSave: (product: ProductDraft) => void;
};

type ProductForm = {
  name: string;
  roast: string;
  roastColor: string;
  weight: string;
  price: string;
  descriptionUk: string;
  descriptionEn: string;
  category: CartProduct["category"];
  inStock: boolean;
  image: string;
  // Firebase Storage — primary
  imageStoragePath?: string;
  // Cloudinary — fallback
  imagePublicId?: string;
};

// ----------------------------------------------------------------------
// FORM INITIALIZATION
// ----------------------------------------------------------------------

const weightOptions: SelectOption<string>[] = [
  { value: "250g", label: "250g" },
  { value: "500g", label: "500g" },
  { value: "1kg", label: "1kg" },
];

const createInitialForm = (product: CartProduct | null): ProductForm => {
  if (product) {
    return {
      name: product.name,
      roast: product.roast,
      roastColor: product.roastColor,
      weight: product.weight,
      price: String(product.price),
      descriptionUk: product.description.uk,
      descriptionEn: product.description.en,
      category: product.category,
      inStock: product.inStock,
      image: product.image,
      imageStoragePath: product.imageStoragePath,
      imagePublicId: product.imagePublicId,
    };
  }

  return {
    name: "",
    roast: "Light Roast",
    roastColor: "#D9A96E",
    weight: "250g",
    price: "",
    descriptionUk: "",
    descriptionEn: "",
    category: "single-origin",
    inStock: true,
    image: "",
    imageStoragePath: undefined,
    imagePublicId: undefined,
  };
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const overlay = css({
  position: "fixed",
  inset: 0,
  zIndex: 5000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  boxSizing: "border-box",

  padding: "20px",

  backgroundColor: "rgba(0, 0, 0, 0.6)",

  "@media (max-width: 600px)": {
    alignItems: "flex-start",
    padding: "12px",
  },
});

const modal = css({
  overflowY: "auto",

  width: "100%",
  maxWidth: "520px",
  maxHeight: "calc(100vh - 40px)",
  boxSizing: "border-box",

  padding: "28px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "24px",

  "& h2": {
    margin: "0 0 24px",
    fontSize: "24px",
  },

  "@media (max-width: 600px)": {
    maxHeight: "calc(100vh - 24px)",
    padding: "20px",
    borderRadius: "18px",

    "& h2": {
      marginBottom: "20px",
      fontSize: "21px",
    },
  },
});

const form = css({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const field = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",

  "& > label": {
    fontSize: "13px",
    fontWeight: "600",
  },

  "& > input, & > textarea": {
    width: "100%",
    boxSizing: "border-box",

    padding: "12px 14px",

    backgroundColor: "var(--chip-bg)",
    border: "1px solid var(--sand-line)",
    borderRadius: "12px",

    color: "var(--text-main)",
    font: "inherit",

    outline: "none",

    "&:focus": {
      borderColor: "var(--clay)",
    },
  },

  "& > textarea": {
    minHeight: "100px",
    resize: "vertical",
  },
});

const image_upload = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const image_preview = css({
  overflow: "hidden",

  width: "180px",
  height: "180px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "18px",

  "& img": {
    display: "block",

    width: "100%",
    height: "100%",

    objectFit: "cover",
  },

  "@media (max-width: 480px)": {
    width: "140px",
    height: "140px",
  },
});

const image_actions = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",

  "& label, & button": {
    padding: "9px 14px",

    backgroundColor: "var(--chip-bg)",
    border: "1px solid var(--sand-line)",
    borderRadius: "100px",

    color: "var(--text-main)",
    font: "inherit",
    fontSize: "13px",
    fontWeight: "600",

    cursor: "pointer",
  },

  "& input": {
    display: "none",
  },
});

const remove_image_button = css({
  color: "var(--clay) !important",
});

const checkbox_field = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",

  "& input": {
    width: "18px",
    height: "18px",

    accentColor: "var(--clay)",
    cursor: "pointer",
  },
});

const form_buttons = css({
  display: "flex",
  justifyContent: "flex-end",

  marginTop: "8px",
  gap: "10px",

  "@media (max-width: 480px)": {
    display: "grid",
    gridTemplateColumns: "1fr",

    "& button": {
      width: "100%",
    },
  },
});

const cancel_button = css({
  padding: "11px 16px",

  backgroundColor: "transparent",
  border: "1px solid var(--sand-line)",
  borderRadius: "100px",

  color: "var(--text-main)",
  font: "inherit",
  fontWeight: "600",

  cursor: "pointer",
});

const save_button = css({
  padding: "11px 18px",

  backgroundColor: "var(--clay)",
  border: "none",
  borderRadius: "100px",

  color: "#f3ede6",
  font: "inherit",
  fontWeight: "700",

  cursor: "pointer",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AProd_Modal({ language, product, onClose, onSave }: Props) {
  const t = adminTranslations[language].products;

  const categoryOptions: SelectOption<CartProduct["category"]>[] = [
    { value: "single-origin", label: t.categories.singleOrigin },
    { value: "espresso", label: t.categories.espresso },
    { value: "rare", label: t.categories.rare },
    { value: "decaf", label: t.categories.decaf },
  ];

  const roastOptions: SelectOption<string>[] = [
    { value: "Light Roast", label: t.roastLevels.light },
    { value: "Medium Roast", label: t.roastLevels.medium },
    { value: "Dark Roast", label: t.roastLevels.dark },
  ];

  const [formData, setFormData] = useState<ProductForm>(() =>
    createInitialForm(product),
  );
  const [imageEditorSrc, setImageEditorSrc] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleRoastChange = (roast: string) => {
    let roastColor = "#D9A96E";

    if (roast === "Medium Roast") {
      roastColor = "#C96A4B";
    }

    if (roast === "Dark Roast") {
      roastColor = "#7A4A2E";
    }

    setFormData((current) => ({ ...current, roast, roastColor }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      window.alert(t.invalidImageFile);
      return;
    }

    const maxFileSize = 10 * 1024 * 1024;

    if (file.size > maxFileSize) {
      window.alert(t.imageTooLarge);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageEditorSrc(reader.result);
      }
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleImageSave = async (image: string) => {
    try {
      const uploadedImage = await uploadProductImage(image);

      setFormData((current) => ({
        ...current,
        image: uploadedImage.url,
        imageStoragePath: uploadedImage.storagePath,
        imagePublicId: uploadedImage.publicId,
      }));
      setImageEditorSrc(null);
    } catch (error) {
      console.error("Image upload failed:", error);

      window.alert(
        error instanceof Error ? error.message : "Failed to upload image.",
      );

      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const price = Number(formData.price);

    if (!formData.name.trim() || Number.isNaN(price) || price <= 0) {
      return;
    }

    const descriptionUk = formData.descriptionUk.trim();
    let descriptionEn = formData.descriptionEn.trim();

    if (descriptionUk && !descriptionEn) {
      try {
        setIsTranslating(true);

        const result = await translateProduct({ description: descriptionUk });
        descriptionEn = result.description;
      } catch (error) {
        console.error("Product translation failed:", error);

        window.alert(
          error instanceof Error ? error.message : "Translation failed.",
        );

        return;
      } finally {
        setIsTranslating(false);
      }
    }

    onSave({
      name: formData.name.trim(),
      roast: formData.roast,
      roastColor: formData.roastColor,
      weight: formData.weight,
      price,
      description: { uk: descriptionUk, en: descriptionEn },
      category: formData.category,
      inStock: formData.inStock,
      image: formData.image,
      imageStoragePath: formData.imageStoragePath,
      imagePublicId: formData.imagePublicId,
    });
  };

  const handleTranslateDescription = async () => {
    const descriptionUk = formData.descriptionUk.trim();

    if (!descriptionUk) {
      return;
    }

    try {
      setIsTranslating(true);

      const result = await translateProduct({ description: descriptionUk });

      setFormData((current) => ({
        ...current,
        descriptionEn: result.description,
      }));
    } catch (error) {
      console.error("Product translation failed:", error);

      window.alert(
        error instanceof Error ? error.message : "Translation failed.",
      );
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <>
      <div
        className={overlay}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div className={modal} onMouseDown={(event) => event.stopPropagation()}>
          <h2>{product ? t.editTitle : t.addTitle}</h2>
          <form className={form} onSubmit={handleSubmit}>
            <div className={field}>
              <label>{t.productImage}</label>
              <div className={image_upload}>
                {formData.image && (
                  <div className={image_preview}>
                    <img src={formData.image} alt={t.imagePreview} />
                  </div>
                )}
                <div className={image_actions}>
                  <label>
                    {formData.image ? t.changeImage : t.uploadImage}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageSelect}
                    />
                  </label>
                  {formData.image && (
                    <>
                      <button
                        type="button"
                        onClick={() => setImageEditorSrc(formData.image)}
                      >
                        {t.editImage}
                      </button>
                      <button
                        type="button"
                        className={remove_image_button}
                        onClick={() =>
                          setFormData((current) => ({
                            ...current,
                            image: "",
                            imageStoragePath: undefined,
                            imagePublicId: undefined,
                          }))
                        }
                      >
                        {t.removeImage}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className={field}>
              <label htmlFor="product-name">{t.name}</label>
              <input
                id="product-name"
                type="text"
                value={formData.name}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className={field}>
              <label htmlFor="product-description-uk">
                {language === "uk"
                  ? "Опис — українською"
                  : "Description — Ukrainian"}
              </label>
              <textarea
                id="product-description-uk"
                rows={4}
                value={formData.descriptionUk}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    descriptionUk: event.target.value,
                  }))
                }
              />
            </div>
            <div className={field}>
              <label htmlFor="product-description-en">
                {language === "uk"
                  ? "Опис — англійською"
                  : "Description — English"}
              </label>
              <textarea
                id="product-description-en"
                rows={4}
                value={formData.descriptionEn}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    descriptionEn: event.target.value,
                  }))
                }
              />
              <button
                type="button"
                onClick={handleTranslateDescription}
                disabled={isTranslating || !formData.descriptionUk.trim()}
                style={{
                  alignSelf: "flex-start",
                  padding: "9px 14px",
                  border: "1px solid var(--sand-line)",
                  borderRadius: "100px",
                  background: "var(--chip-bg)",
                  color: "var(--text-main)",
                  font: "inherit",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isTranslating ? "wait" : "pointer",
                }}
              >
                {isTranslating
                  ? language === "uk"
                    ? "Перекладаємо..."
                    : "Translating..."
                  : language === "uk"
                    ? "Перекласти англійською"
                    : "Translate to English"}
              </button>
            </div>
            <div className={field}>
              <label>{t.category}</label>
              <AProd_CustomSelect
                value={formData.category}
                options={categoryOptions}
                onChange={(category) =>
                  setFormData((current) => ({ ...current, category }))
                }
              />
            </div>
            <div className={field}>
              <label>{t.roast}</label>
              <AProd_CustomSelect
                value={formData.roast}
                options={roastOptions}
                onChange={handleRoastChange}
              />
            </div>
            <div className={field}>
              <label>{t.weight}</label>
              <AProd_CustomSelect
                value={formData.weight}
                options={weightOptions}
                onChange={(weight) =>
                  setFormData((current) => ({ ...current, weight }))
                }
              />
            </div>
            <div className={field}>
              <label htmlFor="product-price">{t.price}</label>
              <input
                id="product-price"
                type="number"
                min="1"
                step="1"
                value={formData.price}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    price: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className={field}>
              <label>{t.availability}</label>
              <div className={checkbox_field}>
                <input
                  id="product-stock"
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      inStock: event.target.checked,
                    }))
                  }
                />
                <label htmlFor="product-stock">{t.inStock}</label>
              </div>
            </div>
            <div className={form_buttons}>
              <button type="button" className={cancel_button} onClick={onClose}>
                {t.cancel}
              </button>
              <button
                type="submit"
                className={save_button}
                disabled={isTranslating}
              >
                {product ? t.saveChanges : t.add}
              </button>
            </div>
          </form>
        </div>
      </div>
      {imageEditorSrc && (
        <ImageEditorModal
          language={language}
          imageSrc={imageEditorSrc}
          onCancel={() => setImageEditorSrc(null)}
          onSave={handleImageSave}
        />
      )}
    </>
  );
}

export default AProd_Modal;
