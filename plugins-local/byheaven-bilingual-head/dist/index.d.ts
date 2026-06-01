import { QuartzTransformerPlugin } from '@quartz-community/types';

/**
 * BYHEAVEN bilingual head injector (transformer-only, runs once).
 *
 *   - `headRedirect` is emitted as an inline beforeDOMReady JSResource. Quartz
 *     renders beforeDOMReady inline scripts directly inside <head>, so it runs
 *     before any content paints: detects the preferred language, persists it,
 *     and redirects the homepage to "/cn" when the preference is Chinese.
 *   - `langClient` is emitted as an inline afterDOMReady JSResource: sets the
 *     `saved-lang` attribute on <html> (driving the switcher glyph) and hides
 *     cross-language items in any Recent Notes list. Re-runs on every SPA nav.
 *
 * `markdownPlugins` returns an empty list purely to satisfy Quartz's transformer
 * category validation (a transformer must expose at least one of textTransform /
 * markdownPlugins / htmlPlugins); the real work is in externalResources.
 */
declare const BilingualHead: QuartzTransformerPlugin;

export { BilingualHead, BilingualHead as default };
