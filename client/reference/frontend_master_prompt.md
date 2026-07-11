# Frontend Master Prompt — Journal Management Client

> **For external AI assistants (Claude, Gemini, Cursor, GPT-4o, etc.)**
>
> You are about to generate code for an existing React + Vite application.
> Before writing a single line of code, read this document in full.
> Everything you need — components, tokens, hooks, contexts, patterns — already exists.
> Your only job is to **compose from what is here, not to invent anything new**.

---

## 0. Golden Rules (Non-Negotiable)

| Rule | Detail |
|------|--------|
| **Never recreate existing UI** | Search this document before writing any JSX. |
| **Never hardcode a colour** | Every colour lives in `src/theme/colors.js`. Use it. |
| **Never hardcode typography** | Every font, size, weight, line-height lives in `src/theme/typography.js`. Use it. |
| **Never hardcode spacing** | Every gap, padding, margin lives in `src/theme/spacing.js`. Use it. |
| **Never hardcode border-radius** | Every radius lives in `src/theme/radius.js`. Use it. |
| **Never hardcode a shadow** | Every shadow lives in `src/theme/shadows.js`. Use it. |
| **Never hardcode a z-index** | Every z-index lives in `src/theme/zIndex.js`. Use it. |
| **Never hardcode an animation/transition** | Use `src/theme/animations.js` and `src/theme/transitions.js`. |
| **Never hardcode a breakpoint** | Every breakpoint lives in `src/theme/breakpoints.js`. Use it. |
| **Never introduce new state management** | Zustand stores already exist. Use them. |
| **Never introduce a new context** | Three contexts already exist. Use them. |
| **Prefer composition** | Extend `Button`, `IconButton`, `ModalShell` before creating new primitives. |
| **Always consume tokens via `getUiTokens(theme)`** | The bridge between theme mode and component styles. |

---

## 1. Project Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (Vite) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) + inline JS tokens |
| State | Zustand (with `persist` middleware) |
| Routing | React Router DOM v6 |
| HTTP | Axios (`src/services/core/apiClient.js`) |
| Icons | `lucide-react` |

### Path Aliases (configured in `vite.config.js`)

```
@/                         → src/
@/components/primitives    → src/Components/ui/primitives/
@/components/overlays      → src/Components/ui/overlays/
@/components/feedback      → src/Components/ui/feedback/
@/components/composites    → src/Components/ui/composites/
@/components/navigation    → src/Components/ui/navigation/
@/components/layout        → src/Components/layout/
@/components/Sidebar       → src/Components/layout/Sidebar/
@/components/ui            → (implicit via @/ + path)
@/context                  → src/contexts/
@/hooks/useThemeStore      → src/hooks/useThemeStore.js
@/hooks/useSidebarStore    → src/hooks/useSidebarStore.js
@/hooks/useAuth            → src/hooks/useAuth.js
@/theme                    → src/theme/index.js
```

Always use these aliases in import statements. Never use long relative paths like `../../../../theme`.

---

## 2. Design Token System (`src/theme/`)

All tokens are exported individually and also from the barrel `src/theme/index.js`.

```js
import { colors, typography, spacing, radius, shadows, zIndex,
         breakpoints, animations, transitions, opacity, elevation,
         lightTheme, darkTheme, semanticTokens } from '@/theme'
```

### 2.1 Color System — `src/theme/colors.js`

```js
colors.brand.teal        = "#2DBFAE"   // Primary brand / CTA / success
colors.brand.tealHover   = "#25A090"   // Hover state for teal
colors.brand.pink        = "#C13A8A"   // Danger / accent / error
colors.brand.orange      = "#E8924A"   // Warning / accent

colors.light.bg              = "#F5F5F7"
colors.light.surface         = "#FFFFFF"
colors.light.surfaceSubtle   = "#FAFAFC"
colors.light.border          = "#E7E7EC"
colors.light.borderSubtle    = "#EEEEF2"
colors.light.borderInput     = "#E4E4ED"
colors.light.textPrimary     = "#111111"
colors.light.textSecondary   = "#6B6B76"
colors.light.textMuted       = "#9A99A6"

colors.dark.bg               = "#0C0C0E"
colors.dark.surface          = "#16161A"
colors.dark.surfaceSubtle    = "#1C1C22"
colors.dark.surfaceAlt       = "#111115"
colors.dark.border           = "#22222A"
colors.dark.borderSubtle     = "#2C2C35"
colors.dark.textPrimary      = "#FAFAFC"
colors.dark.textSecondary    = "#A1A1AA"
colors.dark.textMuted        = "#8E8D9B"

colors.tags.work     = "#A69FC1"
colors.tags.personal = "#D7CCC8"
colors.tags.ideas    = "#A5D6A7"
colors.tags.research = "#CE93D8"

colors.status.success = "#2DBFAE"   // same as brand.teal
colors.status.error   = "#C13A8A"   // same as brand.pink
colors.status.warning = "#E8924A"   // same as brand.orange
```

**When to use:** Every single colour value in every component.
**When NOT to use:** Never bypass it with a raw hex string. If a colour does not exist here, ask whether it truly needs to be added before adding it.

---

### 2.2 Typography System — `src/theme/typography.js`

Two font stacks are defined:
- `typography.fonts.serif` → `'Playfair Display', Georgia, serif` — headings, brand wordmarks
- `typography.fonts.sans`  → `ui-sans-serif, system-ui, sans-serif` — body, labels, buttons
- `typography.fonts.mono`  → monospace — code snippets only

**Semantic type roles (use these, not raw sizes):**

| Token | Size | Weight | Use For |
|-------|------|--------|---------|
| `typography.headingXL` | 32px | 700 | Page hero titles |
| `typography.headingLG` | 21px | 600 | Section headings |
| `typography.headingMD` | 19px | 600 | Sub-section headings |
| `typography.headingSM` | 17px | 600 | Card titles |
| `typography.bodyLG`    | 15px | 400 | Primary body text |
| `typography.bodyMD`    | 13px | 400 | Default body / descriptions |
| `typography.bodySM`    | 12px | 400 | Secondary body / small text |
| `typography.caption`   | 11px | 400 | Captions, footnotes |
| `typography.label`     | 10.5px | 500 | All-caps column labels, stat labels |
| `typography.button`    | 13px | 500 | Button text |

Raw font size scale also exists (`typography.fontSizes.xs` through `xxxl`, `h4`–`h6`) but prefer semantic roles above.

**Font weight scale:** `normal(400)`, `medium(500)`, `semibold(600)`, `bold(700)`

---

### 2.3 Spacing System — `src/theme/spacing.js`

```
none=0  xs=2px  sm=4px  sm2=6px  md=8px  md2=10px
lg=12px  lg2=14px  xl=16px  xl2=20px  xxl=24px
xxl2=28px  xxl3=32px  xxl4=36px  xxxl=40px  xxxxl=64px
```

**When to use:** All padding, margin, gap, width, height values.
**Do NOT use:** `p-3`, `m-4` Tailwind utilities for spacing that matters to the design. Instead apply via `style={{ padding: spacing.lg }}` or reference the token value in a Tailwind arbitrary value `p-[${spacing.lg}]`.

---

### 2.4 Border Radius — `src/theme/radius.js`

```
none=0   sm=2px   base=4px   md=6px   lg=8px
xl=12px  xxl=16px  panel=20px  card=28px  full=9999px
```

- **`radius.card`** (28px) → stat cards, content panels
- **`radius.panel`** (20px) → modal containers, large panels
- **`radius.xl`** (12px) → inner cards, toast, badges
- **`radius.lg`** (8px) → buttons, inputs, small badges
- **`radius.full`** → avatar circles, pill badges, toggle switches

---

### 2.5 Shadow System — `src/theme/shadows.js`

```
none  →  "none"
sm    →  subtle card shadow (default for cards)
md    →  dropdown shadow
lg    →  elevated panel
xl    →  floating panel
xxl   →  modal / high-elevation overlay
```

---

### 2.6 Z-Index System — `src/theme/zIndex.js`

```
hide=-1   base=0   dropdown=10   sticky=20
backdrop=30   drawer=40   modal=50   popover=60   toast=70
```

**Never hardcode a z-index number.** Always pick from this scale. This guarantees correct stacking order across all layers.

---

### 2.7 Opacity — `src/theme/opacity.js`

```
transparent=0   subtle=0.1   backdrop=0.4   shadow=0.25
dim=0.6   divider=0.7   secondary=0.85   overlay=0.9   solid=1
```

---

### 2.8 Animations — `src/theme/animations.js`

```js
animations.spin    → "spin 1s linear infinite"
animations.ping    → "ping 1s cubic-bezier(0,0,0.2,1) infinite"
animations.pulse   → "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite"
animations.bounce  → "bounce 1s infinite"
animations.keyframes.spin   → @keyframes spin definition
animations.keyframes.pulse  → @keyframes pulse definition
```

---

### 2.9 Transitions — `src/theme/transitions.js`

```js
transitions.property.colors    → "color, background-color, border-color, ..."
transitions.property.transform → "transform"
transitions.property.shadow    → "box-shadow"
transitions.property.opacity   → "opacity"

transitions.duration.fast      → "150ms"
transitions.duration.normal    → "200ms"   ← default for most UI
transitions.duration.slow      → "300ms"   ← sidebar slide, page-level
transitions.duration.subtle    → "500ms"

transitions.timing.inOut       → "cubic-bezier(0.4,0,0.2,1)"  ← default
transitions.timing.out         → "cubic-bezier(0,0,0.2,1)"
transitions.timing.in          → "cubic-bezier(0.4,0,1,1)"
```

**Standard transition shorthand:** `transition-colors duration-200 ease-in-out` (Tailwind) maps to `colors` + `normal` + `inOut`.

---

### 2.10 Breakpoints — `src/theme/breakpoints.js`

```
xs=480px  sm=640px  md=768px  lg=1024px  xl=1280px  xxl=1536px
```

Mobile-first. The sidebar collapses at `md` (768px). Use these values in media queries or Tailwind responsive prefixes (`md:`, `lg:`, etc.).

---

### 2.11 Elevation — `src/theme/elevation.js`

Semantic combinations of shadow + z-index:

```js
elevation.flat         → { boxShadow: shadows.none, zIndex: 0 }
elevation.card         → { boxShadow: shadows.sm,   zIndex: 0 }
elevation.dropdown     → { boxShadow: shadows.md,   zIndex: 10 }
elevation.sidebar      → { boxShadow: shadows.none, zIndex: 40 }
elevation.modal        → { boxShadow: shadows.xxl,  zIndex: 50 }
elevation.stickyHeader → { boxShadow: shadows.none, zIndex: 10 }
```

**Use elevation for layout elements** rather than setting `boxShadow` and `zIndex` separately.

---

### 2.12 Semantic Themes — `src/theme/lightTheme.js` & `darkTheme.js`

Both compile all core tokens into a single resolved theme object:

```js
theme.colors.background    // page bg
theme.colors.surface       // card / panel bg
theme.colors.surfaceMuted  // subtle surface
theme.colors.border        // default border
theme.colors.borderMuted   // subtle border
theme.colors.text          // primary text
theme.colors.textSecondary
theme.colors.textMuted
theme.colors.brandTeal
theme.colors.brandTealHover
theme.colors.accentPink
theme.colors.accentOrange
```

**Do NOT use lightTheme/darkTheme directly inside components.** Use `getUiTokens(theme)` instead (see §3).

---

### 2.13 Semantic Tokens — `src/theme/semanticTokens.js`

Maps functional UI roles to colour keys:

```js
semanticTokens.colors.bg.page.light        = "light.bg"
semanticTokens.colors.text.primary.dark    = "dark.textPrimary"
semanticTokens.radius.card                 = "card"   // → radius.card
semanticTokens.radius.modal                = "xxl"    // → radius.xxl
semanticTokens.radius.input                = "md"     // → radius.md
semanticTokens.shadows.card                = "sm"
semanticTokens.shadows.modal               = "xxl"
```

---

## 3. The Token Bridge — `getUiTokens(theme)` (`src/Components/ui/uiTokens.js`)

**This is the single function every component must call to access runtime design tokens.**

```js
import { getUiTokens } from '@/components/ui/uiTokens'

const theme = useThemeStore((state) => state.theme)  // "light" | "dark"
const tokens = getUiTokens(theme)
```

`tokens` exposes:
```js
tokens.mode                // "light" | "dark"
tokens.colors.surface      // resolved surface colour for current mode
tokens.colors.border
tokens.colors.textPrimary
tokens.colors.textSecondary
tokens.colors.textMuted
tokens.colors.brand        // { teal, tealHover, pink, orange }
tokens.colors.tags         // { work, personal, ideas, research }
tokens.colors.status       // { success, error, warning }
tokens.typography          // full typography object
tokens.radius              // full radius object
tokens.shadows             // full shadows object
tokens.spacing             // full spacing object
tokens.semanticTokens      // semantic mappings
tokens.elevation           // elevation combinations
```

**Rule:** Never write `colors.light.textPrimary` directly inside a component. Always call `getUiTokens` and use `tokens.colors.*`.

---

## 4. Reusable UI Component Library

### 4.1 Primitives (`src/Components/ui/primitives/`)

Import via: `import { Button, IconButton } from '@/components/primitives'`

#### `Button`

A `forwardRef` button that resolves visual style from tokens and supports 7 variants and 3 sizes.

**Variants:**
| Variant | Use For |
|---------|---------|
| `primary` | Primary CTA — teal background, white text |
| `secondary` | Secondary action — surface bg, border, primary text |
| `danger` | Destructive action — pink background, white text |
| `ghost` | Tertiary / icon-adjacent — no bg, secondary text |
| `link` | In-line text link — underlined, teal text |
| `text` | Quiet action — no bg, secondary text, no underline |
| `nav` | Sidebar nav item — transparent or filled (use `active` prop) |

**Sizes:** `sm` (h-8), `md` (h-9, default), `lg` (h-11)

**Props:** `variant`, `size`, `active` (boolean, for `nav`), `className`, `style`, `type`, plus all native button props.

**When to use:** Every clickable UI element that is not a pure icon.
**When NOT to use:** Do not recreate a button from a raw `<button>` element. Extend `Button` instead.

**Example:**
```jsx
<Button variant="primary" size="md" onClick={handleSave}>Save</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="danger" onClick={handleDelete}>Delete</Button>
<Button variant="nav" active={isActive} onClick={() => navigate('/dashboard')}>
  Dashboard
</Button>
```

---

#### `IconButton`

A square icon-only button. Resolves styles from tokens.

**Variants:** `primary`, `secondary` (default), `ghost`
**Sizes:** `sm` (32×32px), `md` (36×36px, default), `lg` (40×40px)

**When to use:** Toolbar icons, close buttons, toggle icons — any clickable that holds only an icon.
**When NOT to use:** Buttons that contain text, even if short. Use `Button` with an icon child.

**Example:**
```jsx
import { X } from 'lucide-react'
<IconButton variant="ghost" size="sm" onClick={onClose} aria-label="Close">
  <X size={16} />
</IconButton>
```

---

### 4.2 Overlays (`src/Components/ui/overlays/`)

Import via: `import ModalShell from '@/components/overlays/ModalShell'`
Or specific modals: `import { CalendarModal } from '@/components/overlays'`

#### `ModalShell` — **The reusable modal frame**

The base shell for every dialog in the application. Renders a backdrop, centred panel, header (title + subtitle + close button), body slot, and optional footer slot.

**Props:**
```
open     boolean      Controls visibility (returns null when false)
title    string       Modal heading
subtitle string?      Optional sub-heading
onClose  () => void   Close handler
children ReactNode    Modal body content
footer   ReactNode?   Action buttons row (rendered inside footer bar)
```

**Characteristics:** Fixed z-50 overlay, `bg-black/50` backdrop, `backdrop-blur-sm`, `rounded-2xl`, `shadow-2xl`. Theme-aware via Tailwind `dark:` variants internally.

**When to use:** Every new modal/dialog. Always wrap with `ModalShell` — never build a custom modal from scratch.
**When NOT to use:** Non-modal panels, drawers, inline expanded sections.

**Example:**
```jsx
<ModalShell
  open={isOpen}
  title="Edit Entry"
  subtitle="Changes apply to current month"
  onClose={() => setIsOpen(false)}
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleSave}>Save</Button>
    </>
  }
>
  {/* body content */}
</ModalShell>
```

#### Existing Modal Implementations (do NOT recreate these)

| File | Purpose |
|------|---------|
| `CalendarModal.jsx` | Month/year date-range picker |
| `ColumnEditorModal.jsx` | Create / edit journal columns with scope (this month / all months) |
| `CommentModal.jsx` | Full-text comment editor for a journal entry |
| `NewNoteModal.jsx` | Create a new text note |
| `NewTaskModal.jsx` | Create a new task with metadata |

If you need to open one of these, import and use the existing component. If you need a new modal, create a new file that uses `ModalShell` as its wrapper.

---

### 4.3 Feedback (`src/Components/ui/feedback/`)

#### `Toast` / `ToastProvider` / `useToast`

A full toast notification system with portal rendering, position control, auto-dismiss, pause-on-hover, and a progress bar.

Import:
```js
import { ToastProvider, useToast } from '@/components/feedback/Toast'
```

**Setup (already done in app root — do NOT add another provider):**
```jsx
<ToastProvider position="top-right">
  <App />
</ToastProvider>
```

**Usage inside any component:**
```js
const toast = useToast()

toast.success("Entry saved")
toast.error("Failed to save", { description: "Check your connection" })
toast.warning("Overwriting data")
toast.info("Streak resets at midnight")
toast.brand("Milestone unlocked 🔥")

// Custom duration or position
toast.success("Saved", { duration: 2000, position: "bottom-left" })

// Persistent toast (manual dismiss)
const id = toast.info("Uploading...", { duration: Infinity })
toast.dismiss(id)
toast.dismissAll()
```

**Toast types:** `success` (teal), `error` (pink), `warning` (orange), `info` (teal), `brand` (orange→pink gradient)

**When to use:** Any user-facing feedback for async operations, confirmations, or errors.
**When NOT to use:** Inline form validation errors (use field-level error text instead).

---

### 4.4 Composites (`src/Components/ui/composites/`)

#### `ColumnStatCard`

A metric card displaying a sparkbar chart, average, total, and active-days count for a single journal column.

```jsx
import ColumnStatCard from '@/components/composites/ColumnStatCard'

<ColumnStatCard
  column={column}       // { id, label, type }
  entries={entries}     // array of journal entry objects
  monthLabel="October 2023"
/>
```

Fully token-aware (calls `getUiTokens` internally). Uses `tokens.colors.status.success` for bar fill.

**When to use:** Displaying per-column analytics/stat summaries.
**When NOT to use:** General-purpose stat cards with different data shapes — extend this component instead.

---

### 4.5 Layout Components (`src/Components/layout/`)

#### `Sidebar` (`src/Components/layout/Sidebar/Sidebar.jsx`)

The application's primary navigation sidebar.

**Behaviour:**
- Fixed on mobile (`z-40`), static on `md+`
- Controlled by `useSidebarStore` (`isOpen`, `setOpen`, `toggle`)
- Contains nav items, theme toggle, logout button, user card
- Uses `Button` with `variant="ghost"` for theme/logout, `SidebarItem` (internal) for nav links
- Token-aware: background and border from `getUiTokens`

**When to use:** Already rendered by `AppNavigator`. Do NOT instantiate another `Sidebar`.
**When NOT to use:** Do not modify this file to add page-specific content — it is a shared layout component.

**To add a new nav item:**
1. Add a route object to `src/config/navigation.js`
2. Add a `<SidebarItem>` entry inside `Sidebar.jsx`'s `<nav>` block
3. Add the `<Route>` inside `AppNavigator.jsx`

#### `AppNavigator` (`src/Components/layout/AppNavigator.jsx`)

The root router. Wraps all pages in `<JournalProvider>`. Handles theme initialization on mount via `useThemeStore.getState().initTheme()`.

**Current routes:**
```
/             → Login
/dashboard    → Dashboard
/analytics    → Analytics
/notes        → Notes
*             → Redirect to /
```

**To add a new page:** Add a `<Route>` here and create the page component under `src/Pages/YourPage/YourPage.jsx`.

---

## 5. State Management

### 5.1 `useThemeStore` — `src/hooks/useThemeStore.js`

Zustand store (persisted to localStorage under key `"theme-store"`).

```js
import { useThemeStore } from '@/hooks/useThemeStore'

const theme       = useThemeStore((state) => state.theme)       // "light" | "dark"
const toggleTheme = useThemeStore((state) => state.toggleTheme) // () => void
```

Also exposes `initTheme()` — called once on app mount by `AppNavigator`. Never call it elsewhere.

**When to use:** Any component that needs to know or change the current theme.
**Do NOT:** Create a new theme state anywhere. This is the single source of truth.

---

### 5.2 `useSidebarStore` — `src/hooks/useSidebarStore.js`

Zustand store (not persisted).

```js
import { useSidebarStore } from '@/hooks/useSidebarStore'

const { isOpen, setOpen, toggle } = useSidebarStore()
```

**When to use:** Hamburger menu buttons, mobile nav triggers, sidebar overlay click handlers.

---

## 6. Context Providers

### 6.1 `AuthContext` / `AuthProvider` — `src/contexts/AuthContext.jsx`

Provides: `{ user, login, logout }`

```js
import { useAuth } from '@/hooks/useAuth'
// or
import { useAuth } from '@/contexts/AuthContext'

const { user, login, logout } = useAuth()
```

`login(credentials)` → sets user, persists to localStorage, navigates to `/dashboard`.
`logout()` → clears user, removes localStorage key, navigates to `/`.

**When to use:** Any component that needs to know who is logged in, or to trigger login/logout.
**Do NOT:** Store auth state anywhere else. No additional auth context.

---

### 6.2 `JournalContext` / `JournalProvider` — `src/contexts/JournalContext.jsx`

The central data store for the journal feature. Provides:

```js
import { useJournal } from '@/contexts/JournalContext'

const {
  selectedMonth, selectedYear,    // current month/year selection (integers)
  setSelectedMonth, setSelectedYear,
  activeMonthKey,                 // string key e.g. "2023-9"
  monthLabel,                     // e.g. "October 2023"
  effectiveColumns,               // active column definitions for current month
  handleSaveColumn,               // (columnData, scope: "all"|"month") => void
  handleDeleteColumn,             // (columnId, scope: "all"|"month") => void
  currentEntries,                 // array of entry objects for current month
  updateCell,                     // (entryId, colId, value) => void
  updateField,                    // (entryId, field, value) => void
} = useJournal()
```

**Exported helpers (import directly from context file):**
```js
import { MONTH_NAMES, MONTH_ABBR, DEFAULT_COLUMNS,
         generateMonthEntries, monthKey } from '@/contexts/JournalContext'
```

**When to use:** Any page or component that reads or writes journal entries, columns, or month selection.
**Do NOT:** Store journal data in local component state or a separate store.

---

### 6.3 `ThemeContext` / `ThemeProvider` — `src/contexts/ThemeContext.jsx`

Thin context wrapper over `useThemeStore`. Provided as an alternative hook:

```js
import { useTheme } from '@/contexts/ThemeContext'
const { theme, toggleTheme } = useTheme()
```

Prefer `useThemeStore` directly for most cases. `ThemeProvider` is available for future use.

---

## 7. API Service Layer (`src/services/core/`)

### `apiClient.js`

Pre-configured Axios instance:
- `baseURL` → `VITE_API_BASE_URL` env var (default `http://localhost:3000/api`)
- `withCredentials: true`
- `timeout: 15000ms`
- Request interceptor: attaches Bearer token from `getAccessToken()`
- Response interceptor: handles 401 with automatic token refresh via `refreshAccessToken()`

```js
import { apiClient } from '@/services/core/apiClient'

const res = await apiClient.get('/entries')
const res = await apiClient.post('/entries', payload)
```

**When to use:** Every HTTP call in the app. Never create a second Axios instance.

### `endpoints.js`

Central registry of all API endpoint strings. Always add new endpoints here, never inline them in components.

### `apiMethods.js`

Higher-level functions that call `apiClient` using endpoints. Add new API method functions here. Import them into contexts or hooks that need them.

### `session.js`

Manages access tokens: `getAccessToken()`, `refreshAccessToken()`, `clearSession()`. Never manage tokens outside this file.

---

## 8. Configuration (`src/config/`)

### `navigation.js`

```js
navigation.sidebarItems = [
  { label: "Dashboard", path: "/dashboard", icon: "LayoutGrid" },
  { label: "Analytics", path: "/analytics", icon: "BarChart3" },
  { label: "Notes",     path: "/notes",     icon: "FileText" },
]
navigation.auth.login  = "/"
navigation.auth.logout = "/"
```

**When adding a new page:** Add its sidebar entry here first.

### `appConfig.js`

Top-level config object composing `env`, `navigation`, `constants`, and feature flags:
```js
appConfig.features.enableAnalytics         = true
appConfig.features.enableNotes             = true
appConfig.features.enableRichTextNotes     = true
appConfig.features.enableMultiColumnEditing = true
appConfig.theme.defaultTheme               = "light"
appConfig.theme.allowUserThemeToggle       = true
```

### `constants.js`

Static data constants:
```js
constants.THEME_STORAGE_KEY  = "theme-store"
constants.USER_STORAGE_KEY   = "auth-user"
constants.MONTHS             = ["January", ..., "December"]
constants.MONTH_ABBR         = ["Jan", ..., "Dec"]
constants.DEFAULT_COLUMNS    = [ rating, sleep, deepWork, comment ]
```

---

## 9. Icons

This project uses **`lucide-react`** exclusively. Never add another icon library.

```js
import { LayoutGrid, BarChart3, FileText, X, Sun, Moon, LogOut,
         ChevronRight, CheckCircle2, XCircle, AlertTriangle, Info, Flame } from 'lucide-react'
```

Always use `size` (number) and `strokeWidth` (number) props. Default stroke is `2`.

---

## 10. How to Build a New Page — Step-by-Step

1. **Create** `src/Pages/YourPage/YourPage.jsx`
2. **Add a route** in `src/Components/layout/AppNavigator.jsx`:
   ```jsx
   import YourPage from '@/pages/YourPage/YourPage'
   <Route path="/your-page" element={<YourPage />} />
   ```
3. **Add a nav item** in `src/config/navigation.js` and a `<SidebarItem>` in `Sidebar.jsx`
4. **Scaffold the page** — call `getUiTokens(theme)` at the top, build layout using token values:
   ```jsx
   import { useThemeStore }   from '@/hooks/useThemeStore'
   import { getUiTokens }     from '@/components/ui/uiTokens'
   import { Button, IconButton } from '@/components/primitives'

   export default function YourPage() {
     const theme  = useThemeStore((s) => s.theme)
     const tokens = getUiTokens(theme)

     return (
       <div style={{ backgroundColor: tokens.colors.background, minHeight: '100vh' }}>
         {/* ... */}
       </div>
     )
   }
   ```
5. **Use existing primitives** — `Button`, `IconButton`, `ModalShell`, `Toast`
6. **Use existing contexts** — `useJournal()`, `useAuth()`, `useThemeStore()`
7. **Never add new Tailwind config** — the existing setup handles everything

---

## 10.1 CSS Style System (`src/styles/`)

All stylesheets live in `src/styles/`. They are imported via a barrel:

```
globals.css   ← entry point, imported by main.jsx
  └─ index.css  ← barrel that @imports all below
       ├─ variables.css   CSS custom properties mirroring all JS tokens
       ├─ reset.css       Minimal reset on top of Tailwind preflight
       ├─ typography.css  Semantic .type-* classes
       ├─ scrollbar.css   Theme-aware scrollbar styles + .scroll-thin/.scroll-hidden
       ├─ animations.css  @keyframes + .animate-* utility classes
       ├─ skeleton.css    .skeleton shimmer base + shape/width helpers
       └─ utilities.css   Layout, surface, border, card, transition helpers
```

#### CSS Custom Properties (`variables.css`)

Every JS design token is also available as a CSS variable for component `.css` files:

```css
--color-brand-teal        --color-bg          --color-surface
--color-text-primary      --color-border      --color-border-subtle
--space-md                --space-xl          --space-xxl
--radius-lg               --radius-xl         --radius-card
--shadow-sm               --shadow-md         --shadow-xxl
--font-serif              --font-sans         --font-mono
--z-modal                 --z-toast           --z-drawer
--duration-normal         --ease-in-out
```

Dark mode overrides are under `.dark {}`. Never define new raw hex values in a CSS file — map to these variables.

#### Skeleton CSS Classes (`skeleton.css`)

| Class | Purpose |
|-------|---------|
| `.skeleton` | Base shimmer element — apply to any placeholder div |
| `.skeleton-text` | 12px-high text line |
| `.skeleton-text-sm` | 10px-high text line |
| `.skeleton-heading` | 20px-high heading placeholder |
| `.skeleton-circle` | Circular avatar placeholder |
| `.skeleton-card` | Card-shaped placeholder |
| `.skeleton-button` | 36px button placeholder |
| `.skeleton-w-full/3/4/2/3/1/2/1/3/1/4` | Width helpers |
| `.skeleton-delay-1/2/3/4` | Animation stagger delays |

#### Typography Classes (`typography.css`)

| Class | Maps to |
|-------|---------|
| `.type-heading-xl` | Playfair 32px/700 |
| `.type-heading-lg` | Playfair 21px/600 |
| `.type-heading-md` | Playfair 19px/600 |
| `.type-heading-sm` | Playfair 17px/600 |
| `.type-body-lg` | Sans 15px/400 |
| `.type-body-md` | Sans 13px/400 |
| `.type-body-sm` | Sans 12px/400 |
| `.type-caption` | Sans 11px/400 |
| `.type-label` | Sans 10.5px/500 uppercase tracking |
| `.type-button` | Sans 13px/500 |

#### Utility Classes (`utilities.css`)

```css
.flex-center / .flex-between / .flex-start / .flex-end / .flex-col
.surface / .surface-subtle / .surface-page
.border-default / .border-subtle / .border-top / .border-bottom
.card        /* surface + border + radius-card + shadow-sm */
.panel       /* surface + border + radius-panel */
.focus-ring  /* brand-teal outline on :focus-visible */
.truncate-1 / .truncate-2
.divider / .divider-subtle
.transition-colors / .transition-all / .transition-transform
.opacity-disabled / .opacity-muted
.sr-only
.status-dot / .status-dot-success / .status-dot-error / .status-dot-warning
.avatar-gradient  /* pink→orange→teal gradient (matches sidebar user card) */
```

---

## 11. How to Build a New Component — Checklist

- [ ] Does a similar component already exist? Check `composites/`, `feedback/`, `overlays/`, `primitives/` first.
- [ ] Import `getUiTokens` and `useThemeStore` — resolve all visual values from `tokens`.
- [ ] **If passing tokens to child components declared in the same file — always pass `tokens={tokens}` as a prop.** Never let a sub-component call `getUiTokens` independently if the parent already has it.
- [ ] Use `Button` or `IconButton` for any clickable element.
- [ ] Use `ModalShell` if the component is a dialog.
- [ ] Use `useToast()` for user feedback.
- [ ] Use `spacing.*`, `radius.*`, `shadows.*`, `typography.*` for all style values.
- [ ] Do not introduce new global state. Use existing Zustand stores or contexts.
- [ ] Icons only from `lucide-react`.
- [ ] Test in both light and dark mode by calling `toggleTheme()`.

---

## 12. Feedback (Skeleton) Components — Full Reference

All skeletons are in `src/Components/ui/feedback/`. Import via barrel:

```js
import { CardSkeleton, ChartSkeleton, TableSkeleton, ListSkeleton,
         FormSkeleton, ProfileSkeleton, DetailSkeleton,
         DashboardSkeleton } from '@/components/feedback'
```

| Component | Use For | Key Props |
|-----------|---------|----------|
| `CardSkeleton` | Any stat/metric card loading state | `className` |
| `ChartSkeleton` | Any chart (bar/line/area) loading state | `height`, `className` |
| `TableSkeleton` | Data grid / journal table loading | `rows` (default 6), `cols` (default 5) |
| `ListSkeleton` | Vertical lists — notes, tasks, search results | `items` (default 5) |
| `FormSkeleton` | Form loading state — settings, edit panels | `fields` (default 4) |
| `ProfileSkeleton` | User profile / author card | `className` |
| `DetailSkeleton` | Single-item detail view | `className` |
| `DashboardSkeleton` | Full Dashboard page loading state | *(none)* |
| `Toast` / `useToast` / `ToastProvider` | Notification toasts | See §4.3 |

All skeleton components:
- Call `getUiTokens(theme)` internally — they are automatically theme-aware.
- Use `.skeleton` CSS class from `src/styles/skeleton.css` for the shimmer effect.
- Render with `aria-hidden="true"` — they are decorative placeholders.

---

## 13. Composite Stat Components — Full Reference

All composites are in `src/Components/ui/composites/`. Import via barrel:

```js
import { ColumnStatCard, StatBarChart, StatLineChart, StatAreaChart,
         StatPieChart, StatPercentageRing, StatHeatmap,
         SpiderChart } from '@/components/composites'
// or by alias:
import { StatBarChart } from '@/components/Stats'
```

| Component | Chart Type | Best For | Key Props |
|-----------|-----------|----------|-----------|
| `ColumnStatCard` | Spark bars | Any numeric/box column summary | `column`, `entries`, `monthLabel` |
| `StatBarChart` | Vertical bars | Numeric columns over time | `column`, `entries`, `monthLabel`, `height` |
| `StatLineChart` | SVG polyline | Continuous numeric data | `column`, `entries`, `monthLabel`, `height` |
| `StatAreaChart` | Gradient area | Smooth numeric trends | `column`, `entries`, `monthLabel`, `height`, `color` |
| `StatPieChart` | SVG donut | Boolean (box) active/inactive proportion | `column`, `entries`, `monthLabel`, `size` |
| `StatPercentageRing` | Circular ring | Single percentage / goal progress | `label`, `value`, `size`, `color`, `subtitle` |
| `StatHeatmap` | Calendar grid | Day-by-day activity heatmap | `column`, `entries`, `monthLabel`, `year`, `month` |
| `SpiderChart` | Radar / spider | Multi-column normalised averages side-by-side | `columns`, `entries`, `monthLabel`, `size`, `color` |

**Data contract — `column` prop:**
```js
{ id: 'sleep', label: 'Sleep', type: 'number' | 'box' }
```

**Data contract — `entries` prop:**
```js
Array of journal entry objects from useJournal().currentEntries
// Each entry: { id, day, comment, cells: {}, rating, deepWork, sleep }
```

All composites call `getUiTokens(theme)` internally. Never pass raw colours to them.

---

## 14. Common Patterns & Pitfalls

### ✅ Tokens in child components declared in the same file

When a file exports a default page/component AND defines private sub-components below it, the sub-components do **not** automatically have access to `tokens`. You must pass `tokens` as a prop.

```jsx
// ✅ CORRECT — parent passes tokens down
export default function MyPage() {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)
  return <MyItem tokens={tokens} />
}

function MyItem({ tokens, label }) {
  return <p style={{ color: tokens.colors.textPrimary }}>{label}</p>
}

// ❌ WRONG — tokens is undefined; crashes with "Cannot read properties of undefined"
function MyItem({ label }) {
  const tokens = getUiTokens()   // theme is missing → returns undefined
  return <p style={{ color: tokens.colors.textPrimary }}>{label}</p>
}
```

### ✅ Using the Token Bridge Correctly

```js
// Always:
const theme  = useThemeStore((s) => s.theme)  // "light" | "dark"
const tokens = getUiTokens(theme)             // resolved token object

// tokens.colors.surface    ← not tokens.colors.light.surface
// tokens.colors.border     ← not colors.light.border
// tokens.colors.brand.teal ← not "#2DBFAE"
// tokens.colors.status.success, tokens.colors.tags.work …
```

### ✅ CSS @import Order

In any `.css` file that uses `@import`, all imports **must appear before all other statements**.

```css
/* ✅ Correct order */
@import url("https://fonts.googleapis.com/...");
@import "tailwindcss";
@import './index.css';
/* ... rest of CSS ... */
```

---

## 15. Quick Reference — Import Cheatsheet

```js
// ── UI Primitives ────────────────────────────────────────────
import { Button, IconButton } from '@/components/primitives'

// ── Overlays / Modals ────────────────────────────────────────
import { ModalShell, CalendarModal, ColumnEditorModal,
         CommentModal, NewNoteModal, NewTaskModal } from '@/components/overlays'

// ── Feedback / Skeletons ─────────────────────────────────────
import { ToastProvider, useToast,
         CardSkeleton, ChartSkeleton, TableSkeleton,
         ListSkeleton, FormSkeleton, ProfileSkeleton,
         DetailSkeleton, DashboardSkeleton } from '@/components/feedback'

// ── Composite Charts & Cards ─────────────────────────────────
import { ColumnStatCard, StatBarChart, StatLineChart, StatAreaChart,
         StatPieChart, StatPercentageRing,
         StatHeatmap, SpiderChart } from '@/components/composites'

// ── Token Bridge (use in every component) ────────────────────
import { getUiTokens } from '@/components/ui/uiTokens'

// ── Raw Design Tokens (rarely needed directly) ───────────────
import { colors, typography, spacing, radius, shadows,
         zIndex, breakpoints, animations, transitions,
         opacity, elevation, semanticTokens } from '@/theme'

// ── Zustand Stores ───────────────────────────────────────────
import { useThemeStore }   from '@/hooks/useThemeStore'
import { useSidebarStore } from '@/hooks/useSidebarStore'

// ── Auth Hook ────────────────────────────────────────────────
import { useAuth } from '@/hooks/useAuth'

// ── Feature Contexts ─────────────────────────────────────────
import { useJournal, JournalProvider,
         MONTH_NAMES, MONTH_ABBR, DEFAULT_COLUMNS,
         generateMonthEntries, monthKey } from '@/contexts/JournalContext'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { useTheme }              from '@/contexts/ThemeContext'

// ── Configuration ────────────────────────────────────────────
import { appConfig }  from '@/config/appConfig'
import { navigation } from '@/config/navigation'
import { constants }  from '@/config/constants'

// ── API Layer ────────────────────────────────────────────────
import { apiClient } from '@/services/core/apiClient'
```

---

*This document reflects the actual state of the codebase. Do not assume, invent, or introduce anything outside of what is documented here. If a reusable asset is missing that you genuinely need, note it clearly in your response before creating it — and follow the established patterns.*
