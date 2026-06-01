import { defineConfig } from "tsup"
import type { Plugin } from "esbuild"

// Compiles imported *.scss files to a CSS string at plugin-build time and
// returns them as text so they can be embedded as inline CSSResource content.
// Mirrors the SCSS loader in the sibling byheaven-search plugin.
const scssTextPlugin: Plugin = {
  name: "scss-text-loader",
  setup(parentBuild) {
    parentBuild.onLoad({ filter: /\.scss$/ }, async (args) => {
      const sass = await import("sass")
      const result = sass.compile(args.path)
      return { contents: result.css, loader: "text" }
    })
  },
}

const SINGLETON_EXTERNALS = [
  "preact",
  "preact/hooks",
  "preact/jsx-runtime",
  "preact/compat",
  "@jackyzha0/quartz",
  "@jackyzha0/quartz/*",
  "vfile",
  "vfile/*",
  "unified",
]

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  dts: true,
  tsconfig: "tsconfig.json",
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  splitting: false,
  noExternal: [/.*/],
  external: SINGLETON_EXTERNALS,
  outDir: "dist",
  platform: "node",
  esbuildPlugins: [scssTextPlugin],
})
