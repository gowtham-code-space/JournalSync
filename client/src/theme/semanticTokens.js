// Semantic design tokens mapped to functional UI roles
export const semanticTokens = {
  colors: {
    bg: {
      page: { light: "light.bg", dark: "dark.bg" },
      surface: { light: "light.surface", dark: "dark.surface" },
      surfaceMuted: { light: "light.surfaceSubtle", dark: "dark.surfaceSubtle" },
      brand: { light: "brand.teal", dark: "brand.teal" },
    },
    text: {
      primary: { light: "light.textPrimary", dark: "dark.textPrimary" },
      secondary: { light: "light.textSecondary", dark: "dark.textSecondary" },
      muted: { light: "light.textMuted", dark: "dark.textMuted" },
      inverse: { light: "dark.textPrimary", dark: "light.textPrimary" },
    },
    border: {
      default: { light: "light.border", dark: "dark.border" },
      subtle: { light: "light.borderSubtle", dark: "dark.borderSubtle" },
    }
  },
  radius: {
    card: "card",
    modal: "xxl",
    input: "md",
  },
  shadows: {
    card: "sm",
    modal: "xxl",
  }
};

export default semanticTokens;
