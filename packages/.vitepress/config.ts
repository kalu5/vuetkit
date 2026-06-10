import fs from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vitepress'
import { packages } from '../../meta/packages'

interface SidebarItem {
  link: string
  text: string
  items?: SidebarItem[]
}

interface SidebarRoute {
  [key: string]: SidebarItem[]
}

const guideItems = [
  { text: 'Get Started', link: '/guide/get-started' },
  { text: 'Work with AI', link: '/guide/ai' },
]

const packagesSidebar = packages.map((pkg) => {
  const curItems = generateCategoryItems(pkg.name)
  return {
    text: pkg.display,
    items: curItems,
    path: `/${pkg.name}`,
  }
})

function generateCategoryItems(pkg: string) {
  const categorys = fs.readdirSync(join(__dirname, `../${pkg}/src`))
  return categorys.map((category) => {
    const categoryItems = fs.readdirSync(join(__dirname, `../${pkg}/src/${category}`))
    return {
      text: category,
      link: `/${pkg}/src/${category}`,
      items: categoryItems.filter(child => !['index.md', 'index.ts'].includes(child)).map(child => ({
        text: child,
        link: `/${pkg}/src/${category}/${child}`,
      })),
    }
  })
}

const defaultPageSidebar = packagesSidebar.map(pkg => ({
  text: pkg.text,
  items: pkg.items?.map(item => ({
    text: item.text,
    link: item.link,
  })),
}))

const defaultSidebar = [
  {
    text: 'Guide',
    items: guideItems,
  },
  ...defaultPageSidebar,
]

const sidebarRoutes = packagesSidebar.reduce((acc: SidebarRoute, cur) => {
  acc[cur.path] = cur.items
  return acc
}, {})

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'library-template',
  lang: 'en',
  base: '/library-template/',
  head: [['link', { rel: 'icon', href: '/library-template/images/logo-small.png' }]],
  description: 'utils library',
  themeConfig: {
    logo: '/library-template/images/logo-small.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: 'library', link: '/' }],

    sidebar: {
      '/guide': defaultSidebar,
      ...sidebarRoutes,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kalu5/library' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-PRESENT Kalu5 and library contributors',
    },
  },
  rewrites: {
    ':pkg/README.md': ':pkg/index.md',
  },
})
