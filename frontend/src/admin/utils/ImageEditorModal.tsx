import { useCallback, useEffect, useState } from "react";
import { css, cx } from "@emotion/css";
import Cropper, { type Area } from "react-easy-crop";

import { getCroppedImage } from "./getCroppedImage";

import { adminTranslations, type AdminLanguage } from "./Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  imageSrc: string;
  onCancel: () => void;
  onSave: (image: string) => void | Promise<void>;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const overlay = css({
  position: "fixed",
  inset: 0,
  zIndex: 10000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  boxSizing: "border-box",

  padding: "24px",

  backgroundColor: "rgba(0, 0, 0, 0.7)",

  "@media (max-width: 600px)": {
    padding: "12px",
  },
});

const editor = css({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",

  width: "100%",
  maxWidth: "760px",
  maxHeight: "calc(100vh - 48px)",
  boxSizing: "border-box",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "24px",

  color: "var(--text-main)",

  "@media (max-width: 600px)": {
    maxHeight: "calc(100vh - 24px)",
    borderRadius: "18px",
  },
});

const editor_header = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  padding: "22px 24px",
  gap: "16px",

  borderBottom: "1px solid var(--sand-line)",

  "& h2": {
    margin: 0,
    fontSize: "22px",
  },
});

const close_button = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "38px",
  height: "38px",

  padding: 0,

  backgroundColor: "transparent",
  border: "1px solid var(--sand-line)",
  borderRadius: "50%",

  color: "var(--text-main)",
  fontSize: "22px",

  cursor: "pointer",
});

const crop_area = css({
  position: "relative",

  width: "100%",
  height: "480px",

  backgroundColor: "#111",

  "@media (max-width: 768px)": {
    height: "420px",
  },

  "@media (max-width: 480px)": {
    height: "340px",
  },
});

const controls = css({
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",

  padding: "24px",
  gap: "20px",
});

const control = css({
  display: "grid",
  gridTemplateColumns: "90px 1fr 60px",
  alignItems: "center",

  gap: "14px",

  "& label": {
    fontSize: "13px",
    fontWeight: "600",
  },

  "& span": {
    color: "var(--text-muted)",
    fontSize: "12px",
    textAlign: "right",
  },

  "& input": {
    width: "100%",
    accentColor: "var(--clay)",
    cursor: "pointer",
  },

  "@media (max-width: 480px)": {
    gridTemplateColumns: "70px 1fr 45px",
    gap: "8px",
  },
});

const rotation_buttons = css({
  display: "flex",
  gap: "10px",

  "& button": {
    padding: "9px 14px",

    backgroundColor: "var(--chip-bg)",
    border: "1px solid var(--sand-line)",
    borderRadius: "100px",

    color: "var(--text-main)",
    font: "inherit",
    fontSize: "13px",
    fontWeight: "600",

    cursor: "pointer",
  },
});

const action_buttons = css({
  display: "flex",
  justifyContent: "flex-end",

  paddingTop: "4px",
  gap: "10px",

  "@media (max-width: 480px)": {
    flexDirection: "column-reverse",
  },
});

const cancel_button = css({
  padding: "12px 18px",

  backgroundColor: "transparent",
  border: "1px solid var(--sand-line)",
  borderRadius: "100px",

  color: "var(--text-main)",
  font: "inherit",
  fontWeight: "600",

  cursor: "pointer",
});

const save_button = css({
  padding: "12px 20px",

  backgroundColor: "var(--clay)",
  border: "none",
  borderRadius: "100px",

  color: "#f3ede6",
  font: "inherit",
  fontWeight: "700",

  cursor: "pointer",

  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function ImageEditorModal({ language, imageSrc, onCancel, onSave }: Props) {
  const t = adminTranslations[language].products.imageEditor;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onCancel]);

  const handleSave = async () => {
    if (!croppedAreaPixels) {
      return;
    }

    try {
      setIsSaving(true);

      const croppedImage = await getCroppedImage(
        imageSrc,
        croppedAreaPixels,
        rotation,
      );

      await onSave(croppedImage);
    } catch (error) {
      console.error("Image processing failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const rotateLeft = () => {
    setRotation((current) => (current - 90 < -180 ? 90 : current - 90));
  };

  const rotateRight = () => {
    setRotation((current) => (current + 90 > 180 ? -90 : current + 90));
  };

  return (
    <div className={cx(overlay, "font-onest")} onMouseDown={onCancel}>
      <div className={editor} onMouseDown={(event) => event.stopPropagation()}>
        <div className={editor_header}>
          <h2>{t.title}</h2>
          <button
            type="button"
            className={close_button}
            onClick={onCancel}
            aria-label={t.close}
          >
            ×
          </button>
        </div>
        <div className={crop_area}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="rect"
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className={controls}>
          <div className={control}>
            <label htmlFor="image-zoom">{t.zoom}</label>
            <input
              id="image-zoom"
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
            <span>{zoom.toFixed(2)}×</span>
          </div>
          <div className={control}>
            <label htmlFor="image-rotation">{t.rotate}</label>
            <input
              id="image-rotation"
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rotation}
              onChange={(event) => setRotation(Number(event.target.value))}
            />
            <span>{rotation}°</span>
          </div>
          <div className={rotation_buttons}>
            <button type="button" onClick={rotateLeft}>
              ↶ 90°
            </button>
            <button type="button" onClick={rotateRight}>
              ↷ 90°
            </button>
          </div>
          <div className={action_buttons}>
            <button type="button" className={cancel_button} onClick={onCancel}>
              {t.cancel}
            </button>
            <button
              type="button"
              className={save_button}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? t.processing : t.apply}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageEditorModal;
