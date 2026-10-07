import { useState } from "react";
import { css } from "@emotion/css";
import close_icon from "../../assets/close_icon.svg";

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
  stock: string;

  descriptionUk: string;
  descriptionEn: string;

  category: CartProduct["category"];
  inStock: boolean;

  image: string;
  imageStoragePath?: string;
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
      stock: String(product.stock ?? 0),
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
    stock: "10",
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
  display: "flex",
  flexDirection: "column",

  width: "100%",
  maxWidth: "720px",
  maxHeight: "calc(100vh - 40px)",
  boxSizing: "border-box",

  overflow: "hidden",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "24px",

  color: "var(--text-main)",

  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",

  "@media (max-width: 700px)": {
    maxHeight: "calc(100vh - 24px)",
    borderRadius: "18px",
  },
});

const modal_header = css({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",

  padding: "26px 28px 22px",
  gap: "20px",

  borderBottom: "1px solid var(--sand-line)",

  "& h2": {
    margin: 0,

    fontSize: "26px",
    fontWeight: "800",
    lineHeight: "125%",
  },

  "& p": {
    margin: "7px 0 0",

    color: "var(--text-muted)",

    fontSize: "13px",
    lineHeight: "150%",
  },

  "@media (max-width: 600px)": {
    padding: "22px 20px 18px",

    "& h2": {
      fontSize: "22px",
    },
  },
});

const close_button = css({
  flexShrink: 0,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "34px",
  height: "34px",

  padding: 0,

  backgroundColor: "var(--chip-bg)",
  border: "none",
  borderRadius: "50%",

  cursor: "pointer",

  "& img": {
    width: "15px",
    height: "15px",
  },

  "&:hover": {
    opacity: 0.8,
  },
});

const modal_body = css({
  overflowY: "auto",

  padding: "24px 28px 28px",

  "@media (max-width: 600px)": {
    padding: "20px",
  },
});

const form_section = css({
  display: "flex",
  flexDirection: "column",

  gap: "16px",

  padding: "20px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "18px",
});

const section_title = css({
  margin: 0,

  color: "var(--text-main)",

  fontSize: "14px",
  fontWeight: "800",
});

const fields_grid = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",

  gap: "16px",

  "@media (max-width: 620px)": {
    gridTemplateColumns: "1fr",
  },
});

const full_width = css({
  gridColumn: "1 / -1",

  "@media (max-width: 620px)": {
    gridColumn: "auto",
  },
});

const form = css({
  display: "flex",
  flexDirection: "column",

  gap: "20px",
});

const field = css({
  display: "flex",
  flexDirection: "column",

  gap: "7px",

  "& > label": {
    color: "var(--text-muted)",

    fontSize: "12px",
    fontWeight: "700",
  },

  "& > input, & > textarea": {
    width: "100%",
    boxSizing: "border-box",

    padding: "12px 14px",

    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--sand-line)",
    borderRadius: "12px",

    color: "var(--text-main)",

    font: "inherit",
    fontSize: "14px",

    outline: "none",

    transition: "border-color 0.15s ease",

    "&:hover": {
      borderColor: "var(--text-muted)",
    },

    "&:focus": {
      borderColor: "var(--clay)",
    },
  },

  "& > textarea": {
    minHeight: "110px",
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
  position: "sticky",
  bottom: "-28px",
  zIndex: 10,

  display: "flex",
  justifyContent: "flex-end",

  margin: "4px -28px -28px",
  padding: "18px 28px",

  gap: "10px",

  backgroundColor: "var(--bg-card)",
  borderTop: "1px solid var(--sand-line)",

  "@media (max-width: 600px)": {
    bottom: "-20px",

    margin: "4px -20px -20px",
    padding: "16px 20px",
  },

  "@media (max-width: 480px)": {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",

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

const translate_button = css({
  alignSelf: "flex-start",

  padding: "9px 14px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "100px",

  color: "var(--text-main)",

  font: "inherit",
  fontSize: "13px",
  fontWeight: "600",

  cursor: "pointer",

  transition: "border-color 0.15s ease, opacity 0.15s ease",

  "&:hover:not(:disabled)": {
    borderColor: "var(--text-muted)",
  },

  "&:disabled": {
    opacity: 0.45,
    cursor: "not-allowed",
  },
});

const availability_box = css({
  display: "flex",
  alignItems: "center",

  minHeight: "44px",
  boxSizing: "border-box",

  padding: "0 14px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",
});

const image_section_content = css({
  display: "flex",
  alignItems: "flex-start",

  gap: "20px",

  "@media (max-width: 520px)": {
    flexDirection: "column",
  },
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
    const stock = Number(formData.stock);

    if (
      !formData.name.trim() ||
      Number.isNaN(price) ||
      price <= 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
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
      stock,
      description: {
        uk: descriptionUk,
        en: descriptionEn,
      },
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
          {/* HEADER */}
          <div className={modal_header}>
            <div>
              <h2>{product ? t.editTitle : t.addTitle}</h2>

              <p>
                {language === "uk"
                  ? product
                    ? "Редагуйте інформацію, ціну, залишок і параметри товару."
                    : "Додайте новий товар до каталогу магазину."
                  : product
                    ? "Edit product information, price, stock and settings."
                    : "Add a new product to the shop catalogue."}
              </p>
            </div>

            <button
              type="button"
              className={close_button}
              onClick={onClose}
              aria-label={language === "uk" ? "Закрити" : "Close"}
            >
              <img src={close_icon} alt="" />
            </button>
          </div>

          {/* SCROLLABLE BODY */}
          <div className={modal_body}>
            <form className={form} onSubmit={handleSubmit}>
              {/* ---------------------------------------------------------- */}
              {/* IMAGE */}
              {/* ---------------------------------------------------------- */}

              <section className={form_section}>
                <h3 className={section_title}>
                  {language === "uk" ? "Зображення товару" : "Product image"}
                </h3>

                <div className={image_section_content}>
                  {formData.image && (
                    <div className={image_preview}>
                      <img src={formData.image} alt={t.imagePreview} />
                    </div>
                  )}

                  <div className={image_upload}>
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

                    {!formData.image && (
                      <p
                        style={{
                          margin: 0,
                          color: "var(--text-muted)",
                          fontSize: "12px",
                          lineHeight: "150%",
                        }}
                      >
                        {language === "uk"
                          ? "PNG, JPEG або WEBP. Максимальний розмір — 10 МБ."
                          : "PNG, JPEG or WEBP. Maximum size — 10 MB."}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* ---------------------------------------------------------- */}
              {/* BASIC INFORMATION */}
              {/* ---------------------------------------------------------- */}

              <section className={form_section}>
                <h3 className={section_title}>
                  {language === "uk"
                    ? "Основна інформація"
                    : "Basic information"}
                </h3>

                <div className={fields_grid}>
                  <div className={`${field} ${full_width}`}>
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
                      rows={5}
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
                      rows={5}
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
                      className={translate_button}
                      onClick={handleTranslateDescription}
                      disabled={isTranslating || !formData.descriptionUk.trim()}
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
                </div>
              </section>

              {/* ---------------------------------------------------------- */}
              {/* PRODUCT SETTINGS */}
              {/* ---------------------------------------------------------- */}

              <section className={form_section}>
                <h3 className={section_title}>
                  {language === "uk"
                    ? "Налаштування товару"
                    : "Product settings"}
                </h3>

                <div className={fields_grid}>
                  <div className={field}>
                    <label>{t.category}</label>

                    <AProd_CustomSelect
                      value={formData.category}
                      options={categoryOptions}
                      onChange={(category) =>
                        setFormData((current) => ({
                          ...current,
                          category,
                        }))
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
                        setFormData((current) => ({
                          ...current,
                          weight,
                        }))
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
                    <label htmlFor="product-stock-quantity">
                      {language === "uk"
                        ? "Кількість на складі"
                        : "Stock quantity"}
                    </label>

                    <input
                      id="product-stock-quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.stock}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          stock: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className={field}>
                    <label>{t.availability}</label>

                    <div className={availability_box}>
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
                  </div>
                </div>
              </section>

              {/* ---------------------------------------------------------- */}
              {/* ACTIONS */}
              {/* ---------------------------------------------------------- */}

              <div className={form_buttons}>
                <button
                  type="button"
                  className={cancel_button}
                  onClick={onClose}
                >
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
