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

<!-- FUNCTIONS_TABLE_PLACEHOLDER -->
