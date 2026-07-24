import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'
import { Button, Input } from '@/components/ui/primitives'
import signupConfig from '@/config/signupConfig'

export default function Signup() {
  const navigate = useNavigate()
  const theme = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const initialFormState = signupConfig.fields.reduce((acc, field) => {
    acc[field.id] = ''
    return acc
  }, {})

  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})

  const handleFieldChange = (id, value) => {
    setFormData((current) => ({ ...current, [id]: value }))
    if (errors[id]) {
      setErrors((current) => ({ ...current, [id]: null }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Client-side passwords match validation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." })
      return
    }

    // Mock registration success - navigate to dashboard
    navigate('/dashboard')
  }

  return (
    <div
      style={{ backgroundColor: tokens.colors.bg }}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 sm:p-8"
    >
      <img
        src={signupConfig.bgImage}
        alt={signupConfig.bgAlt}
        referrerPolicy="no-referrer"
        loading="eager"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-white/40 dark:bg-black/60" />

      <div
        style={{
          backgroundColor: tokens.colors.surface,
          boxShadow: tokens.shadows.xl,
        }}
        className="relative z-10 flex min-h-[700px] w-full max-w-6xl overflow-hidden rounded-[28px] md:flex-row"
      >
        {/* Left Quote Card Column */}
        <div className="relative hidden w-1/2 p-3 md:block">
          <div className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-[20px] bg-black p-8 sm:p-10">
            <img
              src={signupConfig.cardImage}
              alt=""
              referrerPolicy="no-referrer"
              loading="eager"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black/20" />
            
            <div className="relative z-10 flex items-center gap-3">
              <span
                style={{
                  fontFamily: tokens.typography.label.fontFamily,
                  fontSize: tokens.typography.label.fontSize,
                  fontWeight: tokens.typography.label.fontWeight,
                  lineHeight: tokens.typography.label.lineHeight,
                  textTransform: tokens.typography.label.textTransform,
                  letterSpacing: '0.2em',
                }}
                className="text-white"
              >
                {signupConfig.quote.label}
              </span>
              <span className="h-px flex-1 max-w-[120px] bg-white/70" />
            </div>

            <div className="relative z-10">
              <h1
                style={{
                  fontFamily: tokens.typography.fonts.serif,
                  lineHeight: 1.05,
                }}
                className="mb-6 text-5xl text-white sm:text-6xl whitespace-pre-line"
              >
                {signupConfig.quote.title}
              </h1>
              <p
                style={tokens.typography.bodyLG}
                className="max-w-xs leading-relaxed text-white/85"
              >
                {signupConfig.quote.text}
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="flex w-full flex-col justify-center px-8 py-10 md:w-1/2 sm:px-16">
          <div className="mx-auto w-full max-w-sm">
            {/* Logo */}
            <div className="mb-10 flex items-center justify-center gap-2">
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 3C3 1 5 1 7 3C9 5 11 5 13 3C15 1 17 1 19 3" stroke={tokens.colors.textPrimary} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1 9C3 7 5 7 7 9C9 11 11 11 13 9C15 7 17 7 19 9" stroke={tokens.colors.textPrimary} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1 15C3 13 5 13 7 15C9 17 11 17 13 15C15 13 17 13 19 15" stroke={tokens.colors.textPrimary} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span
                style={{
                  ...tokens.typography.headingLG,
                  color: tokens.colors.textPrimary,
                }}
                className="tracking-tight"
              >
                {signupConfig.logoText}
              </span>
            </div>

            {/* Header */}
            <div className="mb-8 text-center">
              <h2
                style={{
                  fontFamily: tokens.typography.fonts.serif,
                  fontSize: tokens.typography.fontSizes.h4,
                  fontWeight: tokens.typography.fontWeights.semibold,
                  color: tokens.colors.textPrimary,
                }}
                className="mb-3"
              >
                {signupConfig.heading}
              </h2>
              <p
                style={{
                  ...tokens.typography.bodyMD,
                  color: tokens.colors.textSecondary,
                }}
                className="text-sm"
              >
                {signupConfig.subheading}
              </p>
            </div>

            {/* Dynamic Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {signupConfig.fields.map((field) => (
                <Input
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.id]}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  required={field.required}
                  error={errors[field.id]}
                />
              ))}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                style={{
                  width: '100%',
                  backgroundColor: tokens.colors.textPrimary,
                  color: tokens.colors.surface,
                }}
                className="mt-4"
              >
                {signupConfig.submitButtonText}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate(signupConfig.loginPath)}
                  style={{
                    fontFamily: tokens.typography.bodyMD.fontFamily,
                    fontSize: tokens.typography.bodyMD.fontSize,
                    color: tokens.colors.textSecondary,
                  }}
                  className="font-medium hover:opacity-80 transition-opacity"
                >
                  {signupConfig.loginLinkText}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
