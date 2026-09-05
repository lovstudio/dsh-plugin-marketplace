import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { transform } from 'lightningcss'
import MagicString from 'magic-string'
import { defineConfig, type UserConfig } from 'tsdown'

const PACKAGE_NAME = '@lovstudio/dsh-plugin-marketplace'

/** The version the browser half reports, frozen into the bundle it ships in. */
const PACKAGE_VERSION = (JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }).version
const CSS_PREFIX = '\0dsh-css:'
const CSS_SUFFIX = '.mjs'

const CLIENT_EXTERNALS = new Set([
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-store',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
])

function isBareSpecifier(specifier: string): boolean {
  return !specifier.startsWith('.') && !specifier.startsWith('/') && !specifier.startsWith('\0')
}

function styleModule(file: string, css: string, classMap: Readonly<Record<string, string>>): string {
  const tagId = `${PACKAGE_NAME}/${basename(file)}`
  return [
    `const css = ${JSON.stringify(css)};`,
    `const tagId = ${JSON.stringify(tagId)};`,
    'if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {',
    '  const tag = document.createElement("style");',
    `  tag.dataset.plugin = ${JSON.stringify(PACKAGE_NAME)};`,
    '  tag.dataset.pluginCss = tagId;',
    '  tag.textContent = css;',
    '  document.head.appendChild(tag);',
    '}',
    `export default ${JSON.stringify(classMap)};`,
  ].join('\n')
}

const cssModulesPlugin = {
  name: 'dsh-css-modules-inline',
  resolveId(source: string, importer: string | undefined) {
    if (!source.endsWith('.module.css')) return null
    const file = importer === undefined ? source : resolve(dirname(importer), source)
    return CSS_PREFIX + file + CSS_SUFFIX
  },
  async load(this: { addWatchFile(file: string): void }, id: string) {
    if (!id.startsWith(CSS_PREFIX)) return null
    const file = id.slice(CSS_PREFIX.length, -CSS_SUFFIX.length)
    this.addWatchFile(file)
    const result = transform({
      filename: file,
      code: await readFile(file),
      cssModules: { pattern: '[hash]_[local]' },
      minify: true,
    })
    const classMap: Record<string, string> = {}
    for (const [local, value] of Object.entries(result.exports ?? {}).sort(([left], [right]) => left.localeCompare(right))) {
      classMap[local] = value.name
    }
    return styleModule(file, result.code.toString(), classMap)
  },
}

const normalizedGeneratedWhitespace = {
  name: 'normalized-generated-whitespace',
  renderChunk(code: string) {
    const matches = [...code.matchAll(/[ \t]+$/gm)]
    if (matches.length === 0) return null
    const output = new MagicString(code)
    for (const match of matches.reverse()) {
      if (match.index === undefined) continue
      output.remove(match.index, match.index + match[0].length)
    }
    return { code: output.toString(), map: output.generateMap({ hires: true }) }
  },
}

function hostConfig(entry: UserConfig['entry'], outDir: string): UserConfig {
  return {
    entry,
    outDir,
    format: ['esm'],
    platform: 'node',
    target: 'es2024',
    fixedExtension: false,
    dts: false,
    clean: false,
    deps: {
      neverBundle: isBareSpecifier,
      alwaysBundle: (specifier: string) => !isBareSpecifier(specifier),
    },
  }
}

export default defineConfig([
  hostConfig({ index: 'lib/types/index.js' }, '.'),
  hostConfig({
    host: 'lib/types/host/index.js',
    invariant: 'lib/types/invariant.js',
    types: 'lib/types/client/types.js',
  }, 'lib'),
  {
    entry: { client: 'src/client/index.ts' },
    outDir: 'lib',
    format: ['cjs'],
    platform: 'browser',
    target: 'es2024',
    dts: false,
    sourcemap: true,
    clean: false,
    deps: {
      onlyBundle: false,
      neverBundle: (specifier: string) => CLIENT_EXTERNALS.has(specifier),
      alwaysBundle: (specifier: string) => !CLIENT_EXTERNALS.has(specifier),
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
      'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV ?? 'production'),
      'import.meta.env': JSON.stringify({ MODE: process.env.NODE_ENV ?? 'production' }),
      __MARKET_VERSION__: JSON.stringify(PACKAGE_VERSION),
    },
    plugins: [cssModulesPlugin, normalizedGeneratedWhitespace],
    outputOptions: {
      entryFileNames: 'client.cjs',
      sourcemapExcludeSources: false,
      banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(PACKAGE_NAME)}, factory: (require) => {`,
      intro: 'var module = { exports: {} }; var exports = module.exports;',
      footer: 'return module.exports; } });',
    },
  },
])
