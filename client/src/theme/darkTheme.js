import { colors } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { shadows } from "./shadows";

export const darkTheme = {
  mode: "dark",
  colors: {
    background: colors.dark.bg,
    surface: colors.dark.surface,
    surfaceMuted: colors.dark.surfaceSubtle,
    border: colors.dark.border,
    borderMuted: colors.dark.borderSubtle,
    text: colors.dark.textPrimary,
    textSecondary: colors.dark.textSecondary,
    textMuted: colors.dark.textMuted,
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

export default darkTheme;
