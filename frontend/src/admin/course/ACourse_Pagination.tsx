import { css, cx } from "@emotion/css";

import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const pagination = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",

  marginTop: "32px",
  gap: "8px",
});

const page_button = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  minWidth: "40px",
  height: "40px",

  padding: "0 12px",

  backgroundColor: "transparent",
  border: "1px solid var(--sand-line)",
  borderRadius: "10px",

  color: "var(--text-main)",
  font: "inherit",
  fontSize: "13px",
  fontWeight: "700",

  cursor: "pointer",
  transition: "background-color 0.15s ease, border-color 0.15s ease",

  "&:hover:not(:disabled)": {
    backgroundColor: "var(--chip-bg)",
    borderColor: "var(--clay)",
  },

  "&:disabled": {
    opacity: 0.4,
    cursor: "default",
  },
});

const active_page = css({
  backgroundColor: "var(--clay) !important",
  borderColor: "var(--clay) !important",
  color: "#f3ede6 !important",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function ACourse_Pagination({
  language,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const t = adminTranslations[language].courses.pagination;

  if (totalPages <= 1) {
    return null;
  }

  const getPages = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <div className={pagination}>
      <button
        type="button"
        className={page_button}
        disabled={currentPage === 1}
        aria-label={t.previous}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ←
      </button>
      {getPages().map((page) => (
        <button
          key={page}
          type="button"
          className={cx(page_button, page === currentPage && active_page)}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`${page}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className={page_button}
        disabled={currentPage === totalPages}
        aria-label={t.next}
        onClick={() => onPageChange(currentPage + 1)}
      >
        →
      </button>
    </div>
  );
}

export default ACourse_Pagination;
