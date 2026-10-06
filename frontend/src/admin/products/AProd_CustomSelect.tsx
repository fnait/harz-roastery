import { useEffect, useRef, useState } from "react";
import { css, cx } from "@emotion/css";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const wrapper = css({
  position: "relative",
  width: "100%",
});

const button = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  width: "100%",
  boxSizing: "border-box",

  padding: "12px 14px",
  gap: "12px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",

  color: "var(--text-main)",
  textAlign: "left",
  font: "inherit",
  fontSize: "14px",
  fontWeight: "500",

  cursor: "pointer",
  transition: "border-color 0.15s ease",

  "&:hover": {
    borderColor: "var(--clay)",
  },
});

const button_open = css({
  borderColor: "var(--clay)",
});

const arrow = css({
  flexShrink: 0,

  color: "var(--text-muted)",
  fontSize: "10px",

  transition: "transform 0.15s ease",
});

const arrow_open = css({
  transform: "rotate(180deg)",
});

const menu = css({
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  right: 0,
  zIndex: 200,

  boxSizing: "border-box",

  padding: "6px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",
  boxShadow: "0 14px 35px rgba(0, 0, 0, 0.4)",

  animation: "customSelectAppear 0.15s ease",

  "@keyframes customSelectAppear": {
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

const selected_option = css({
  backgroundColor: "var(--chip-bg)",
  color: "var(--text-main)",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AProd_CustomSelect<T extends string>({
  value,
  options,
  onChange,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;

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

  return (
    <div ref={wrapperRef} className={wrapper}>
      <button
        type="button"
        className={cx(button, open && button_open)}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selectedLabel}</span>
        <span className={cx(arrow, open && arrow_open)} aria-hidden="true">
          ▼
        </span>
      </button>
      {open && (
        <div className={menu} role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={cx(
                option_button,
                option.value === value && selected_option,
              )}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AProd_CustomSelect;
