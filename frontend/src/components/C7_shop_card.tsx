import { css, cx } from "@emotion/css";

import type { CartProduct } from "../data/products";
import { translations } from "./translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  product: CartProduct;
  onAddToCart: () => void;
  language: "en" | "uk";
};

// ----------------------------------------------------------------------
// CONSTANTS
// ----------------------------------------------------------------------

const PLACEHOLDER_IMAGE = "/images/coffee-placeholder.webp";

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const c7_card = css({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",

  width: "100%",
  minWidth: 0,
  height: "100%",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "24px",
});

const c7_card_image = css({
  overflow: "hidden",

  width: "100%",
  aspectRatio: "1 / 1",

  backgroundColor: "var(--chip-bg)",

  "& img": {
    display: "block",

    width: "100%",
    height: "100%",

    objectFit: "cover",
  },
});

const c7_card_info = css({
  display: "flex",
  flexDirection: "column",
  flex: 1,

  padding: "24px",
  gap: "20px",

  backgroundColor: "var(--bg-card)",

  "@media (max-width: 768px)": {
    padding: "20px",
    gap: "18px",
  },

  "@media (max-width: 480px)": {
    padding: "12px",
    gap: "12px",
  },
});

const c7_card_info_top = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",

  "& p": {
    margin: 0,
  },
});

const c7_roast = css({
  display: "flex",
  alignItems: "center",

  gap: "8px",

  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: "600",
});

const c7_card_dot = css({
  flexShrink: 0,

  width: "10px",
  height: "10px",

  borderRadius: "50%",
});

const product_name = css({
  margin: 0,

  fontSize: "18px",
  fontWeight: "700",
  lineHeight: "130%",

  "@media (max-width: 480px)": {
    fontSize: "15px",
  },
});

const product_description = css({
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",

  margin: 0,

  color: "var(--text-muted)",
  fontSize: "13px",
  fontWeight: "400",
  lineHeight: "150%",

  "@media (max-width: 480px)": {
    fontSize: "11px",
  },
});

const product_meta = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  marginTop: "4px",
  gap: "12px",
});

const product_weight = css({
  margin: 0,

  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: "500",

  "@media (max-width: 480px)": {
    fontSize: "10px",
  },
});

const stock = css({
  margin: 0,
  fontSize: "11px",
  fontWeight: "600",
});

const in_stock = css({
  color: "#4f9d69",
});

const out_of_stock = css({
  color: "var(--clay)",
});

const c7_card_info_bot = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  marginTop: "auto",
  gap: "16px",

  "@media (max-width: 600px)": {
    flexDirection: "column",
    alignItems: "stretch",
    gap: "10px",
  },
});

const product_price = css({
  margin: 0,

  fontSize: "18px",
  fontWeight: "700",
  whiteSpace: "nowrap",

  "@media (max-width: 480px)": {
    fontSize: "15px",
  },
});

const add_button = css({
  padding: "12px 24px",

  backgroundColor: "var(--clay)",
  border: "1px solid var(--sand-line)",
  borderRadius: "24px",

  color: "#f3ede6",
  font: "inherit",
  fontSize: "14px",
  fontWeight: "600",
  textAlign: "center",
  whiteSpace: "nowrap",

  cursor: "pointer",
  transition: "opacity 0.15s ease",

  "&:hover": {
    opacity: 0.9,
  },

  "&:disabled": {
    opacity: 0.4,
    cursor: "not-allowed",
  },

  "@media (max-width: 480px)": {
    width: "100%",

    padding: "12px 8px",

    fontSize: "12px",
    whiteSpace: "normal",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function C7_shop_card({ product, onAddToCart, language }: Props) {
  const t = translations[language];

  return (
    <article className={c7_card}>
      <div className={c7_card_image}>
        <img
          src={product.image || PLACEHOLDER_IMAGE}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>
      <div className={c7_card_info}>
        <div className={c7_card_info_top}>
          <div className={c7_roast}>
            <span
              className={c7_card_dot}
              style={{ backgroundColor: product.roastColor }}
            />
            <p>{product.roast}</p>
          </div>
          <h4 className={product_name}>{product.name}</h4>
          <p className={product_description}>{product.description[language]}</p>
          <div className={product_meta}>
            <p className={product_weight}>{product.weight}</p>
            <p className={cx(stock, product.inStock ? in_stock : out_of_stock)}>
              {product.inStock ? "In stock" : "Out of stock"}
            </p>
          </div>
        </div>
        <div className={c7_card_info_bot}>
          <p className={product_price}>₴{product.price}</p>
          <button
            type="button"
            className={add_button}
            onClick={onAddToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? t.c7.add_to_cart : "Out of stock"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default C7_shop_card;
