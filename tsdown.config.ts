import type { Format, UserConfig } from 'tsdown'

import type { PackageManifest } from './meta/packages'
import { StaleGuardRecorder } from 'tsdown-stale-guard'

const externals = ['vue', /@kalu55\/.*/]

export default function createTsDownConfig(pkg: PackageManifest) {
  const { build, mjs, target = 'es2018', dts, external = [] } = pkg

  if (build === false)
    return []
  const format: Format[] = []

  if (mjs !== false) {
    format.push('es')
  }

  const baseConfig: UserConfig = {
    target,
    dts,
    platform: 'browser',
    deps: {
      neverBundle: [...externals, ...(external || [])],
    },
  }

  const configs: UserConfig[] = []

  const functionNames = ['index']

  const entry = {}

  functionNames.forEach((name) => {
    const entryObj = {
      [name]: name === 'index' ? 'index.ts' : `${name}.ts`,
    }
    Object.assign(entry, entryObj)
  })

  configs.push({
    ...baseConfig,
    entry,
    format,
    plugins: [StaleGuardRecorder()],
    attw: {
      level: 'error',
      profile: 'esm-only',
      ignoreRules: ['cjs-resolves-to-esm'],
    },
  })

  return configs
}
