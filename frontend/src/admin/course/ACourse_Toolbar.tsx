import { css, cx } from "@emotion/css";

import AProd_CustomSelect, {
  type SelectOption,
} from "../products/AProd_CustomSelect";

import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type CourseSortOption =
  | "title-asc"
  | "title-desc"
  | "price-low"
  | "price-high"
  | "active-first";

type Props = {
  language: AdminLanguage;
  courseCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOption: CourseSortOption;
  onSortChange: (option: CourseSortOption) => void;
  showInactive: boolean;
  onShowInactiveChange: (value: boolean) => void;
  onReset: () => void;
  onAdd: () => void;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const wrapper = css({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

const top_bar = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  gap: "16px",

  "@media (max-width: 700px)": {
    flexDirection: "column",
    alignItems: "stretch",
  },
});

const course_count = css({
  margin: 0,

  color: "var(--text-muted)",
  fontSize: "14px",
  fontWeight: "600",
});

const top_actions = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",

  "@media (max-width: 700px)": {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },

  "@media (max-width: 420px)": {
    gridTemplateColumns: "1fr",
  },
});

const base_button = css({
  padding: "12px 18px",

  borderRadius: "100px",

  font: "inherit",
  fontSize: "14px",
  fontWeight: "600",
  whiteSpace: "nowrap",

  cursor: "pointer",
});

const reset_button = css({
  backgroundColor: "transparent",
  border: "1px solid var(--sand-line)",
  color: "var(--text-main)",

  "&:hover": {
    backgroundColor: "var(--chip-bg)",
  },
});

const add_button = css({
  backgroundColor: "var(--clay)",
  border: "none",

  color: "#f3ede6",
  fontWeight: "700",
});

const controls = css({
  display: "grid",
  gridTemplateColumns: "minmax(220px, 1fr) 220px auto",
  alignItems: "center",

  gap: "12px",

  "@media (max-width: 850px)": {
    gridTemplateColumns: "1fr 1fr",
  },

  "@media (max-width: 650px)": {
    gridTemplateColumns: "1fr",
  },
});

const search_input = css({
  width: "100%",
  boxSizing: "border-box",

  padding: "12px 14px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",

  color: "var(--text-main)",
  font: "inherit",
  fontSize: "14px",

  outline: "none",

  "&::placeholder": {
    color: "var(--text-muted)",
  },

  "&:focus": {
    borderColor: "var(--clay)",
  },
});

const inactive_control = css({
  display: "flex",
  alignItems: "center",

  minHeight: "44px",
  boxSizing: "border-box",

  padding: "0 14px",
  gap: "10px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",

  color: "var(--text-main)",

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
    whiteSpace: "nowrap",
  },

  "@media (max-width: 850px)": {
    gridColumn: "1 / -1",
  },

  "@media (max-width: 650px)": {
    gridColumn: "auto",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function ACourse_Toolbar({
  language,
  courseCount,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  showInactive,
  onShowInactiveChange,
  onReset,
  onAdd,
}: Props) {
  const t = adminTranslations[language].courses;

  const sortOptions: SelectOption<CourseSortOption>[] = [
    { value: "title-asc", label: t.sort.titleAsc },
    { value: "title-desc", label: t.sort.titleDesc },
    { value: "price-low", label: t.sort.priceLow },
    { value: "price-high", label: t.sort.priceHigh },
    { value: "active-first", label: t.sort.activeFirst },
  ];

  const pluralCategory = new Intl.PluralRules(language).select(courseCount);
  const courseCountLabel =
    pluralCategory === "one"
      ? t.countOne
      : pluralCategory === "few"
        ? t.countFew
        : t.countMany;
  const courseCountText = `${courseCount} ${courseCountLabel}`;

  return (
    <div className={wrapper}>
      <div className={top_bar}>
        <p className={course_count}>{courseCountText}</p>
        <div className={top_actions}>
          <button
            type="button"
            className={cx(base_button, reset_button)}
            onClick={onReset}
          >
            {t.reset}
          </button>
          <button
            type="button"
            className={cx(base_button, add_button)}
            onClick={onAdd}
          >
            + {t.add}
          </button>
        </div>
      </div>
      <div className={controls}>
        <input
          className={search_input}
          type="search"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <AProd_CustomSelect
          value={sortOption}
          options={sortOptions}
          onChange={onSortChange}
        />
        <label className={inactive_control}>
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(event) => onShowInactiveChange(event.target.checked)}
          />
          <span>{t.showInactive}</span>
        </label>
      </div>
    </div>
  );
}

export default ACourse_Toolbar;
