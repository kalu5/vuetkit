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
    display: 'Composable Utilities',
    description: 'Collection of essential Vue Utilities',
  },
  {
    name: 'shared',
    display: 'Shared Utilities',
  },

  {
    name: 'components',
    display: 'Composable Components',
    description: 'Collection of Vue Composable Components',
  },
]
