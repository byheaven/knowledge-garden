import { QuartzTransformerPlugin } from '@quartz-community/types';

/**
 * BYHEAVEN visual theme (transformer-only, runs once).
 *
 * Emits, via externalResources().css:
 *   - the compiled theme stylesheet inline (palette + Baseline callouts +
 *     fork-specific layout/spacing/font-override tweaks), and
 *   - the two web-font stylesheets as remote <link>s.
 *
 * `markdownPlugins` returns an empty list purely to satisfy Quartz's transformer
 * category validation (a transformer must expose at least one of textTransform /
 * markdownPlugins / htmlPlugins); the real work is in externalResources.
 */
declare const BilingualTheme: QuartzTransformerPlugin;

export { BilingualTheme, BilingualTheme as default };
