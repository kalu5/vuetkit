---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "VueCraft"
  text: "为 Vue3 项目提供的业务开发工具集合"
  tagline: "收集开发中常用的组合式工具函数、通用工具函数和组合式组件。"
  image: "/images/logo-tech.svg"
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/get-started
    - theme: alt
      text: 工具函数
      link: /zh/core/index
    - theme: alt
      text: 通用工具
      link: /zh/shared/index
    - theme: alt
      text: 组合式组件
      link: /zh/components/index

features:
  - icon: 🚀
    title: 组合式工具函数
    details: 收集常用的组合式工具函数。例如 useRequest、useAsyncDownloadFile 等。
  - icon: 🛠️
    title: 通用工具函数
    details: 收集常用的通用工具函数。例如 downloadFile、getDataType 等。
  - icon: 🎛
    title: 组合式组件
    details: 收集常用的组合式组件。例如 useForm、useAsyncConfirm 等。
---
