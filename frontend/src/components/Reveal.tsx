import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { css, cx } from "@emotion/css";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type RevealProps = {
  children: ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
};

// Inline style with the CSS custom property used for the slide distance.
type RevealStyle = CSSProperties & { "--reveal-distance": string };

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

const hidden = css({
  opacity: 0,
  transform: "translateY(var(--reveal-distance))",
  transition: `opacity 0.52s ${EASING}, transform 0.52s ${EASING}`,
  willChange: "opacity, transform",

  // Reduced motion: no slide, only a short fade.
  "@media (prefers-reduced-motion: reduce)": {
    transform: "none",
    transition: "opacity 0.3s ease",
  },
});

// The final state uses `transform: none` and `will-change: auto` instead of
// `translateY(0)`: a transformed wrapper would become the containing block
// for the position: fixed modals rendered inside the sections (C5, C6).
const visible = css({
  opacity: 1,
  transform: "none",
  willChange: "auto",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function Reveal({
  children,
  delay = 0,
  distance = 24,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Without IntersectionObserver support the content is shown right away.
  const [isVisible, setIsVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const element = ref.current;

    if (!element || isVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        // Reveal once and stop observing, so scrolling back never hides it.
        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible]);

  const style: RevealStyle = {
    transitionDelay: `${delay}ms`,
    "--reveal-distance": `${distance}px`,
  };

  return (
    <div
      ref={ref}
      className={cx(hidden, isVisible && visible, className)}
      style={style}
    >
      {children}
    </div>
  );
}

export default Reveal;
