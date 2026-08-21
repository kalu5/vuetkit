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

interface CategoryTranslations {
  [key: string]: string
}

interface PackageDisplayTranslations {
  [key: string]: string
}

interface SidebarOptions {
  localePrefix?: string
  guideText: string
  guideItems: { text: string, link: string }[]
  categoryTranslations?: CategoryTranslations
  packageDisplayTranslations?: PackageDisplayTranslations
}

const guideItemsEn = [
  { text: 'Get Started', link: '/guide/get-started' },
  { text: 'Work with AI', link: '/guide/ai' },
]

const guideItemsZh = [
  { text: '快速开始', link: '/zh/guide/get-started' },
  { text: '与 AI 协作', link: '/zh/guide/ai' },
]

const categoryTranslationsZh: CategoryTranslations = {
  data: '数据展示',
  feedback: '反馈',
  form: '表单',
  navigation: '导航',
  table: '表格',
  file: '文件处理',
  network: '网络请求',
  visualization: '数据可视化',
  dataType: '数据类型',
  function: '函数工具',
}

const packageDisplayTranslationsZh: PackageDisplayTranslations = {
  core: '组合式工具函数',
  shared: '通用工具函数',
  components: '组合式组件',
}

function generateCategoryItems(
  pkg: string,
  localePrefix = '',
  categoryTranslations?: CategoryTranslations,
): SidebarItem[] {
  const categorys = fs.readdirSync(join(__dirname, `../${pkg}/src`))
  return categorys.map((category) => {
    const categoryItems = fs.readdirSync(
      join(__dirname, `../${pkg}/src/${category}`),
    )
    return {
      text: categoryTranslations?.[category] ?? category,
      link: `${localePrefix}/${pkg}/src/${category}`,
      items: categoryItems
        .filter(child => !['index.md', 'index.ts'].includes(child))
        .map(child => ({
          text: child,
          link: `${localePrefix}/${pkg}/src/${category}/${child}`,
        })),
    }
  })
}

function generateSidebar(options: SidebarOptions) {
  const {
    localePrefix = '',
    guideText,
    guideItems,
    categoryTranslations,
    packageDisplayTranslations,
  } = options

  const packagesSidebar = packages.map((pkg) => {
    const curItems = generateCategoryItems(pkg.name, localePrefix, categoryTranslations)
    return {
      text: packageDisplayTranslations?.[pkg.name] ?? pkg.display,
      items: curItems,
      path: `${localePrefix}/${pkg.name}`,
    }
  })

  const defaultPageSidebar = packagesSidebar.map(pkg => ({
    text: pkg.text,
    items: pkg.items?.map(item => ({
      text: item.text,
      link: item.link,
    })),
  }))

  const defaultSidebar = [
    {
      text: guideText,
      items: guideItems,
    },
    ...defaultPageSidebar,
  ]

  const sidebarRoutes = packagesSidebar.reduce((acc: SidebarRoute, cur) => {
    acc[cur.path] = cur.items
    return acc
  }, {})

  return {
    [`${localePrefix}/guide`]: defaultSidebar,
    ...sidebarRoutes,
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'VueCraft',
  base: '/vuecraft/',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/vuecraft/images/logo-small.svg' }]],
  description: 'Collection of business development tools for Vue3 projects',
  srcExclude: ['skill/**'],
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        logo: '/images/logo-small.svg',
        // https://vitepress.dev/reference/default-theme-config
        nav: [],
        sidebar: generateSidebar({
          guideText: 'Guide',
          guideItems: guideItemsEn,
        }),
        socialLinks: [{ icon: 'github', link: 'https://github.com/kalu5/vuecraft' }],
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2026-PRESENT Kalu5 and VueCraft contributors',
        },
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      description: '为 Vue3 项目提供的业务开发工具集合',
      themeConfig: {
        logo: '/images/logo-small.svg',
        nav: [],
        sidebar: generateSidebar({
          localePrefix: '/zh',
          guideText: '指南',
          guideItems: guideItemsZh,
          categoryTranslations: categoryTranslationsZh,
          packageDisplayTranslations: packageDisplayTranslationsZh,
        }),
        socialLinks: [{ icon: 'github', link: 'https://github.com/kalu5/vuecraft' }],
        footer: {
          message: '基于 MIT 许可证发布。',
          copyright: '版权所有 © 2026-PRESENT Kalu5 及 VueCraft 贡献者',
        },
      },
    },
  },
  rewrites: {
    ':pkg/README.md': ':pkg/index.md',
    'i18n/zh/:rest*': 'zh/:rest*',
  },
})
