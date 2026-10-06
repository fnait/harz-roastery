import { useState } from "react";
import { css, cx } from "@emotion/css";

import AdminProducts from "./Admin_Page_Products";
import AdminOrders from "./Admin_Page_Orders";
import AdminCourses from "./Admin_Page_Courses";
import AdminCustomRoasting from "./Admin_Page_CustomRoasting";
import AdminCourseEnrollments from "./Admin_Page_CourseEnrollments";

import type { Course } from "../data/courses";
import type { CourseEnrollment } from "../data/courseEnrollments";
import type { CustomRoastingRequest } from "../data/customRoasting";
import type { Order } from "../data/orders";
import type { CartProduct } from "../data/products";
import {
  adminTranslations,
  type AdminLanguage,
} from "./utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  setLanguage: React.Dispatch<React.SetStateAction<AdminLanguage>>;
  onLogout: () => void;
  products: CartProduct[];
  setProducts: React.Dispatch<React.SetStateAction<CartProduct[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  ordersLoading: boolean;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  customRoastingRequests: CustomRoastingRequest[];
  setCustomRoastingRequests: React.Dispatch<
    React.SetStateAction<CustomRoastingRequest[]>
  >;
  customRoastingRequestsLoading: boolean;
  courseEnrollments: CourseEnrollment[];
  setCourseEnrollments: React.Dispatch<
    React.SetStateAction<CourseEnrollment[]>
  >;
  courseEnrollmentsLoading: boolean;
};

type AdminPage =
  | "dashboard"
  | "products"
  | "orders"
  | "courses"
  | "course-enrollments"
  | "custom-roasting";

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const admin_layout = css({
  display: "grid",
  gridTemplateColumns: "240px 1fr",

  minHeight: "100vh",

  backgroundColor: "var(--bg-page)",

  color: "var(--text-main)",

  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
  },
});

const sidebar = css({
  position: "sticky",
  top: 0,
  display: "flex",
  flexDirection: "column",
  alignSelf: "start",
  overflowY: "auto",

  height: "100vh",
  minHeight: "100vh",
  boxSizing: "border-box",

  padding: "28px 20px",

  backgroundColor: "var(--bg-card)",
  borderRight: "1px solid var(--sand-line)",

  "@media (max-width: 768px)": {
    position: "static",

    height: "auto",
    minHeight: "auto",

    borderRight: "none",
    borderBottom: "1px solid var(--sand-line)",
  },
});

const sidebar_logo = css({
  marginBottom: "20px",
  fontSize: "20px",
  fontWeight: "800",
});

const language_switcher = css({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",

  marginBottom: "28px",
  padding: "4px",
  gap: "6px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",

  "& button": {
    width: "100%",

    padding: "8px 10px",

    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",

    color: "var(--text-muted)",
    font: "inherit",
    fontSize: "12px",
    fontWeight: "700",

    cursor: "pointer",
    transition: "background-color 0.15s ease, color 0.15s ease",
  },
});

const active_language = css({
  backgroundColor: "var(--clay) !important",
  color: "#f3ede6 !important",
});

const sidebar_nav = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",

  "& button": {
    width: "100%",

    padding: "12px 14px",

    backgroundColor: "transparent",
    border: "none",
    borderRadius: "12px",

    color: "var(--text-muted)",
    font: "inherit",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "left",

    cursor: "pointer",
    transition: "background-color 0.15s ease, color 0.15s ease",

    "&:hover": {
      backgroundColor: "var(--chip-bg)",
      color: "var(--text-main)",
    },
  },
});

const active_button = css({
  backgroundColor: "var(--chip-bg) !important",
  color: "var(--text-main) !important",
});

const logout_button = css({
  width: "100%",

  marginTop: "auto",
  padding: "12px 14px",

  backgroundColor: "transparent",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",

  color: "var(--text-main)",
  font: "inherit",
  fontWeight: "600",

  cursor: "pointer",
  transition: "background-color 0.15s ease, border-color 0.15s ease",

  "&:hover": {
    backgroundColor: "var(--chip-bg)",
    borderColor: "var(--clay)",
  },

  "@media (max-width: 768px)": {
    marginTop: "20px",
  },
});

const admin_content = css({
  overflowX: "hidden",

  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",

  padding: "40px",

  "@media (max-width: 768px)": {
    padding: "24px",
  },

  "@media (max-width: 480px)": {
    padding: "20px 16px",
  },
});

const content_header = css({
  marginBottom: "32px",

  "& h1": {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
  },

  "& p": {
    margin: "8px 0 0",
    color: "var(--text-muted)",
    fontSize: "14px",
  },

  "@media (max-width: 480px)": {
    marginBottom: "24px",

    "& h1": {
      fontSize: "28px",
    },
  },
});

const dashboard_cards = css({
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  gap: "20px",

  "@media (max-width: 1280px)": {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },

  "@media (max-width: 900px)": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr",
  },
});

const dashboard_card = css({
  boxSizing: "border-box",

  padding: "24px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "20px",

  "& p": {
    margin: 0,

    color: "var(--text-muted)",
    fontSize: "13px",
    fontWeight: "600",
  },

  "& h2": {
    margin: "12px 0 0",
    fontSize: "30px",
    fontWeight: "800",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AdminDashboard({
  language,
  setLanguage,
  onLogout,
  products,
  setProducts,
  orders,
  setOrders,
  ordersLoading,
  courses,
  setCourses,
  customRoastingRequests,
  setCustomRoastingRequests,
  customRoastingRequestsLoading,
  courseEnrollments,
  setCourseEnrollments,
  courseEnrollmentsLoading,
}: Props) {
  const [page, setPage] = useState<AdminPage>("dashboard");
  const t = adminTranslations[language];

  // Title and description shown in the content header of each page.
  const pageHeader = {
    dashboard: t.dashboard,
    products: t.products,
    orders: t.orders,
    courses: t.courses,
    "course-enrollments": t.enrollments,
    "custom-roasting": t.roasting,
  }[page];

  return (
    <div className={cx(admin_layout, "font-onest")}>
      <aside className={sidebar}>
        <div className={sidebar_logo}>HARZ ADMIN</div>
        <div className={language_switcher}>
          <button
            type="button"
            className={language === "en" ? active_language : undefined}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            type="button"
            className={language === "uk" ? active_language : undefined}
            onClick={() => setLanguage("uk")}
          >
            UK
          </button>
        </div>
        <nav className={sidebar_nav}>
          <button
            type="button"
            className={page === "dashboard" ? active_button : undefined}
            onClick={() => setPage("dashboard")}
          >
            {t.sidebar.dashboard}
          </button>
          <button
            type="button"
            className={page === "products" ? active_button : undefined}
            onClick={() => setPage("products")}
          >
            {t.sidebar.products}
          </button>
          <button
            type="button"
            className={page === "orders" ? active_button : undefined}
            onClick={() => setPage("orders")}
          >
            {t.sidebar.orders}
          </button>
          <button
            type="button"
            className={page === "courses" ? active_button : undefined}
            onClick={() => setPage("courses")}
          >
            {t.sidebar.courses}
          </button>
          <button
            type="button"
            className={
              page === "course-enrollments" ? active_button : undefined
            }
            onClick={() => setPage("course-enrollments")}
          >
            {t.sidebar.courseEnrollments}
          </button>
          <button
            type="button"
            className={page === "custom-roasting" ? active_button : undefined}
            onClick={() => setPage("custom-roasting")}
          >
            {t.sidebar.customRoasting}
          </button>
        </nav>
        <button type="button" className={logout_button} onClick={onLogout}>
          {t.sidebar.logout}
        </button>
      </aside>
      <main className={admin_content}>
        <div className={content_header}>
          <h1>{pageHeader.title}</h1>
          <p>{pageHeader.description}</p>
        </div>
        {page === "dashboard" && (
          <div className={dashboard_cards}>
            <div className={dashboard_card}>
              <p>{t.dashboard.products}</p>
              <h2>{products.length}</h2>
            </div>
            <div className={dashboard_card}>
              <p>{t.dashboard.orders}</p>
              <h2>{orders.length}</h2>
            </div>
            <div className={dashboard_card}>
              <p>{t.dashboard.courses}</p>
              <h2>{courses.length}</h2>
            </div>
            <div className={dashboard_card}>
              <p>{t.dashboard.courseEnrollments}</p>
              <h2>{courseEnrollments.length}</h2>
            </div>
            <div className={dashboard_card}>
              <p>{t.dashboard.roastingRequests}</p>
              <h2>{customRoastingRequests.length}</h2>
            </div>
          </div>
        )}
        {page === "products" && (
          <AdminProducts
            language={language}
            products={products}
            setProducts={setProducts}
          />
        )}
        {page === "orders" && (
          <AdminOrders
            language={language}
            orders={orders}
            setOrders={setOrders}
            isLoading={ordersLoading}
          />
        )}
        {page === "courses" && (
          <AdminCourses
            language={language}
            courses={courses}
            setCourses={setCourses}
          />
        )}
        {page === "course-enrollments" && (
          <AdminCourseEnrollments
            language={language}
            enrollments={courseEnrollments}
            setEnrollments={setCourseEnrollments}
            isLoading={courseEnrollmentsLoading}
          />
        )}
        {page === "custom-roasting" && (
          <AdminCustomRoasting
            language={language}
            requests={customRoastingRequests}
            setRequests={setCustomRoastingRequests}
            isLoading={customRoastingRequestsLoading}
          />
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
