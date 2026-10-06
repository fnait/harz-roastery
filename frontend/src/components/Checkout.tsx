import { useState, type FormEvent } from "react";
import { css } from "@emotion/css";

import { createOrder } from "../services/orderApi";

import type { OrderCustomer, OrderItem } from "../data/orders";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: "en" | "uk";
  cartItems: OrderItem[];
  clearCart: () => void;
  onClose: () => void;
  onOrderComplete: () => void;
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

  padding: "24px",

  backgroundColor: "rgba(0, 0, 0, 0.65)",
});

const checkout_card = css({
  overflowY: "auto",

  width: "100%",
  maxWidth: "560px",
  maxHeight: "90vh",
  boxSizing: "border-box",

  padding: "32px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "24px",

  color: "var(--text-main)",

  "@media (max-width: 600px)": {
    padding: "24px 18px",
  },
});

const header = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  marginBottom: "28px",
  gap: "16px",

  "& h2": {
    margin: 0,
    fontSize: "26px",
    fontWeight: "800",
  },
});

const close_button = css({
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "38px",
  height: "38px",

  padding: 0,

  backgroundColor: "var(--chip-bg)",
  border: "none",
  borderRadius: "50%",

  color: "var(--text-main)",
  fontSize: "22px",
  lineHeight: 1,

  cursor: "pointer",
});

const form = css({
  display: "flex",
  flexDirection: "column",
  gap: "18px",
});

const field = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",

  "& label": {
    fontSize: "13px",
    fontWeight: "600",
  },

  "& input, & textarea": {
    width: "100%",
    boxSizing: "border-box",

    padding: "12px 14px",

    backgroundColor: "var(--chip-bg)",
    border: "1px solid var(--sand-line)",
    borderRadius: "12px",

    color: "var(--text-main)",
    font: "inherit",

    outline: "none",
    transition: "border-color 0.15s ease",

    "&:focus": {
      borderColor: "var(--clay)",
    },
  },

  "& textarea": {
    minHeight: "90px",
    resize: "vertical",
  },
});

const summary = css({
  padding: "18px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "16px",
});

const summary_row = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",

  marginBottom: "8px",
  gap: "16px",

  fontSize: "14px",

  "&:last-child": {
    marginBottom: 0,
  },
});

const total_row = css({
  display: "flex",
  justifyContent: "space-between",

  marginTop: "16px",
  paddingTop: "16px",
  gap: "16px",

  borderTop: "1px solid var(--sand-line)",

  fontSize: "18px",
  fontWeight: "700",
});

const submit_button = css({
  width: "100%",

  padding: "14px",

  backgroundColor: "var(--clay)",
  border: "none",
  borderRadius: "100px",

  color: "#f3ede6",
  font: "inherit",
  fontWeight: "700",

  cursor: "pointer",
  transition: "opacity 0.15s ease",

  "&:hover": {
    opacity: 0.9,
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function Checkout({
  language,
  cartItems,
  clearCart,
  onClose,
  onOrderComplete,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customer, setCustomer] = useState<OrderCustomer>({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    comment: "",
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const changeField = (field: keyof OrderCustomer, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cartItems.length === 0 || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createOrder({
        customer: {
          name: customer.name.trim(),
          phone: customer.phone.trim(),
          email: customer.email.trim(),
          city: customer.city.trim(),
          address: customer.address.trim(),
          comment: customer.comment.trim(),
        },
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      onOrderComplete();
    } catch (error) {
      console.error("Order creation failed:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : language === "uk"
            ? "Не вдалося оформити замовлення."
            : "Failed to place order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={overlay}
      onMouseDown={(event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={checkout_card}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={header}>
          <h2>{language === "uk" ? "Оформлення замовлення" : "Checkout"}</h2>
          <button
            type="button"
            className={close_button}
            onClick={onClose}
            aria-label={language === "uk" ? "Закрити" : "Close"}
          >
            ×
          </button>
        </div>
        <form className={form} onSubmit={handleSubmit}>
          <div className={field}>
            <label htmlFor="checkout-name">
              {language === "uk" ? "Ім'я" : "Name"}
            </label>
            <input
              id="checkout-name"
              type="text"
              value={customer.name}
              onChange={(event) => changeField("name", event.target.value)}
              required
            />
          </div>
          <div className={field}>
            <label htmlFor="checkout-phone">
              {language === "uk" ? "Телефон" : "Phone"}
            </label>
            <input
              id="checkout-phone"
              type="tel"
              value={customer.phone}
              onChange={(event) => changeField("phone", event.target.value)}
              required
            />
          </div>
          <div className={field}>
            <label htmlFor="checkout-email">Email</label>
            <input
              id="checkout-email"
              type="email"
              value={customer.email}
              onChange={(event) => changeField("email", event.target.value)}
              required
            />
          </div>
          <div className={field}>
            <label htmlFor="checkout-city">
              {language === "uk" ? "Місто" : "City"}
            </label>
            <input
              id="checkout-city"
              type="text"
              value={customer.city}
              onChange={(event) => changeField("city", event.target.value)}
              required
            />
          </div>
          <div className={field}>
            <label htmlFor="checkout-address">
              {language === "uk" ? "Адреса" : "Address"}
            </label>
            <input
              id="checkout-address"
              type="text"
              value={customer.address}
              onChange={(event) => changeField("address", event.target.value)}
              required
            />
          </div>
          <div className={field}>
            <label htmlFor="checkout-comment">
              {language === "uk" ? "Коментар" : "Comment"}
            </label>
            <textarea
              id="checkout-comment"
              value={customer.comment}
              onChange={(event) => changeField("comment", event.target.value)}
            />
          </div>
          <div className={summary}>
            {cartItems.map((item) => (
              <div key={item.id} className={summary_row}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  ₴{(item.price * item.quantity).toLocaleString("en-US")}
                </span>
              </div>
            ))}
            <div className={total_row}>
              <span>{language === "uk" ? "Разом" : "Total"}</span>
              <span>₴{totalPrice.toLocaleString("en-US")}</span>
            </div>
          </div>
          <button
            type="submit"
            className={submit_button}
            disabled={cartItems.length === 0 || isSubmitting}
          >
            {isSubmitting
              ? language === "uk"
                ? "Оформлюємо..."
                : "Placing order..."
              : language === "uk"
                ? "Підтвердити замовлення"
                : "Place order"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
