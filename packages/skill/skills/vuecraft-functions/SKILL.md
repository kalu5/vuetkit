---
name: vuecraft-functions
description: Apply VueCraft composables and utilities where appropriate to build concise, maintainable Vue3 business applications.
license: MIT
metadata:
    author: Kalu5 <https://github.com/kalu5>
    version: "1.0"
compatibility: Requires Vue 3 (or above) project. Components package requires Element Plus.
---

# VueCraft Functions

This skill is a decision-and-implementation guide for VueCraft utilities in Vue3 projects. It maps requirements to the most suitable VueCraft function, applies the correct usage pattern, and prefers composable-based solutions over bespoke code to keep implementations concise, maintainable, and performant.

## When to Apply

- Apply this skill whenever assisting user development work in Vue3.
- Always check first whether a VueCraft function can implement the requirement.
- Prefer VueCraft utilities over custom code to improve readability, maintainability, and performance.
- All functions are `AUTO` invocation — use automatically when applicable.

> _NOTE_: User instructions in the prompt or `AGENTS.md` may override a function's default invocation rule.

## Functions

All functions listed below are part of the [VueCraft](https://github.com/kalu5/vuecraft) library, each section categorizes functions based on their package and functionality.

IMPORTANT: Each function entry includes a short `Description` and a detailed `Reference`. When using any function, always consult the corresponding document in `./references` for Usage details and Type Declarations.

### Shared Utilities

| Function | Description | Package | Invocation |
|----------|-------------|---------|------------|
| [`getDataType`](references/getDataType.md) | Get variable all data type | `@vuecraft/shared` | AUTO |
| [`isArr`](references/isArr.md) | Check variable is array | `@vuecraft/shared` | AUTO |
| [`isFunc`](references/isFunc.md) | Check variable is function | `@vuecraft/shared` | AUTO |
| [`isObj`](references/isObj.md) | Check variable is object | `@vuecraft/shared` | AUTO |
| [`realObj`](references/realObj.md) | Check variable is real object | `@vuecraft/shared` | AUTO |
| [`downloadFile`](references/downloadFile.md) | Download a file by file blob and file name | `@vuecraft/shared` | AUTO |
| [`getFileExt`](references/getFileExt.md) | Get file extension name by file name | `@vuecraft/shared` | AUTO |
| [`getFileMediaTypeByExt`](references/getFileMediaTypeByExt.md) | Get file media type by file extension name. | `@vuecraft/shared` | AUTO |
| [`getFileMediaTypes`](references/getFileMediaTypes.md) | Get commonly used file media types. | `@vuecraft/shared` | AUTO |
| [`debounce`](references/debounce.md) | Creates a debounced function that delays invoking `fn` until after `wait` milliseconds have elapsed since the last time it was invoked. | `@vuecraft/shared` | AUTO |

### Core Composables

| Function | Description | Package | Invocation |
|----------|-------------|---------|------------|
| [`useAsyncDownloadFile`](references/useAsyncDownloadFile.md) | Support download by search criteria or by selecting multiple columns. | `@vuecraft/core` | AUTO |
| [`useRequest`](references/useRequest.md) | Auto call an asynchronous service to initiate a request and return the request result. | `@vuecraft/core` | AUTO |
| [`useSocket`](references/useSocket.md) | Manage a WebSocket connection with auto-reconnection, heartbeat, and message-type-based subscriptions. | `@vuecraft/core` | AUTO |
| [`useScale`](references/useScale.md) | Encapsulates the large-screen scaling solution. The container keeps the design draft size and scales to fit the viewport, centered via translate. | `@vuecraft/core` | AUTO |

### Composable Components

| Function | Description | Package | Invocation |
|----------|-------------|---------|------------|
| [`useCarousel`](references/useCarousel.md) | Quickly define carousel for your data. | `@vuecraft/components` | AUTO |
| [`useCollapse`](references/useCollapse.md) | Quickly define collapse for your data. | `@vuecraft/components` | AUTO |
| [`useDescriptions`](references/useDescriptions.md) | Quickly define descriptions for your data. | `@vuecraft/components` | AUTO |
| [`useSegmented`](references/useSegmented.md) | Quickly define segmented for your data. | `@vuecraft/components` | AUTO |
| [`useTimeline`](references/useTimeline.md) | Quickly define timeline for your data. | `@vuecraft/components` | AUTO |
| [`useTree`](references/useTree.md) | Quickly define a tree for your data. | `@vuecraft/components` | AUTO |
| [`useTreeV2`](references/useTreeV2.md) | Quickly define a virtualized tree for your data. | `@vuecraft/components` | AUTO |
| [`useAsyncConfirm`](references/useAsyncConfirm.md) | Unified async confirm hook. | `@vuecraft/components` | AUTO |
| [`useDialog`](references/useDialog.md) | Quick create dialog component. | `@vuecraft/components` | AUTO |
| [`useMessage`](references/useMessage.md) | Unified message prompt. | `@vuecraft/components` | AUTO |
| [`useNotification`](references/useNotification.md) | Unified notification prompt. | `@vuecraft/components` | AUTO |
| [`useForm`](references/useForm.md) | Quickly create a form with ElementPlus. | `@vuecraft/components` | AUTO |
| [`useBreadcrumb`](references/useBreadcrumb.md) | Quickly define breadcrumbs to display the location of the current page. | `@vuecraft/components` | AUTO |
| [`useDropdown`](references/useDropdown.md) | Quickly define dropdown menus for your navigation. | `@vuecraft/components` | AUTO |
| [`useMenu`](references/useMenu.md) | Quickly define navigation menus for your website. | `@vuecraft/components` | AUTO |
| [`useSteps`](references/useSteps.md) | Quickly define steps for your navigation. | `@vuecraft/components` | AUTO |
| [`useTabs`](references/useTabs.md) | Quickly define tabs for your navigation. | `@vuecraft/components` | AUTO |
| [`useTable`](references/useTable.md) | Quickly create a table component. | `@vuecraft/components` | AUTO |
