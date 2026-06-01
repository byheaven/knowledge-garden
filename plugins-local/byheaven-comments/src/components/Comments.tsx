import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { classNames } from "@quartz-community/utils/lang"
// @ts-expect-error - Inline script loaded as text by the tsup text-loader plugin
import walineScript from "./scripts/waline.inline.ts"

// BYHEAVEN Waline comments + pageview counter.
//
// Ported from the v4 fork's `quartz/components/Comments.tsx` (Waline branch
// only). The official quartz-community/comments plugin supports giscus only, so
// this local plugin ships the Waline mount point + client script instead.
//
// Config flows YAML option -> data-* attribute -> client script. The visitor's
// comment-UI language (zh-CN / en) is decided in the browser from the bilingual
// `quartz-preferred-lang` localStorage key, so it is NOT set here.

export interface WalineOptions {
  serverURL: string
  path?: string
  lang?: string
  emoji?: string[]
  dark?: boolean | "auto"
  meta?: string[]
  requiredMeta?: string[]
  wordLimit?: number
  pageSize?: number
  login?: "enable" | "disable" | "force"
  copyright?: boolean
  pageview?: boolean
}

function boolToStringBool(b: boolean): string {
  return b ? "1" : "0"
}

const Comments: QuartzComponentConstructor<WalineOptions> = (opts?: WalineOptions) => {
  const Component: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    // Per-page opt-out via frontmatter `comments: false`.
    const commentsOverride = (fileData.frontmatter as Record<string, unknown> | undefined)?.comments
    if (commentsOverride === false || commentsOverride === "false") {
      return <></>
    }

    // Mirror the v4 fork's condition exactly: show comments only on real
    // content pages (`.md`-backed), never on folder / tag index pages. The
    // built-in `not-index` condition (set in YAML) only excludes the root
    // `index` slug; folder pages like `cn/index` and `tags/index` would
    // otherwise leak a comment box, and synthetic folder/tag pages have no
    // `.md` filePath — guard on both here.
    const slug = (fileData.slug as string | undefined) ?? ""
    const isRealFile = typeof fileData.filePath === "string" && fileData.filePath.endsWith(".md")
    if (slug.endsWith("/index") || !isRealFile) {
      return <></>
    }

    const serverURL = opts?.serverURL ?? ""

    return (
      <div
        class={classNames(displayClass, "waline")}
        data-server-url={serverURL}
        data-path={opts?.path ?? "window.location.pathname"}
        data-dark={String(opts?.dark ?? "auto")}
        data-emoji={opts?.emoji ? JSON.stringify(opts.emoji) : ""}
        data-meta={opts?.meta ? JSON.stringify(opts.meta) : ""}
        data-required-meta={opts?.requiredMeta ? JSON.stringify(opts.requiredMeta) : ""}
        data-word-limit={opts?.wordLimit !== undefined ? String(opts.wordLimit) : ""}
        data-page-size={String(opts?.pageSize ?? 10)}
        data-login={opts?.login ?? "enable"}
        data-copyright={boolToStringBool(opts?.copyright ?? true)}
      ></div>
    )
  }

  Component.afterDOMLoaded = walineScript as string
  return Component
}

export default Comments
