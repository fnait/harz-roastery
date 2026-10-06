import { css, cx } from "@emotion/css";

import AProd_CustomSelect, { type SelectOption } from "./AProd_CustomSelect";

import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type ProductSortOption =
  | "name-asc"
  | "name-desc"
  | "price-low"
  | "price-high"
  | "popularity";

type Props = {
  language: AdminLanguage;
  productCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOption: ProductSortOption;
  onSortChange: (option: ProductSortOption) => void;
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

  "@media (max-width: 650px)": {
    flexDirection: "column",
    alignItems: "stretch",
  },
});

const product_count = css({
  margin: 0,

  color: "var(--text-muted)",
  fontSize: "14px",
  fontWeight: "600",
});

const top_actions = css({
  display: "flex",
  gap: "10px",

  "@media (max-width: 650px)": {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },

  "@media (max-width: 420px)": {
    gridTemplateColumns: "1fr",
  },
});

const button = css({
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
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  gap: "12px",

  "@media (max-width: 650px)": {
    flexDirection: "column",
    alignItems: "stretch",
  },
});

const search_wrapper = css({
  width: "100%",
  maxWidth: "360px",

  "@media (max-width: 650px)": {
    maxWidth: "100%",
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

const sort_wrapper = css({
  width: "220px",

  "@media (max-width: 650px)": {
    width: "100%",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AProd_Toolbar({
  language,
  productCount,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  onReset,
  onAdd,
}: Props) {
  const t = adminTranslations[language].products;

  const sortOptions: SelectOption<ProductSortOption>[] = [
    { value: "name-asc", label: t.sort.nameAsc },
    { value: "name-desc", label: t.sort.nameDesc },
    { value: "price-low", label: t.sort.priceLow },
    { value: "price-high", label: t.sort.priceHigh },
    { value: "popularity", label: t.sort.popularity },
  ];

  const pluralCategory = new Intl.PluralRules(language).select(productCount);
  const productCountLabel =
    pluralCategory === "one"
      ? t.countOne
      : pluralCategory === "few"
        ? t.countFew
        : t.countMany;

  return (
    <div className={wrapper}>
      <div className={top_bar}>
        <p className={product_count}>
          {productCount} {productCountLabel}
        </p>
        <div className={top_actions}>
          <button
            type="button"
            className={cx(button, reset_button)}
            onClick={onReset}
          >
            {t.reset}
          </button>
          <button
            type="button"
            className={cx(button, add_button)}
            onClick={onAdd}
          >
            + {t.add}
          </button>
        </div>
      </div>
      <div className={controls}>
        <div className={search_wrapper}>
          <input
            className={search_input}
            type="search"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <div className={sort_wrapper}>
          <AProd_CustomSelect
            value={sortOption}
            options={sortOptions}
            onChange={onSortChange}
          />
        </div>
      </div>
    </div>
  );
}

export default AProd_Toolbar;
