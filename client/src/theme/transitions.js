// Detected transition and timing tokens
export const transitions = {
  property: {
    none: "none",
    all: "all",
    colors: "color, background-color, border-color, text-decoration-color, fill, stroke",
    opacity: "opacity",
    shadow: "box-shadow",
    transform: "transform",
  },
  duration: {
    fast: "150ms",
    normal: "200ms",     // duration-200
    slow: "300ms",       // duration-300
    subtle: "500ms",
  },
  timing: {
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)", // ease-in-out
  }
};

export default transitions;
