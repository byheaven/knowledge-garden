// Component-only plugin entry point.
//
// BYHEAVEN's bilingual UI components are shipped via the `./components` export
// and declared in package.json's `quartz.components` manifest, so Quartz loads
// and registers them automatically (LanguageSwitcher, PrevNext). This file has
// no factory and no side effects — the head/client scripts that drive the
// bilingual behavior live in the sibling `byheaven-bilingual-head` transformer
// plugin so they are injected exactly once.
export {}
