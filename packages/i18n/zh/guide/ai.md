# 与 AI 协作

VueCraft Skills 是由 VueCraft 团队维护的 AI Agent Skills。安装该 skill 后，当你使用 AI Agent 辅助开发 Vue3 应用时，它可以自动利用 VueCraft 提供的丰富功能集。

这使得 Agent 能够准确使用 VueCraft 的函数，而无需联网或获取额外权限。

## 特性

- 渐进式披露：先发送 VueCraft 函数概览，再按需加载详细用法和类型声明。
- 最小化 token 消耗：仅提供必要信息，减少 token 消耗。
- 离线优先设计：无需联网或额外 Agent 权限即可工作。
- 减少幻觉：精确的用法参考有助于防止编造 API。

## 安装

### 通过 skills-npm 安装

[skills-npm](https://github.com/antfu/skills-npm) 会在你安装依赖时自动为 agent skills 创建符号链接。

首先，在 `package.json` 中添加 `prepare` 脚本：

```json
{
  "scripts": {
    "prepare": "skills-npm"
  }
}
```

然后，同时安装 `skills-npm` 和 `@vuecraft/skill`：

::: code-group

```bash
# npm
npm install -D @vuecraft/skill skills-npm
```

```bash
# yarn
yarn add -D @vuecraft/skill skills-npm
```

```bash
# pnpm
pnpm add -D @vuecraft/skill skills-npm
```

:::

### 通过 skills CLI 安装

```bash
npx skills add kalu5/vuecraft
```

::: warning
通过 [skills](https://github.com/vercel-labs/skills) CLI 安装 skills 可能导致 skill 版本与你本地的 VueCraft 版本不一致。
:::

## 使用示例

在你的 Vue3 项目中安装 VueCraft，然后向 Agent 下达指令，它会自动利用 VueCraft 辅助开发。

示例提示词：

```
create a data table page with the following features:
- fetch data from an API with loading and error states
- support pagination
- add a confirmation dialog before deleting a row
- show toast notifications on success
```

Agent 会自动使用 VueCraft 的 `useTable`、`useRequest`、`useAsyncConfirm` 和 `useMessage` 来构建该页面。
