import path from "node:path"
import fs from "node:fs/promises"
import type {
  QuartzEmitterPluginInstance,
  BuildCtx,
  FilePath,
  FullSlug,
  ProcessedContent,
} from "@quartz-community/types"
import { joinSegments } from "@quartz-community/types"
import { simplifySlug, resolveRelative } from "@quartz-community/utils"
import type { VFile } from "vfile"

// --- BYHEAVEN case-preserving URL redirects ----------------------------------
// v5's slug builder lowercases mixed-case slugs (e.g. `cn/AMIO的愿景` ->
// `cn/amio的愿景`, `en/The-vision-of-AMIO` -> `en/the-vision-of-amio`), so the
// v4 production URLs (case preserved) would 404 after the migration.
//
// The official `alias-redirects` plugin cannot solve this: `note-properties`
// runs `aliases` through `slugifyFilePath`, which lowercases — so the alias slug
// collapses onto the article's own (lowercased) slug, producing a self-referential
// redirect that overwrites the real page. This emitter reads a custom `oldUrls`
// frontmatter array and writes redirect stubs at the EXACT given paths (no
// slugify, no lowercase), pointing at the article's new slug. Same redirect
// mechanism as alias-redirects, minus the lossy slugification.
//
// `oldUrls` entries are absolute, root-relative slugs (no leading slash, no
// `.html`), e.g. `cn/AMIO的愿景`.

const REDIRECTS_EMITTER_NAME = "ByheavenRedirects"

async function write(
  ctx: BuildCtx,
  slug: FullSlug,
  ext: string,
  content: string,
): Promise<FilePath> {
  const pathToPage = joinSegments(ctx.argv.output, slug + ext) as FilePath
  const dir = path.dirname(pathToPage)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(pathToPage, content)
  return pathToPage
}

function redirectHtml(targetSlug: string, redirUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en-us">
<head>
<title>${targetSlug}</title>
<link rel="canonical" href="${redirUrl}">
<meta name="robots" content="noindex">
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${redirUrl}">
</head>
</html>
`
}

async function* processFile(ctx: BuildCtx, file: VFile): AsyncGenerator<FilePath> {
  const data = file.data as Record<string, unknown>
  // `oldUrls` is an arbitrary frontmatter key, so it lands under
  // `file.data.frontmatter`, not directly on `file.data` (unlike `aliases`,
  // which note-properties hoists + slugifies).
  const frontmatter = data.frontmatter as Record<string, unknown> | undefined
  const oldUrls = frontmatter?.oldUrls
  if (!Array.isArray(oldUrls)) return

  const ogSlug = simplifySlug(data.slug as FullSlug)

  for (const raw of oldUrls) {
    if (typeof raw !== "string" || raw.length === 0) continue
    // Use the path verbatim (case preserved); only strip a leading slash.
    const oldSlug = raw.replace(/^\/+/, "") as FullSlug
    // Skip if the old path already equals the new slug (nothing to redirect).
    if (oldSlug === (data.slug as string)) continue
    const redirUrl = resolveRelative(oldSlug, ogSlug)
    yield write(ctx, oldSlug, ".html", redirectHtml(ogSlug, redirUrl))
  }
}

export function byheavenRedirects(): QuartzEmitterPluginInstance {
  return {
    name: REDIRECTS_EMITTER_NAME,
    async *emit(ctx: BuildCtx, content: ProcessedContent[]): AsyncGenerator<FilePath> {
      for (const [, file] of content) {
        yield* processFile(ctx, file)
      }
    },
    async *partialEmit(ctx, _content, _resources, changeEvents): AsyncGenerator<FilePath> {
      for (const changeEvent of changeEvents) {
        if (!changeEvent.file) continue
        if (changeEvent.type === "add" || changeEvent.type === "change") {
          yield* processFile(ctx, changeEvent.file)
        }
      }
    },
  }
}
