import { colors, typography, radius, shadows, spacing, semanticTokens, elevation } from '@/theme'

export function getUiTokens(mode = 'light') {
  const palette = mode === 'dark' ? colors.dark : colors.light

  return {
    mode,
    colors: {
      ...palette,
      brand: colors.brand,
      tags: colors.tags,
      status: colors.status,
    },
    typography,
    radius,
    shadows,
    spacing,
    semanticTokens,
    elevation,
  }
}

export default getUiTokens