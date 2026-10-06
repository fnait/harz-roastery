import { useEffect, useMemo, useState } from "react";
import { css, cx } from "@emotion/css";

import AProd_List from "./products/AProd_List";
import AProd_Modal, { type ProductDraft } from "./products/AProd_Modal";
import AProd_Pagination from "./products/AProd_Pagination";
import AProd_Toolbar, {
  type ProductSortOption,
} from "./products/AProd_Toolbar";

import {
  createProduct,
  deleteProduct,
  resetProducts,
  updateProduct,
} from "../services/productApi";

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
  products: CartProduct[];
  setProducts: React.Dispatch<React.SetStateAction<CartProduct[]>>;
};

const PRODUCTS_PER_PAGE = 12;

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const page = css({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const empty_state = css({
  display: "flex",
  flexDirection: "column",

  boxSizing: "border-box",

  padding: "48px 24px",
  gap: "8px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "20px",

  textAlign: "center",

  "& h3": {
    margin: 0,

    color: "var(--text-main)",
    fontSize: "20px",
    fontWeight: "800",
  },

  "& p": {
    margin: 0,

    color: "var(--text-muted)",
    fontSize: "14px",
    lineHeight: "150%",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AdminProducts({ language, products, setProducts }: Props) {
  const t = adminTranslations[language].products;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<ProductSortOption>("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CartProduct | null>(
    null,
  );

  // ----------------------------------------------------------------------
  // FILTER / PAGINATION
  // ----------------------------------------------------------------------

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = products.filter((product) =>
      product.name.toLowerCase().includes(query),
    );

    switch (sortOption) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "popularity":
        result.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
        break;
    }

    return result;
  }, [products, searchQuery, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ----------------------------------------------------------------------
  // MODAL
  // ----------------------------------------------------------------------

  const openAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product: CartProduct) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  // ----------------------------------------------------------------------
  // SAVE
  // ----------------------------------------------------------------------

  const handleSave = async (draft: ProductDraft) => {
    try {
      if (editingProduct) {
        const updatedProduct: CartProduct = { ...editingProduct, ...draft };
        const savedProduct = await updateProduct(updatedProduct);

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === savedProduct.id ? savedProduct : product,
          ),
        );

        closeModal();

        return;
      }

      const newId =
        products.length === 0
          ? 1
          : Math.max(...products.map((product) => product.id)) + 1;
      const newProduct: CartProduct = { id: newId, ...draft, popularity: 0 };
      const savedProduct = await createProduct(newProduct);

      setProducts((currentProducts) => [...currentProducts, savedProduct]);
      setCurrentPage(1);

      closeModal();
    } catch (error) {
      console.error("Failed to save product:", error);

      window.alert(
        error instanceof Error ? error.message : "Failed to save product.",
      );
    }
  };

  // ----------------------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------------------

  const handleDelete = async (id: number) => {
    const product = products.find((product) => product.id === id);

    if (!product) {
      return;
    }

    const confirmed = window.confirm(`${t.deleteConfirm}\n\n${product.name}`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete product:", error);

      window.alert(
        error instanceof Error ? error.message : "Failed to delete product.",
      );
    }
  };

  // ----------------------------------------------------------------------
  // RESET / INITIAL MIGRATION
  // ----------------------------------------------------------------------

  const handleReset = async () => {
    const confirmed = window.confirm(t.resetConfirm);

    if (!confirmed) {
      return;
    }

    try {
      const savedProducts = await resetProducts();

      setProducts([...savedProducts].sort((a, b) => a.id - b.id));

      setSearchQuery("");
      setSortOption("name-asc");
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to reset products:", error);

      window.alert(
        error instanceof Error ? error.message : "Failed to reset products.",
      );
    }
  };

  return (
    <section className={cx(page, "font-onest")}>
      <AProd_Toolbar
        language={language}
        productCount={filteredProducts.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onReset={handleReset}
        onAdd={openAddModal}
      />
      {filteredProducts.length === 0 ? (
        <div className={empty_state}>
          <h3>{t.empty.title}</h3>
          <p>{t.empty.description}</p>
        </div>
      ) : (
        <>
          <AProd_List
            language={language}
            products={currentProducts}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
          <AProd_Pagination
            language={language}
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      {modalOpen && (
        <AProd_Modal
          language={language}
          product={editingProduct}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </section>
  );
}

export default AdminProducts;
