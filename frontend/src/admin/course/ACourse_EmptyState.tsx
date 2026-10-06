import { css } from "@emotion/css";

import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

type Props = {
  language: AdminLanguage;
};

const empty_state = css({
  padding: "40px 24px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "20px",

  textAlign: "center",
  color: "var(--text-muted)",

  "& h3": {
    margin: "0 0 8px",

    color: "var(--text-main)",
    fontSize: "18px",
    fontWeight: "700",
  },

  "& p": {
    margin: 0,
    fontSize: "14px",
    lineHeight: "150%",
  },
});

function ACourse_EmptyState({ language }: Props) {
  const t = adminTranslations[language].courses;

  return (
    <div className={empty_state}>
      <h3>{t.empty.title}</h3>
      <p>{t.empty.description}</p>
    </div>
  );
}

export default ACourse_EmptyState;
