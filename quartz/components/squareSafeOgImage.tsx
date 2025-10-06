import { SatoriOptions } from "satori/wasm"
import { GlobalConfiguration } from "../cfg"
import { SocialImageOptions } from "../util/og"
import { formatDate, getDate } from "./Date"
import readingTime from "reading-time"
import { i18n } from "../i18n"
import { getFontSpecificationName } from "../util/theme"

/**
 * Square-safe OG image component optimized for both 1200x630 and square crops
 *
 * Safe zone: Central 630x630px contains all critical content
 * Side zones: 285px on each side for decorative elements
 */
export const squareSafeOgImage: SocialImageOptions["imageStructure"] = ({
  cfg,
  userOpts,
  title,
  description,
  fileData,
  iconBase64,
  fonts,
}) => {
  const { colorScheme } = userOpts
  const colors = cfg.theme.colors[colorScheme]

  // Responsive font sizing based on title length
  const fontBreakPoint = 32
  const useSmallerFont = title.length > fontBreakPoint
  const titleFontSize = useSmallerFont ? 56 : 72

  // Format metadata
  const rawDate = getDate(cfg, fileData)
  const date = rawDate ? formatDate(rawDate, cfg.locale) : null

  const { minutes } = readingTime(fileData.text ?? "")
  const readingTimeText = i18n(cfg.locale).components.contentMeta.readingTime({
    minutes: Math.ceil(minutes),
  })

  // Get first 2 tags for display
  const tags = (fileData.frontmatter?.tags ?? []).slice(0, 2)

  const bodyFont = getFontSpecificationName(cfg.theme.typography.body)
  const headerFont = getFontSpecificationName(cfg.theme.typography.header)

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
              fontSize: 28,
              color: colors.gray,
              fontFamily: bodyFont,
              textAlign: "center",
            }}
          >
            {cfg.baseUrl}
          </div>
        </div>

        {/* Title and description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: titleFontSize,
              fontFamily: headerFont,
              fontWeight: 700,
              color: colors.dark,
              lineHeight: 1.15,
              textAlign: "center",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 28,
              fontFamily: bodyFont,
              color: colors.darkgray,
              lineHeight: 1.4,
              textAlign: "center",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </p>
        </div>

        {/* Footer with metadata and tags */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            paddingTop: "24px",
            borderTop: `2px solid ${colors.lightgray}`,
          }}
        >
          {/* Date and reading time */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "32px",
              color: colors.gray,
              fontSize: 22,
              fontFamily: bodyFont,
            }}
          >
            {date && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg
                  width="22"
                  height="22"
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
                width="22"
                height="22"
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

          {/* Tags */}
          {tags.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              {tags.map((tag: string) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    padding: "8px 16px",
                    backgroundColor: colors.highlight,
                    color: colors.secondary,
                    borderRadius: "20px",
                    fontSize: 20,
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
