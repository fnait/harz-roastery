import { css, cx } from "@emotion/css";

import type { Course } from "../../data/courses";
import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const card = css({
  display: "flex",
  flexDirection: "column",

  boxSizing: "border-box",

  padding: "22px",
  gap: "20px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "20px",
});

const top = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",

  gap: "16px",
});

const title_block = css({
  display: "flex",
  flexDirection: "column",

  minWidth: 0,

  gap: "6px",

  "& h3": {
    margin: 0,

    fontSize: "18px",
    fontWeight: "800",
    lineHeight: "130%",
  },

  "& p": {
    margin: 0,
    color: "var(--text-muted)",
    fontSize: "12px",
  },
});

const status_badge = css({
  flexShrink: 0,

  padding: "7px 10px",

  borderRadius: "100px",

  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase",
});

const active_badge = css({
  backgroundColor: "rgba(74, 222, 128, 0.12)",
  color: "#4ade80",
});

const inactive_badge = css({
  backgroundColor: "var(--chip-bg)",
  color: "var(--text-muted)",
});

const description_block = css({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",

  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr",
  },
});

const language_block = css({
  minWidth: 0,

  padding: "14px",

  backgroundColor: "var(--chip-bg)",
  borderRadius: "14px",

  "& span": {
    display: "block",

    marginBottom: "8px",

    color: "var(--clay)",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  "& h4": {
    margin: "0 0 6px",

    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "135%",
  },

  "& p": {
    margin: 0,

    color: "var(--text-muted)",
    fontSize: "12px",
    lineHeight: "150%",
  },
});

const meta = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "10px",
});

const meta_item = css({
  padding: "12px",
  backgroundColor: "var(--chip-bg)",
  borderRadius: "12px",

  "& span": {
    display: "block",

    marginBottom: "4px",

    color: "var(--text-muted)",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  "& strong": {
    fontSize: "13px",
  },
});

const actions = css({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "8px",

  "@media (max-width: 520px)": {
    gridTemplateColumns: "1fr",
  },
});

const action_button = css({
  minHeight: "40px",

  padding: "9px 12px",

  backgroundColor: "transparent",
  border: "1px solid var(--sand-line)",
  borderRadius: "10px",

  color: "var(--text-main)",
  font: "inherit",
  fontSize: "12px",
  fontWeight: "600",

  cursor: "pointer",

  "&:hover": {
    backgroundColor: "var(--chip-bg)",
  },
});

const toggle_button = css({
  color: "var(--text-main)",
});

const delete_button = css({
  color: "var(--clay)",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function ACourse_Card({
  language,
  course,
  onEdit,
  onDelete,
  onToggleActive,
}: Props) {
  const t = adminTranslations[language].courses;
  const currentTitle = course.title[language];
  const currentDuration = course.duration[language];

  return (
    <article className={card}>
      <div className={top}>
        <div className={title_block}>
          <h3>{currentTitle}</h3>
          <p>#{course.id}</p>
        </div>
        <span
          className={cx(
            status_badge,
            course.active ? active_badge : inactive_badge,
          )}
        >
          {course.active ? t.active : t.inactive}
        </span>
      </div>
      <div className={description_block}>
        <div className={language_block}>
          <span>{t.ukrainian}</span>
          <h4>{course.title.uk}</h4>
          <p>{course.description.uk}</p>
        </div>
        <div className={language_block}>
          <span>{t.english}</span>
          <h4>{course.title.en}</h4>
          <p>{course.description.en}</p>
        </div>
      </div>
      <div className={meta}>
        <div className={meta_item}>
          <span>{t.duration}</span>
          <strong>{currentDuration}</strong>
        </div>
        <div className={meta_item}>
          <span>{t.price}</span>
          <strong>₴{course.price.toLocaleString("en-US")}</strong>
        </div>
      </div>
      <div className={actions}>
        <button
          type="button"
          className={cx(action_button, toggle_button)}
          onClick={() => onToggleActive(course.id)}
        >
          {course.active ? t.setInactive : t.setActive}
        </button>
        <button
          type="button"
          className={action_button}
          onClick={() => onEdit(course)}
        >
          {t.edit}
        </button>
        <button
          type="button"
          className={cx(action_button, delete_button)}
          onClick={() => onDelete(course.id)}
        >
          {t.delete}
        </button>
      </div>
    </article>
  );
}

export default ACourse_Card;
