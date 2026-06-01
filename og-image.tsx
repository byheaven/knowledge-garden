import type { SocialImageOptions } from "./.quartz/plugins"

// `GlobalConfiguration.theme` is typed `unknown` upstream, so we cast it to a
// local minimal shape (mirrors how the og-image plugin's default imageStructure
// casts `cfg.theme as Theme`).
type FontSpec = string | { name: string }
type ColorScheme = {
  light: string
  gray: string
  darkgray: string
  dark: string
  secondary: string
  tertiary: string
  highlight: string
}
type OgTheme = {
  typography: { header: FontSpec; body: FontSpec }
  colors: Record<"lightMode" | "darkMode", ColorScheme>
}

// FontSpecification is `string | { name: string; ... }`. Inlined (rather than
// imported from the og-image plugin's `src/theme`) to avoid depending on a
// path the root build excludes from compilation.
function getFontSpecificationName(spec: FontSpec): string {
  return typeof spec === "string" ? spec : spec.name
}

// --- BYHEAVEN custom OG image ------------------------------------------------
// Ported from the v4 fork's `quartz/components/squareSafeOgImage.tsx`. Passed to
// the official quartz-community/og-image plugin via `CustomOgImages({ imageStructure })`
// in quartz.ts. Adapted to the v5 plugin's `imageStructure` signature:
//   - colors come from `cfg.theme.colors[colorScheme]` (colorScheme from userOpts)
//   - date is read directly from `fileData.dates` (modified → created → published)
//     because the og-image plugin does not pass `defaultDateType` into the callback
//   - reading time is computed inline and rendered via `userOpts.readingTimeText`
//     (the v4 i18n call is unavailable in the emitter context)
//
// Square-safe layout: central 630x630 safe zone holds title/date/reading-time/tags;
// 285px decorative gradient on each side so square crops keep the content centered.

function formatDate(d: Date, locale: string = "en-US"): string {
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

function pickDate(dates?: Record<string, Date>): Date | undefined {
  if (!dates) return undefined
  return dates.modified ?? dates.created ?? dates.published
}

// Word-based reading time (~200 wpm), with a CJK character fallback (~400 cpm)
// so Chinese articles report a sensible duration instead of ~0.
function estimateMinutes(text: string): number {
  if (!text) return 0
  const words = (text.match(/\S+/g) ?? []).length
  const cjk = (text.match(/[㐀-鿿豈-﫿]/g) ?? []).length
  const minutes = words / 200 + cjk / 400
  return Math.max(1, Math.ceil(minutes))
}

export const squareSafeOgImage: SocialImageOptions["imageStructure"] = ({
  cfg,
  userOpts,
  title,
  fileData,
  iconBase64,
}) => {
  const { colorScheme } = userOpts
  const theme = cfg.theme as OgTheme
  const colors = theme.colors[colorScheme]

  // Responsive font sizing based on title length.
  const fontBreakPoint = 24
  const useSmallerFont = title.length > fontBreakPoint
  const titleFontSize = useSmallerFont ? 64 : 80

  // First 3 tags for display.
  const tags = (fileData.frontmatter?.tags ?? []).slice(0, 3)

  const rawDate = pickDate(fileData.dates)
  const date = rawDate ? formatDate(rawDate, cfg.locale) : null

  const minutes = estimateMinutes(fileData.text ?? "")
  const readingTimeText = (userOpts.readingTimeText ?? ((m) => `${m} min read`))(minutes)

  const bodyFont = getFontSpecificationName(theme.typography.body)
  const headerFont = getFontSpecificationName(theme.typography.header)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        width: "100%",
        position: "relative",
        backgroundColor: colors.light,
      }}
    >
      {/* Left decorative gradient */}
      <div
        style={{
          width: "285px",
          height: "100%",
          background: `linear-gradient(135deg, ${colors.secondary}40, ${colors.tertiary}40)`,
          opacity: 0.5,
        }}
      />

      {/* Central content area - SAFE ZONE (630x630) */}
      <div
        style={{
          width: "630px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 40px",
          background: `radial-gradient(circle at center, ${colors.light} 0%, ${colors.light}f0 100%)`,
          position: "relative",
        }}
      >
        {/* Header with icon and site name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {iconBase64 && (
            <img
              src={iconBase64}
              width={96}
              height={96}
              style={{
                borderRadius: "50%",
                boxShadow: `0 4px 20px ${colors.secondary}40`,
              }}
            />
          )}
          <div
            style={{
              fontSize: 36,
              color: colors.darkgray,
              fontFamily: bodyFont,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            {cfg.baseUrl}
          </div>
        </div>

        {/* Title and metadata - centered */}
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: titleFontSize,
              fontFamily: headerFont,
              fontWeight: 700,
              color: colors.dark,
              lineHeight: 1.2,
              textAlign: "center",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            {title}
          </h1>

          {/* Date and reading time */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              color: colors.gray,
              fontSize: 24,
              fontFamily: bodyFont,
            }}
          >
            {date && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {date}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {readingTimeText}
            </div>
          </div>
        </div>

        {/* Tags - footer */}
        {tags.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              paddingTop: "24px",
            }}
          >
            {tags.map((tag: string) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  backgroundColor: colors.highlight,
                  color: colors.secondary,
                  borderRadius: "24px",
                  fontSize: 24,
                  fontFamily: bodyFont,
                  fontWeight: 600,
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right decorative gradient (mirror of left) */}
      <div
        style={{
          width: "285px",
          height: "100%",
          background: `linear-gradient(225deg, ${colors.secondary}40, ${colors.tertiary}40)`,
          opacity: 0.5,
        }}
      />
    </div>
  )
}
