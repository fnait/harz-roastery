import { useEffect, useRef, useState } from "react";
import { css, cx } from "@emotion/css";

import type { CustomRoastingStatus } from "../../data/customRoasting";
import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  status: CustomRoastingStatus;
  onChange: (status: CustomRoastingStatus) => void;
};

const statuses: CustomRoastingStatus[] = [
  "new",
  "contacted",
  "in-progress",
  "completed",
  "cancelled",
];

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const wrapper = css({
  position: "relative",
  minWidth: "150px",
});

const trigger = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  width: "100%",

  padding: "10px 14px",
  gap: "12px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",

  color: "var(--text-main)",
  font: "inherit",
  fontSize: "13px",
  fontWeight: "700",

  cursor: "pointer",

  "&::after": {
    content: '"▾"',
    color: "var(--text-muted)",
    fontSize: "10px",
  },
});

const dropdown = css({
  position: "absolute",
  top: "calc(100% + 6px)",
  right: 0,
  zIndex: 100,

  width: "100%",
  boxSizing: "border-box",

  padding: "6px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",
  boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
});

const option_button = css({
  width: "100%",

  padding: "10px",

  backgroundColor: "transparent",
  border: "none",
  borderRadius: "8px",

  color: "var(--text-muted)",
  font: "inherit",
  fontSize: "13px",
  textAlign: "left",

  cursor: "pointer",

  "&:hover": {
    backgroundColor: "var(--chip-bg)",
    color: "var(--text-main)",
  },
});

const active_option = css({
  backgroundColor: "var(--chip-bg) !important",
  color: "var(--text-main) !important",
  fontWeight: "700 !important",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function ARoast_StatusSelect({ language, status, onChange }: Props) {
  const t = adminTranslations[language].roasting;
  const statusLabels: Record<CustomRoastingStatus, string> = {
    new: t.status.new,
    contacted: t.status.contacted,
    "in-progress": t.status.inProgress,
    completed: t.status.completed,
    cancelled: t.status.cancelled,
  };

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={trigger}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {statusLabels[status]}
      </button>
      {open && (
        <div className={dropdown} role="listbox">
          {statuses.map((statusOption) => (
            <button
              key={statusOption}
              type="button"
              role="option"
              aria-selected={statusOption === status}
              className={cx(
                option_button,
                statusOption === status && active_option,
              )}
              onClick={() => {
                onChange(statusOption);
                setOpen(false);
              }}
            >
              {statusLabels[statusOption]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ARoast_StatusSelect;
