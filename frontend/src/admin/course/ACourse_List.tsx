import { css } from "@emotion/css";

import ACourse_Card from "./ACourse_Card";

import type { Course } from "../../data/courses";
import type { AdminLanguage } from "../utils/Admin_translations";

type Props = {
  language: AdminLanguage;
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
};

const list = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "16px",

  "@media (max-width: 900px)": {
    gridTemplateColumns: "1fr",
  },
});

function ACourse_List({
  language,
  courses,
  onEdit,
  onDelete,
  onToggleActive,
}: Props) {
  return (
    <div className={list}>
      {courses.map((course) => (
        <ACourse_Card
          key={course.id}
          language={language}
          course={course}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
}

export default ACourse_List;
