import { SatoriOptions } from "satori/wasm"
import { GlobalConfiguration } from "../cfg"
import { SocialImageOptions } from "../util/og"
import { getFontSpecificationName } from "../util/theme"

/**
 * Square-safe OG image component optimized for both 1200x630 and square crops
 *
 * Minimalist design showing only title and tags
 * Safe zone: Central 630x630px contains all critical content
 * Side zones: 285px on each side for decorative elements
 */
export const squareSafeOgImage: SocialImageOptions["imageStructure"] = ({
  cfg,
  userOpts,
  title,
  fileData,
  iconBase64,
}) => {
  const { colorScheme } = userOpts
  const colors = cfg.theme.colors[colorScheme]

  // Responsive font sizing based on title length
  const fontBreakPoint = 24
  const useSmallerFont = title.length > fontBreakPoint
  const titleFontSize = useSmallerFont ? 64 : 80

  // Get first 3 tags for display
  const tags = (fileData.frontmatter?.tags ?? []).slice(0, 3)

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

        {/* Title - centered and prominent */}
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
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
