# Copilot Instructions - Pitch (React + Vite)

## Project Overview

**Pitch** is a React-based sports pitch reservation application built with Vite. It features a two-column layout: a vertical sidebar for navigation and a main content area displaying games/reservations.

## Architecture & Key Patterns

### Component Structure

- **Sidebar** ([src/components/sidebar/sidebar.jsx](src/components/sidebar/sidebar.jsx)): Navigation with icon-based menu (uses emojis and SVG icons)
- **GamesScreen** ([src/components/games/games.jsx](src/components/games/games.jsx)): Main content area showing game listings and reservation interface
- **App** ([src/App.jsx](src/App.jsx)): Root component orchestrating Sidebar + main content layout

**Pattern**: Functional components with default exports. No useState/hooks yet - currently static UI with inline `onclick` handlers (legacy approach).

### Styling Approach

- **CSS Variables** ([src/App.css](src/App.css#L8-L13)): Dark theme with green accent (`--accent: #c8f25a`). Root defines palette: `--bg`, `--surface`, `--accent`, `--text`, `--red`, `--green`, `--gold`, etc.
- **Component CSS**: Each component has sibling `.css` file (e.g., `sidebar.css`, `games.css`)
- **Responsive Design**: Mobile navigation hidden on desktop; different selectors for `.sidebar`, `.mobile-nav`, `.topbar`

### Critical Architectural Decision

Components use **inline `onclick` handlers** (string-based like `onclick="showScreen('games')"`) rather than React event handlers. This is a transitional state - **when modernizing**, migrate to React `onClick` with event handlers and state management.

## Development Workflow

### Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Build for production (outputs to dist/)
npm run lint     # Run ESLint (flat config with React Hooks & Refresh plugins)
npm run preview  # Preview production build locally
```

### Build & Deployment

- **Vite Configuration** ([vite.config.js](vite.config.js)): Uses `@vitejs/plugin-react` for Fast Refresh
- **Entry Point**: [index.html](index.html) → [src/main.jsx](src/main.jsx) → [src/App.jsx](src/App.jsx)
- **Output**: Builds to `dist/` directory (gitignored)

## Code Conventions & ESLint Rules

- **Unused Variables**: Allowed if they start with uppercase or underscore (e.g., `_prop`, `CONSTANT`)
- **React Hooks**: ESLint enforces `react-hooks/rules-of-hooks` - maintain proper dependency arrays
- **Module System**: ES6 imports (`import X from 'path'`)

## Common Tasks & Integration Points

### Adding Navigation Items

1. Add icon to [Sidebar component](src/components/sidebar/sidebar.jsx)
2. Add `onclick="showScreen('screenName')"` handler
3. Create corresponding screen component in [src/components/](src/components/)
4. Update App.jsx to import and render the new screen

### Adding Game/Reservation Features

- Extend [GamesScreen component](src/components/games/games.jsx)
- Follow existing DOM structure: `.content.screen` wrapper with `.page-header`, `.month-divider`, game cards
- Use CSS classes from sibling `games.css` file

### Styling

- Reference CSS custom properties from `:root` (dark theme, predefined colors)
- Create component-scoped styles in `components/[component]/[component].css`
- Common utilities: `.btn`, `.btn-primary`, `.btn-admin` (defined in app-level CSS)

## External Dependencies

- **React 19.2.0**: Core UI library
- **React DOM 19.2.0**: DOM rendering
- **Vite 7.3.1**: Build tool and dev server
- **ESLint 9.39.1**: Code linting with React plugin ecosystem

## Known Limitations & TODO Items

- **Event Handlers**: Currently using string-based `onclick` - should migrate to React synthetic events
- **State Management**: No state management yet (React Context/Redux/Zustand) - needed as features expand
- **TypeScript**: Not configured (considered in template docs but not implemented)
