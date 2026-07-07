import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * FormSkeleton
 * Use for: loading state of any form — settings panel, edit modal,
 * or any form where fields load from an API before rendering.
 * @param {number} fields - number of field rows to render (default 4)
 */
export default function FormSkeleton({ fields = 4, className = '' }) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const shimmerColor = theme === 'dark'
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.06)'

  const bar = (w, h = 12, style = {}) => ({
    width: w,
    height: h,
    borderRadius: tokens.radius.base,
    backgroundColor: shimmerColor,
    ...style,
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing.xl2,
      }}
      className={className}
      aria-hidden="true"
    >
      {/* Form title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
        <div className="skeleton" style={bar('160px', 18)} />
        <div className="skeleton" style={bar('240px', 11)} />
      </div>

      {/* Field rows */}
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
          {/* Label */}
          <div className="skeleton" style={bar('80px', 10)} />
          {/* Input */}
          <div
            className={`skeleton skeleton-delay-${(i % 4) + 1}`}
            style={{
              ...bar('100%', 36),
              borderRadius: tokens.radius.md,
            }}
          />
        </div>
      ))}

      {/* Action buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: tokens.spacing.md, marginTop: tokens.spacing.sm }}>
        <div className="skeleton" style={{ ...bar('88px', 36), borderRadius: tokens.radius.lg }} />
        <div className="skeleton" style={{ ...bar('88px', 36), borderRadius: tokens.radius.lg }} />
      </div>
    </div>
  )
}
