export interface PackageManifest {
  name: string
  display: string
  addon?: boolean
  author?: string
  description?: string
  external?: string[]
  globals?: Record<string, string>
  manualImport?: boolean
  deprecated?: boolean
  submodules?: boolean
  build?: boolean
  iife?: boolean
  mjs?: boolean
  dts?: boolean
  target?: string
  utils?: boolean
  copy?: string[]
  entry?: string
}

export const packages: PackageManifest[] = [
  {
    name: 'core',
    display: 'Hooks',
    description: 'Collection of essential Vue Utilities',
  },
  {
    name: 'shared',
    display: 'Utils',
  },

  {
    name: 'components',
    display: 'Components',
    description: 'Collection of Vue Components',
  },
]
