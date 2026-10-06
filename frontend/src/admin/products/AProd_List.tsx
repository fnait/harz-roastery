import { css, cx } from "@emotion/css";

import type { CartProduct } from "../../data/products";
import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  products: CartProduct[];
  onEdit: (product: CartProduct) => void;
  onDelete: (id: number) => void;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const table_wrapper = css({
  overflow: "hidden",

  width: "100%",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "20px",

  "@media (max-width: 700px)": {
    display: "none",
  },
});

const table = css({
  width: "100%",
  borderCollapse: "collapse",

  "& th": {
    padding: "16px 18px",

    borderBottom: "1px solid var(--sand-line)",

    color: "var(--text-muted)",
    fontSize: "12px",
    fontWeight: "700",
    textAlign: "left",
  },

  "& td": {
    padding: "18px",
    borderBottom: "1px solid var(--sand-line)",
    fontSize: "14px",
  },

  "& tr:last-child td": {
    borderBottom: "none",
  },
});

const roast_wrap = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const roast_dot = css({
  flexShrink: 0,

  width: "10px",
  height: "10px",

  borderRadius: "50%",
});

const actions = css({
  display: "flex",
  gap: "8px",
});

const action_button = css({
  padding: "8px 12px",

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

const delete_button = css({
  color: "var(--clay)",
});

// ----------------------------------------------------------------------
// MOBILE STYLES
// ----------------------------------------------------------------------

const mobile_products = css({
  display: "none",

  "@media (max-width: 700px)": {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
});

const mobile_card = css({
  padding: "18px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "18px",
});

const mobile_top = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",

  marginBottom: "16px",
  gap: "16px",
});

const mobile_info = css({
  minWidth: 0,

  "& h3": {
    overflow: "hidden",

    margin: 0,

    fontSize: "16px",
    fontWeight: "700",
    textOverflow: "ellipsis",
  },

  "& p": {
    margin: "6px 0 0",
    color: "var(--text-muted)",
    fontSize: "12px",
  },
});

const mobile_price = css({
  flexShrink: 0,
  fontSize: "16px",
  fontWeight: "800",
});

const mobile_meta = css({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",

  marginBottom: "16px",
  gap: "10px",
});

const mobile_meta_item = css({
  padding: "10px 12px",
  backgroundColor: "var(--chip-bg)",
  borderRadius: "10px",

  "& span": {
    display: "block",

    marginBottom: "4px",

    color: "var(--text-muted)",
    fontSize: "10px",
    fontWeight: "600",
    textTransform: "uppercase",
  },

  "& strong": {
    display: "flex",
    alignItems: "center",

    gap: "7px",

    fontSize: "12px",
  },
});

const mobile_actions = css({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",

  "& button": {
    width: "100%",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AProd_List({ language, products, onEdit, onDelete }: Props) {
  const t = adminTranslations[language].products;
  const roastLabels: Record<string, string> = {
    "Light Roast": t.roastLevels.light,
    "Medium Roast": t.roastLevels.medium,
    "Dark Roast": t.roastLevels.dark,
  };

  return (
    <>
      {/* DESKTOP */}
      <div className={table_wrapper}>
        <table className={table}>
          <thead>
            <tr>
              <th>{t.product}</th>
              <th>{t.roast}</th>
              <th>{t.weight}</th>
              <th>{t.price}</th>
              <th>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>
                  <div className={roast_wrap}>
                    <span
                      className={roast_dot}
                      style={{ backgroundColor: product.roastColor }}
                    />
                    {roastLabels[product.roast] ?? product.roast}
                  </div>
                </td>
                <td>{product.weight}</td>
                <td>₴{product.price.toLocaleString("en-US")}</td>
                <td>
                  <div className={actions}>
                    <button
                      type="button"
                      className={action_button}
                      onClick={() => onEdit(product)}
                    >
                      {t.edit}
                    </button>
                    <button
                      type="button"
                      className={cx(action_button, delete_button)}
                      onClick={() => onDelete(product.id)}
                    >
                      {t.delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* MOBILE */}
      <div className={mobile_products}>
        {products.map((product) => (
          <article key={product.id} className={mobile_card}>
            <div className={mobile_top}>
              <div className={mobile_info}>
                <h3>{product.name}</h3>
                <p>#{product.id}</p>
              </div>
              <strong className={mobile_price}>
                ₴{product.price.toLocaleString("en-US")}
              </strong>
            </div>
            <div className={mobile_meta}>
              <div className={mobile_meta_item}>
                <span>{t.roast}</span>
                <strong>
                  <i
                    className={roast_dot}
                    style={{ backgroundColor: product.roastColor }}
                  />
                  {roastLabels[product.roast] ?? product.roast}
                </strong>
              </div>
              <div className={mobile_meta_item}>
                <span>{t.weight}</span>
                <strong>{product.weight}</strong>
              </div>
            </div>
            <div className={mobile_actions}>
              <button
                type="button"
                className={action_button}
                onClick={() => onEdit(product)}
              >
                {t.edit}
              </button>
              <button
                type="button"
                className={cx(action_button, delete_button)}
                onClick={() => onDelete(product.id)}
              >
                {t.delete}
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export default AProd_List;
