# react-technical-proof

A small React technical proof: a persisted list manager where users can add, select, and delete items through a modal dialog.

## Overview

The app renders a single page with a list of strings. Items are created via an "ADD" modal, toggled for selection, and removed either individually (double-click a label) or in bulk using the "DELETE" button. A reset button removes the most recently added item. The list is persisted to `localStorage`, so entries survive a page reload.

## Features

- Add items through a native `<dialog>` modal (with validation and keyboard/backdrop dismissal)
- Select items and delete all selected items
- Delete a single item by double-clicking it
- Reset (pop) the last added item
- State persisted across reloads via Zustand's `persist` middleware
- Adaptive UI built with CSS Modules and design tokens

## Tech stack

- **React 19** with **TypeScript**
- **Vite** for dev server and builds (React Compiler enabled via Babel)
- **Zustand** for state management with `localStorage` persistence
- **Vitest** + **Testing Library** with `jsdom` for unit/component tests
- **ESLint** for linting

## Project structure

```
src/
├── components/
│   ├── App/             # Root layout component
│   ├── Button/          # Reusable primary/secondary button
│   ├── Input/           # Labelled text input
│   ├── Modal/           # Native dialog wrapper for adding items
│   ├── SelectableList/  # Checkbox list with double-click delete
│   └── pages/
│       └── StringList/  # Main page composing the list and actions
├── store/
│   └── useItemsStore/   # Zustand store (items + selection)
├── styles/              # Reset, fonts, design tokens, typography
├── assets/              # Fonts and icons
├── test/                # Test setup
└── main.tsx             # App entry point
```

## Getting started

Requires Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

The dev server opens automatically at `http://localhost:5173`.

## Scripts

| Command        | Description                         |
| -------------- | ----------------------------------- |
| `pnpm dev`     | Start the Vite dev server           |
| `pnpm build`   | Type-check and build for production |
| `pnpm preview` | Preview the production build        |
| `pnpm test`    | Run the Vitest test suite           |
| `pnpm lint`    | Run ESLint                          |
