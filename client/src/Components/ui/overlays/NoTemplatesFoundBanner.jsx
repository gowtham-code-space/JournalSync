import { FileSearch } from 'lucide-react'
import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'
import { Button } from '@/components/primitives'

/**
 * NoTemplatesFoundBanner
 *
 * Empty-state banner shown when a templates list/grid returns no results
 * (e.g. after search or filtering on the Templates page).
 *
 * Props:
 *  - title        string   Heading text (default: "No templates found")
 *  - description  string   Supporting copy (default provided)
 *  - actionLabel  string?  Label for the optional action button
 *  - onAction     func?    Handler for the optional action button
 *  - className    string?  Extra classes for the outer wrapper
 */
export default function NoTemplatesFoundBanner({
  title = 'No templates found',
  description = "We couldn't find any templates matching your search. Try adjusting your filters or search terms.",
  actionLabel,
  onAction,
  className = '',
}) {
  const theme = useThemeStore((state) => state.theme)
  const tokens = getUiTokens(theme)

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${className}`}
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.card,
        boxShadow: tokens.shadows.sm,
        padding: `${tokens.spacing.xxxl} ${tokens.spacing.xxl}`,
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: tokens.radius.full,
          backgroundColor: tokens.colors.surfaceSubtle ?? tokens.colors.surface,
          border: `1px solid ${tokens.colors.borderSubtle ?? tokens.colors.border}`,
          marginBottom: tokens.spacing.xl,
        }}
      >
        <FileSearch
          size={24}
          strokeWidth={1.75}
          color={tokens.colors.textMuted}
        />
      </div>

      <h3
        style={{
          fontFamily: tokens.typography.headingSM.fontFamily,
          fontSize: tokens.typography.headingSM.fontSize,
          fontWeight: tokens.typography.headingSM.fontWeight,
          color: tokens.colors.textPrimary,
          marginBottom: tokens.spacing.sm2,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontFamily: tokens.typography.bodyMD.fontFamily,
          fontSize: tokens.typography.bodyMD.fontSize,
          fontWeight: tokens.typography.bodyMD.fontWeight,
          color: tokens.colors.textSecondary,
          maxWidth: 360,
          marginBottom: actionLabel ? tokens.spacing.xl : 0,
        }}
      >
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="secondary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}