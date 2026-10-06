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

  "& p": {
    margin: 0,
    fontSize: "14px",
  },
});

function AOrder_EmptyState({ language }: Props) {
  const t = adminTranslations[language].orders;

  return (
    <div className={empty_state}>
      <p>{t.empty.title}</p>
    </div>
  );
}

export default AOrder_EmptyState;
