import { useEffect, useRef, useState } from "react";
import { css, cx } from "@emotion/css";

import type { OrderStatus } from "../../data/orders";
import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  status: OrderStatus;
  onChange: (status: OrderStatus) => void;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const wrapper = css({
  position: "relative",
  minWidth: "145px",
});

const button = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  width: "100%",
  minHeight: "42px",

  padding: "10px 14px",
  gap: "12px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",

  color: "var(--text-main)",
  font: "inherit",
  fontSize: "13px",
  fontWeight: "600",

  cursor: "pointer",
  transition: "border-color 0.15s ease, background-color 0.15s ease",

  "&:hover": {
    borderColor: "var(--clay)",
  },
});

const button_open = css({
  borderColor: "var(--clay)",
});

const arrow = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  color: "var(--text-muted)",
  fontSize: "10px",

  transition: "transform 0.15s ease",
});

const arrow_open = css({
  transform: "rotate(180deg)",
});

const menu = css({
  position: "absolute",
  top: "calc(100% + 8px)",
  right: 0,
  zIndex: 100,

  width: "100%",
  minWidth: "165px",
  boxSizing: "border-box",

  padding: "6px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",
  boxShadow: "0 14px 35px rgba(0, 0, 0, 0.35)",

  animation: "statusDropdownIn 0.15s ease",

  "@keyframes statusDropdownIn": {
    from: {
      opacity: 0,
      transform: "translateY(-4px)",
    },

    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
});

const option_button = css({
  display: "flex",
  alignItems: "center",

  width: "100%",

  padding: "10px 12px",

  backgroundColor: "transparent",
  border: "none",
  borderRadius: "8px",

  color: "var(--text-muted)",
  textAlign: "left",
  font: "inherit",
  fontSize: "13px",
  fontWeight: "600",

  cursor: "pointer",
  transition: "background-color 0.15s ease, color 0.15s ease",

  "&:hover": {
    backgroundColor: "var(--chip-bg)",
    color: "var(--text-main)",
  },
});

const active_option = css({
  backgroundColor: "var(--chip-bg)",
  color: "var(--text-main)",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AOrder_StatusSelect({ language, status, onChange }: Props) {
  const t = adminTranslations[language].orders;
  const statusLabels: Record<OrderStatus, string> = {
    new: t.status.new,
    processing: t.status.processing,
    shipped: t.status.shipped,
    completed: t.status.completed,
    cancelled: t.status.cancelled,
  };

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleChange = (nextStatus: OrderStatus) => {
    onChange(nextStatus);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className={wrapper}>
      <button
        type="button"
        className={cx(button, open && button_open)}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{statusLabels[status]}</span>
        <span className={cx(arrow, open && arrow_open)} aria-hidden="true">
          ▼
        </span>
      </button>
      {open && (
        <div className={menu} role="listbox">
          {(Object.keys(statusLabels) as OrderStatus[]).map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === status}
              className={cx(
                option_button,
                option === status && active_option,
              )}
              onClick={() => handleChange(option)}
            >
              {statusLabels[option]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AOrder_StatusSelect;
