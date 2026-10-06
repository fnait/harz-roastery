import { useState } from "react";
import { css, cx } from "@emotion/css";

import type {
  CourseTranslationInput,
  CourseTranslationResult,
} from "../../services/courseTranslation";

import type { Course } from "../../data/courses";
import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type CourseDraft = Omit<Course, "id">;

type Props = {
  language: AdminLanguage;
  course: Course | null;
  onClose: () => void;
  onSave: (course: CourseDraft) => void;
  onTranslate?: (
    content: CourseTranslationInput,
  ) => Promise<CourseTranslationResult>;
};

type CourseForm = {
  titleUk: string;
  titleEn: string;
  descriptionUk: string;
  descriptionEn: string;
  durationUk: string;
  durationEn: string;
  price: string;
  active: boolean;
};

// ----------------------------------------------------------------------
// FORM INITIALIZATION
// ----------------------------------------------------------------------

const createInitialForm = (course: Course | null): CourseForm => {
  if (course) {
    return {
      titleUk: course.title.uk,
      titleEn: course.title.en,
      descriptionUk: course.description.uk,
      descriptionEn: course.description.en,
      durationUk: course.duration.uk,
      durationEn: course.duration.en,
      price: String(course.price),
      active: course.active,
    };
  }

  return {
    titleUk: "",
    titleEn: "",
    descriptionUk: "",
    descriptionEn: "",
    durationUk: "",
    durationEn: "",
    price: "",
    active: true,
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

  "@media (max-width: 700px)": {
    alignItems: "flex-start",
    overflowY: "auto",
    padding: "12px",
  },
});

const modal = css({
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",

  width: "100%",
  maxWidth: "900px",
  maxHeight: "calc(100vh - 40px)",
  boxSizing: "border-box",

  padding: "28px",
  gap: "24px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "24px",

  "@media (max-width: 700px)": {
    maxHeight: "none",
    padding: "20px",
    borderRadius: "18px",
  },
});

const header = css({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",

  gap: "20px",

  "& h2": {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
  },

  "& p": {
    margin: "6px 0 0",
    color: "var(--text-muted)",
    fontSize: "13px",
  },
});

const close_button = css({
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "36px",
  height: "36px",

  padding: 0,

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "50%",

  color: "var(--text-main)",
  font: "inherit",
  fontSize: "18px",

  cursor: "pointer",

  "&:hover": {
    borderColor: "var(--clay)",
  },
});

const form = css({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const language_grid = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "20px",

  "@media (max-width: 750px)": {
    gridTemplateColumns: "1fr",
  },
});

const language_card = css({
  display: "flex",
  flexDirection: "column",

  minWidth: 0,

  padding: "20px",
  gap: "18px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "18px",
});

const language_header = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  gap: "12px",

  "& h3": {
    margin: 0,
    fontSize: "15px",
    fontWeight: "800",
  },
});

const language_badge = css({
  padding: "5px 9px",

  border: "1px solid var(--sand-line)",
  borderRadius: "100px",

  color: "var(--text-muted)",
  fontSize: "10px",
  fontWeight: "700",
  textTransform: "uppercase",
});

const field = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",

  "& label": {
    color: "var(--text-muted)",
    fontSize: "12px",
    fontWeight: "700",
  },

  "& input, & textarea": {
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

    "&:focus": {
      borderColor: "var(--clay)",
    },
  },

  "& textarea": {
    minHeight: "120px",
    lineHeight: "150%",
    resize: "vertical",
  },
});

const translate_place = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const translate_button = css({
  padding: "11px 18px",

  backgroundColor: "transparent",
  border: "1px solid var(--clay)",
  borderRadius: "100px",

  color: "var(--clay)",
  font: "inherit",
  fontSize: "13px",
  fontWeight: "700",

  cursor: "pointer",

  "&:hover:not(:disabled)": {
    backgroundColor: "var(--clay)",
    color: "#f3ede6",
  },

  "&:disabled": {
    opacity: 0.45,
    cursor: "not-allowed",
  },
});

const settings_grid = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(180px, 0.5fr)",
  gap: "16px",

  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr",
  },
});

const active_control = css({
  display: "flex",
  alignItems: "center",

  minHeight: "46px",
  boxSizing: "border-box",

  padding: "0 14px",
  gap: "10px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",

  cursor: "pointer",

  "& input": {
    width: "18px",
    height: "18px",

    margin: 0,

    accentColor: "var(--clay)",
    cursor: "pointer",
  },

  "& span": {
    fontSize: "13px",
    fontWeight: "600",
  },
});

const footer = css({
  display: "flex",
  justifyContent: "flex-end",

  paddingTop: "4px",
  gap: "10px",

  "@media (max-width: 500px)": {
    display: "grid",
    gridTemplateColumns: "1fr",

    "& button": {
      width: "100%",
    },
  },
});

const base_button = css({
  padding: "11px 18px",

  borderRadius: "100px",

  font: "inherit",
  fontSize: "14px",
  fontWeight: "700",

  cursor: "pointer",
});

const cancel_button = css({
  backgroundColor: "transparent",
  border: "1px solid var(--sand-line)",
  color: "var(--text-main)",

  "&:hover": {
    backgroundColor: "var(--chip-bg)",
  },
});

const save_button = css({
  backgroundColor: "var(--clay)",
  border: "none",
  color: "#f3ede6",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function ACourse_Modal({
  language,
  course,
  onClose,
  onSave,
  onTranslate,
}: Props) {
  const t = adminTranslations[language].courses;

  const [formData, setFormData] = useState<CourseForm>(() =>
    createInitialForm(course),
  );
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!onTranslate) {
      return;
    }

    if (
      !formData.titleUk.trim() &&
      !formData.descriptionUk.trim() &&
      !formData.durationUk.trim()
    ) {
      return;
    }

    try {
      setTranslating(true);

      const result = await onTranslate({
        title: formData.titleUk.trim(),
        description: formData.descriptionUk.trim(),
        duration: formData.durationUk.trim(),
      });

      setFormData((current) => ({
        ...current,
        titleEn: result.title,
        descriptionEn: result.description,
        durationEn: result.duration,
      }));
    } catch (error) {
      console.error("Course translation failed:", error);

      window.alert(t.translationFailed);
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const price = Number(formData.price);

    if (
      !formData.titleUk.trim() ||
      !formData.titleEn.trim() ||
      !formData.descriptionUk.trim() ||
      !formData.descriptionEn.trim() ||
      !formData.durationUk.trim() ||
      !formData.durationEn.trim() ||
      Number.isNaN(price) ||
      price <= 0
    ) {
      return;
    }

    onSave({
      title: {
        uk: formData.titleUk.trim(),
        en: formData.titleEn.trim(),
      },
      description: {
        uk: formData.descriptionUk.trim(),
        en: formData.descriptionEn.trim(),
      },
      duration: {
        uk: formData.durationUk.trim(),
        en: formData.durationEn.trim(),
      },
      price,
      active: formData.active,
    });
  };

  return (
    <div
      className={overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={modal} onMouseDown={(event) => event.stopPropagation()}>
        <div className={header}>
          <div>
            <h2>{course ? t.editTitle : t.addTitle}</h2>
            <p>{t.modalDescription}</p>
          </div>
          <button
            type="button"
            className={close_button}
            onClick={onClose}
            aria-label={t.close}
            title={t.close}
          >
            ×
          </button>
        </div>
        <form className={form} onSubmit={handleSubmit}>
          <div className={language_grid}>
            {/* UKRAINIAN */}
            <section className={language_card}>
              <div className={language_header}>
                <h3>{t.ukrainian}</h3>
                <span className={language_badge}>UK</span>
              </div>
              <div className={field}>
                <label htmlFor="course-title-uk">{t.titleLabel}</label>
                <input
                  id="course-title-uk"
                  type="text"
                  value={formData.titleUk}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      titleUk: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className={field}>
                <label htmlFor="course-description-uk">
                  {t.descriptionLabel}
                </label>
                <textarea
                  id="course-description-uk"
                  value={formData.descriptionUk}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      descriptionUk: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className={field}>
                <label htmlFor="course-duration-uk">{t.durationLabel}</label>
                <input
                  id="course-duration-uk"
                  type="text"
                  placeholder={t.durationPlaceholderUk}
                  value={formData.durationUk}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      durationUk: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </section>
            {/* ENGLISH */}
            <section className={language_card}>
              <div className={language_header}>
                <h3>{t.english}</h3>
                <span className={language_badge}>EN</span>
              </div>
              <div className={field}>
                <label htmlFor="course-title-en">{t.titleLabel}</label>
                <input
                  id="course-title-en"
                  type="text"
                  value={formData.titleEn}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      titleEn: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className={field}>
                <label htmlFor="course-description-en">
                  {t.descriptionLabel}
                </label>
                <textarea
                  id="course-description-en"
                  value={formData.descriptionEn}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      descriptionEn: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className={field}>
                <label htmlFor="course-duration-en">{t.durationLabel}</label>
                <input
                  id="course-duration-en"
                  type="text"
                  placeholder={t.durationPlaceholderEn}
                  value={formData.durationEn}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      durationEn: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </section>
          </div>
          <div className={translate_place}>
            <button
              type="button"
              className={translate_button}
              onClick={handleTranslate}
              disabled={!onTranslate || translating}
              title={!onTranslate ? t.translationUnavailable : undefined}
            >
              {translating ? t.translating : t.translate}
            </button>
          </div>
          <div className={settings_grid}>
            <div className={field}>
              <label htmlFor="course-price">{t.price}, ₴</label>
              <input
                id="course-price"
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
            <label className={active_control}>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    active: event.target.checked,
                  }))
                }
              />
              <span>{t.activeCourse}</span>
            </label>
          </div>
          <div className={footer}>
            <button
              type="button"
              className={cx(base_button, cancel_button)}
              onClick={onClose}
            >
              {t.cancel}
            </button>
            <button type="submit" className={cx(base_button, save_button)}>
              {course ? t.save : t.add}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ACourse_Modal;
