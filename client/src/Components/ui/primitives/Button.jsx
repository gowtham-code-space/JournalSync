import { forwardRef } from 'react'
import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '../uiTokens'

const variantClasses = {
  primary: 'text-white shadow-sm hover:opacity-95',
  secondary: 'border hover:bg-opacity-80',
  danger: 'text-white shadow-sm hover:opacity-95',
  ghost: 'hover:bg-opacity-70',
  link: 'p-0 underline underline-offset-4 hover:opacity-80',
  text: 'hover:bg-opacity-70',
  nav: 'justify-start',
}

const sizeClasses = {
  sm: 'h-8 px-3 text-[12px]',
  md: 'h-9 px-4 text-[13px]',
  lg: 'h-11 px-5 text-[14px]',
}

const styleByVariant = {
  primary: (tokens) => ({ backgroundColor: tokens.colors.brand.teal }),
  secondary: (tokens) => ({
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.borderInput ?? tokens.colors.border,
    color: tokens.colors.textPrimary,
  }),
  danger: (tokens) => ({ backgroundColor: tokens.colors.brand.pink }),
  ghost: (tokens) => ({ color: tokens.colors.textSecondary }),
  link: (tokens) => ({ color: tokens.colors.brand.teal }),
  text: (tokens) => ({ color: tokens.colors.textSecondary }),
  nav: (tokens, active) => ({
    backgroundColor: active ? tokens.colors.textPrimary : 'transparent',
    color: active ? '#FFFFFF' : tokens.colors.textSecondary,
  }),
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', active = false, className = '', style = {}, type = 'button', ...props },
  ref,
) {
  const theme = useThemeStore((state) => state.theme)
  const tokens = getUiTokens(theme)
  const variantStyle = styleByVariant[variant]?.(tokens, active) ?? {}

  return (
    <button
      ref={ref}
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg border border-transparent font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant] ?? variantClasses.primary,
        sizeClasses[size] ?? sizeClasses.md,
        className,
      ].join(' ')}
      style={{ ...variantStyle, ...style }}
      {...props}
    />
  )
})

export default Button