// Detected design tokens for typography
export const typography = {
  fonts: {
    serif: "'Playfair Display', Georgia, serif",
    sans: "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  fontSizes: {
    xs: "10px",
    xs2: "10.5px",
    sm: "11px",
    sm2: "11.5px",
    base: "12px",
    base2: "12.5px",
    md: "13px",
    md2: "13.5px",
    lg: "15px",
    xl: "17px",
    xl2: "18px",
    xl3: "19px",
    xxl: "20px",
    xxl2: "21px",
    xxl3: "22px",
    xxxl: "32px",
    h4: "36px", // 4xl
    h5: "48px", // 5xl
    h6: "60px", // 6xl
  },
  fontWeights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  // Semantic typography definitions
  headingXL: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "32px",
    fontWeight: "700",
    lineHeight: "1.2",
  },
  headingLG: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "21px",
    fontWeight: "600",
    lineHeight: "1.3",
  },
  headingMD: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "19px",
    fontWeight: "600",
    lineHeight: "1.4",
  },
  headingSM: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "17px",
    fontWeight: "600",
    lineHeight: "1.4",
  },
  bodyLG: {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "15px",
    fontWeight: "400",
    lineHeight: "1.5",
  },
  bodyMD: {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "13px",
    fontWeight: "400",
    lineHeight: "1.5",
  },
  bodySM: {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "12px",
    fontWeight: "400",
    lineHeight: "1.5",
  },
  caption: {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "11px",
    fontWeight: "400",
    lineHeight: "1.4",
  },
  label: {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "10.5px",
    fontWeight: "500",
    lineHeight: "1.3",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  button: {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "13px",
    fontWeight: "500",
    lineHeight: "1.4",
  }
};

export default typography;
