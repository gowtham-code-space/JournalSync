import { forwardRef } from 'react'
import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '../uiTokens'

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
}

const styleByVariant = {
  primary: (tokens) => ({ backgroundColor: tokens.colors.brand.teal, color: '#FFFFFF' }),
  secondary: (tokens) => ({
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.borderInput ?? tokens.colors.border,
    color: tokens.colors.textPrimary,
  }),
  ghost: (tokens) => ({ color: tokens.colors.textSecondary }),
}

const IconButton = forwardRef(function IconButton(
  { variant = 'secondary', size = 'md', className = '', style = {}, type = 'button', ...props },
  ref,
) {
  const theme = useThemeStore((state) => state.theme)
  const tokens = getUiTokens(theme)

  return (
    <button
      ref={ref}
      type={type}
      className={[
        'inline-flex items-center justify-center rounded-lg border border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses[size] ?? sizeClasses.md,
        className,
      ].join(' ')}
      style={{ ...(styleByVariant[variant]?.(tokens) ?? {}), ...style }}
      {...props}
    />
  )
})

export default IconButton