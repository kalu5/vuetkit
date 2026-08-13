# Work with AI

VueTkit Skills are AI Agent Skills maintained by the VueTkit team. After installing the skill, when you use an AI Agent to assist with developing Vue3 applications, it can automatically leverage the rich feature set provided by VueTkit.

This allows the agent to accurately use VueTkit functions without requiring an internet connection or additional permissions.

## Features

- Progressive disclosure: send VueTkit function overviews first, then load detailed usage and type declarations on demand.
- Minimal token usage: provide only necessary information to reduce token consumption.
- Offline-first design: works without internet access or additional agent permissions.
- Reduced hallucinations: precise usage references help prevent invented APIs.

## Installation

### Install via skills-npm

[skills-npm](https://github.com/antfu/skills-npm) symlinks agent skills automatically when you install dependencies.

First, add a `prepare` script to your `package.json`:

```json
{
  "scripts": {
    "prepare": "skills-npm"
  }
}
```

Then, install both `skills-npm` and `@vuetkit/skill`:

::: code-group

```bash
# npm
npm install -D @vuetkit/skill skills-npm
```

```bash
# yarn
yarn add -D @vuetkit/skill skills-npm
```

```bash
# pnpm
pnpm add -D @vuetkit/skill skills-npm
```

:::

### Install via skills CLI

```bash
npx skills add kalu5/vuetkit
```

::: warning
Installing skills via the [skills](https://github.com/vercel-labs/skills) CLI may cause version mismatch between the skill and your local VueTkit version.
:::

## Example Usage

Install VueTkit in your Vue3 project, then instruct the agent. It will automatically leverage VueTkit to assist development.

Example prompt:

```
create a data table page with the following features:
- fetch data from an API with loading and error states
- support pagination
- add a confirmation dialog before deleting a row
- show toast notifications on success
```

The agent will automatically use VueTkit's `useTable`, `useRequest`, `useAsyncConfirm`, and `useMessage` to build the page.
