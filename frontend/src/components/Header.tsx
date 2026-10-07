import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { css, cx } from "@emotion/css";

import C7_order_place from "./C7_order_place";

import type { OrderItem } from "../data/orders";
import { translations } from "./translations";

import img_cart from "../assets/header/cart.svg";
import img_menu from "../assets/header/menu.svg";
import logo_minimal from "../assets/logo_minimal.svg";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type HeaderProps = {
  language: "en" | "uk";
  setLanguage: Dispatch<SetStateAction<"en" | "uk">>;
  cartItems: OrderItem[];
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  refreshProducts: () => Promise<void>;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const header_place = css({
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1000,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  height: "80px",
  width: "100%",
  boxSizing: "border-box",

  padding: "0 80px",

  background: "var(--bg-page)",
  borderBottom: "1px solid var(--sand-line)",

  "@media (max-width: 1024px)": {
    padding: "0 40px",
  },

  "@media (max-width: 768px)": {
    height: "72px",
    padding: "0 24px",
  },

  "@media (max-width: 480px)": {
    height: "68px",
    padding: "0 16px",
  },
});

const logo_place = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  flexShrink: 0,

  gap: "10px",

  "& img": {
    height: "28px",
    width: "28px",
  },

  "& span": {
    fontWeight: "800",
    fontSize: "20px",
    whiteSpace: "nowrap",
  },

  "@media (max-width: 768px)": {
    "& span": {
      fontSize: "18px",
    },

    "& img": {
      height: "26px",
      width: "26px",
    },
  },

  "@media (max-width: 480px)": {
    "& span": {
      fontSize: "16px",
    },

    "& img": {
      height: "24px",
      width: "24px",
    },
  },

  "@media (max-width: 360px)": {
    "& span": {
      display: "none",
    },
  },
});

const navigation_wrapper = css({
  "@media (max-width: 900px)": {
    display: "none",
  },
});

const navigation = css({
  display: "flex",

  margin: 0,
  padding: 0,
  gap: "40px",

  listStyle: "none",

  "& a": {
    color: "var(--text-muted)",
    fontWeight: "500",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },

  "@media (max-width: 1100px)": {
    gap: "24px",
  },
});

const nav_place_buttons = css({
  display: "flex",
  alignItems: "center",
  gap: "16px",

  "& a": {
    textDecoration: "none",
    color: "inherit",
  },

  "@media (max-width: 768px)": {
    gap: "10px",
  },

  "@media (max-width: 480px)": {
    gap: "8px",
  },
});

const shop_button = css({
  padding: "12px 24px",

  background: "var(--clay)",
  border: "none",
  borderRadius: "100px",

  color: "#f3ede6",
  font: "inherit",
  fontSize: "14px",
  fontWeight: "600",

  cursor: "pointer",

  "@media (max-width: 768px)": {
    padding: "10px 18px",
    fontSize: "13px",
  },

  "@media (max-width: 520px)": {
    display: "none",
  },
});

const nav_buttons = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,

  height: "36px",
  width: "36px",

  padding: 0,

  background: "var(--chip-bg)",
  border: "none",
  borderRadius: "100px",

  cursor: "pointer",

  "& img": {
    width: "16px",
    height: "16px",
  },

  "@media (max-width: 480px)": {
    height: "34px",
    width: "34px",
  },
});

const menu_wrapper = css({
  position: "relative",
});

const dropdown_menu = css({
  position: "absolute",
  top: "calc(100% + 12px)",
  right: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",

  minWidth: "220px",
  boxSizing: "border-box",

  padding: "8px",

  background: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "18px",
  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.18)",

  animation: "menuFadeIn 0.18s ease",

  "@keyframes menuFadeIn": {
    from: {
      opacity: 0,
      transform: "translateY(-6px)",
    },

    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },

  "& button": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    width: "100%",

    padding: "12px 14px",

    background: "transparent",
    border: "none",
    borderRadius: "12px",

    color: "var(--text-main)",
    textAlign: "left",
    font: "inherit",
    fontSize: "13px",
    fontWeight: "600",

    cursor: "pointer",
    transition: "background-color 0.18s ease",

    "&:hover": {
      backgroundColor: "var(--chip-bg)",
    },
  },

  "& button span:last-child": {
    color: "var(--text-muted)",
    fontWeight: "500",
  },

  "& button + button": {
    marginTop: "4px",
  },

  "@media (max-width: 480px)": {
    right: "-4px",
    minWidth: "200px",
    borderRadius: "16px",

    "& button": {
      padding: "11px 12px",
      fontSize: "12px",
    },
  },
});

const cart_button_wrapper = css({
  position: "relative",
});

const cart_badge = css({
  position: "absolute",
  top: "-6px",
  right: "-6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  minWidth: "18px",
  height: "18px",
  boxSizing: "border-box",

  padding: "0 5px",

  backgroundColor: "var(--clay)",
  borderRadius: "100px",

  color: "#f3ede6",
  fontSize: "10px",
  fontWeight: "700",

  pointerEvents: "none",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function Header({
  language,
  setLanguage,
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  refreshProducts,
}: HeaderProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  const totalCartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleLanguage = () => {
    setLanguage((current) => (current === "en" ? "uk" : "en"));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={cx("font-onest", header_place)}>
      <div className={logo_place}>
        <img src={logo_minimal} alt="HARZ Roastery" />
        <span>HARZ ROASTERY</span>
      </div>
      <div className={navigation_wrapper}>
        <nav aria-label="main-navigation">
          <ul className={navigation}>
            <li>
              <a href="#about">{t.nav.home}</a>
            </li>
            <li>
              <a href="#coffee">{t.nav.coffee}</a>
            </li>
            <li>
              <a href="#courses">{t.nav.courses}</a>
            </li>
            <li>
              <a href="#shop">{t.nav.shop}</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className={nav_place_buttons}>
        <a href="#shop">
          <button className={shop_button} type="button">
            {t.nav.shop}
          </button>
        </a>
        <div className={cart_button_wrapper}>
          <button
            type="button"
            className={nav_buttons}
            aria-label="Cart"
            onClick={() => setCartOpen(true)}
          >
            <img className="icon" src={img_cart} alt="" />
          </button>
          {totalCartQuantity > 0 && (
            <span className={cart_badge}>{totalCartQuantity}</span>
          )}
        </div>
        <div className={menu_wrapper} ref={menuRef}>
          <button
            type="button"
            className={nav_buttons}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Menu"
          >
            <img className="icon" src={img_menu} alt="" />
          </button>
          {menuOpen && (
            <div className={dropdown_menu}>
              <button type="button" onClick={toggleTheme}>
                {t.nav.theme}:{" "}
                {theme === "dark" ? t.nav.theme_dark : t.nav.theme_light}
              </button>
              <button type="button" onClick={toggleLanguage}>
                {t.nav.language}: {language === "en" ? "English" : "Українська"}
              </button>
            </div>
          )}
        </div>
      </div>
      {cartOpen && (
        <C7_order_place
          language={language}
          onClose={() => setCartOpen(false)}
          cartItems={cartItems}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          refreshProducts={refreshProducts}
        />
      )}
    </header>
  );
}

export default Header;
