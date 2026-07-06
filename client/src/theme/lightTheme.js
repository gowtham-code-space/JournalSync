import { colors } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { shadows } from "./shadows";

export const lightTheme = {
  mode: "light",
  colors: {
    background: colors.light.bg,
    surface: colors.light.surface,
    surfaceMuted: colors.light.surfaceSubtle,
    border: colors.light.border,
    borderMuted: colors.light.borderSubtle,
    text: colors.light.textPrimary,
    textSecondary: colors.light.textSecondary,
    textMuted: colors.light.textMuted,
    brandTeal: colors.brand.teal,
    brandTealHover: colors.brand.tealHover,
    accentPink: colors.brand.pink,
    accentOrange: colors.brand.orange,
  },
  typography,
  spacing,
  radius,
  shadows,
};

export default lightTheme;
