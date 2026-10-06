import { css } from "@emotion/css";

import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

type Props = {
  language: AdminLanguage;
};

const empty_state = css({
  padding: "48px 24px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "20px",

  textAlign: "center",

  "& h3": {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
  },

  "& p": {
    margin: "8px 0 0",
    color: "var(--text-muted)",
    fontSize: "14px",
  },
});

function ARoast_EmptyState({ language }: Props) {
  const t = adminTranslations[language].roasting;

  return (
    <div className={empty_state}>
      <h3>{t.empty.title}</h3>
      <p>{t.empty.description}</p>
    </div>
  );
}

export default ARoast_EmptyState;
