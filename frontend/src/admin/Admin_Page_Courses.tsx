import { useEffect, useMemo, useState } from "react";
import { css, cx } from "@emotion/css";

import ACourse_EmptyState from "./course/ACourse_EmptyState";
import ACourse_List from "./course/ACourse_List";
import ACourse_Modal, { type CourseDraft } from "./course/ACourse_Modal";
import ACourse_Pagination from "./course/ACourse_Pagination";
import ACourse_Toolbar, {
  type CourseSortOption,
} from "./course/ACourse_Toolbar";

import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "../services/courseApi";
import { translateCourse } from "../services/courseTranslation";

import { initialCourses, type Course } from "../data/courses";
import {
  adminTranslations,
  type AdminLanguage,
} from "./utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
};

const COURSES_PER_PAGE = 6;

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const page = css({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AdminCourses({ language, courses, setCourses }: Props) {
  const t = adminTranslations[language].courses;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<CourseSortOption>("title-asc");
  const [showInactive, setShowInactive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // ----------------------------------------------------------------------
  // FILTER / PAGINATION
  // ----------------------------------------------------------------------

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = courses.filter((course) => {
      if (!showInactive && !course.active) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        course.title.uk.toLowerCase().includes(query) ||
        course.title.en.toLowerCase().includes(query)
      );
    });

    switch (sortOption) {
      case "title-asc":
        result.sort((a, b) =>
          a.title[language].localeCompare(b.title[language]),
        );
        break;

      case "title-desc":
        result.sort((a, b) =>
          b.title[language].localeCompare(a.title[language]),
        );
        break;

      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "active-first":
        result.sort((a, b) => Number(b.active) - Number(a.active));
        break;
    }

    return result;
  }, [courses, searchQuery, sortOption, showInactive, language]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourses.length / COURSES_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const currentCourses = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * COURSES_PER_PAGE;
    const endIndex = startIndex + COURSES_PER_PAGE;

    return filteredCourses.slice(startIndex, endIndex);
  }, [filteredCourses, safeCurrentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption, showInactive]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ----------------------------------------------------------------------
  // MODAL
  // ----------------------------------------------------------------------

  const openAddModal = () => {
    setEditingCourse(null);
    setModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCourse(null);
  };

  // ----------------------------------------------------------------------
  // SAVE
  // ----------------------------------------------------------------------

  const handleSave = async (draft: CourseDraft) => {
    try {
      // EDIT
      if (editingCourse) {
        const updatedCourse: Course = { ...editingCourse, ...draft };
        const savedCourse = await updateCourse(updatedCourse);

        setCourses((currentCourses) =>
          currentCourses.map((course) =>
            course.id === savedCourse.id ? savedCourse : course,
          ),
        );

        closeModal();

        return;
      }

      // ADD
      const newId =
        courses.length === 0
          ? 1
          : Math.max(...courses.map((course) => course.id)) + 1;
      const newCourse: Course = { id: newId, ...draft };
      const savedCourse = await createCourse(newCourse);

      setCourses((currentCourses) => [...currentCourses, savedCourse]);
      setCurrentPage(
        Math.max(1, Math.ceil((filteredCourses.length + 1) / COURSES_PER_PAGE)),
      );

      closeModal();
    } catch (error) {
      console.error("Failed to save course:", error);

      window.alert(
        error instanceof Error ? error.message : "Failed to save course.",
      );
    }
  };

  // ----------------------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------------------

  const handleDelete = async (id: number) => {
    const course = courses.find((course) => course.id === id);

    if (!course) {
      return;
    }

    const title = course.title[language];
    const confirmed = window.confirm(`${t.deleteConfirm}\n\n${title}`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteCourse(id);
      setCourses((currentCourses) =>
        currentCourses.filter((course) => course.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete course:", error);

      window.alert(
        error instanceof Error ? error.message : "Failed to delete course.",
      );
    }
  };

  // ----------------------------------------------------------------------
  // ACTIVE / INACTIVE
  // ----------------------------------------------------------------------

  const handleToggleActive = async (id: number) => {
    const course = courses.find((course) => course.id === id);

    if (!course) {
      return;
    }

    const updatedCourse: Course = { ...course, active: !course.active };

    try {
      const savedCourse = await updateCourse(updatedCourse);

      setCourses((currentCourses) =>
        currentCourses.map((course) =>
          course.id === savedCourse.id ? savedCourse : course,
        ),
      );
    } catch (error) {
      console.error("Failed to update course status:", error);

      window.alert(
        error instanceof Error ? error.message : "Failed to update course.",
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
      const firestoreCourses = await getCourses();

      // Delete everything currently stored in harz_academy_courses.
      await Promise.all(
        firestoreCourses.map((course) => deleteCourse(course.id)),
      );

      // Write the initial courses into Firestore.
      const savedCourses = await Promise.all(
        initialCourses.map((course) => createCourse(course)),
      );

      setCourses(savedCourses.sort((a, b) => a.id - b.id));
      setSearchQuery("");
      setSortOption("title-asc");
      setShowInactive(true);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to reset courses:", error);

      window.alert(
        error instanceof Error ? error.message : "Failed to reset courses.",
      );
    }
  };

  return (
    <section className={cx(page, "font-onest")}>
      <ACourse_Toolbar
        language={language}
        courseCount={filteredCourses.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        showInactive={showInactive}
        onShowInactiveChange={setShowInactive}
        onReset={handleReset}
        onAdd={openAddModal}
      />
      {filteredCourses.length === 0 ? (
        <ACourse_EmptyState language={language} />
      ) : (
        <>
          <ACourse_List
            language={language}
            courses={currentCourses}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
          <ACourse_Pagination
            language={language}
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      {modalOpen && (
        <ACourse_Modal
          language={language}
          course={editingCourse}
          onClose={closeModal}
          onSave={handleSave}
          onTranslate={translateCourse}
        />
      )}
    </section>
  );
}

export default AdminCourses;
