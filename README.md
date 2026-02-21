# FurnishVista

A premium web-based furniture visualization application that empowers designers to create stunning 2D room layouts and immersive 3D visualizations. Built as coursework for **PUSL3122: HCI, Computer Graphics & Visualisation**.

## Features

- **Drag & Drop Layout** - Place and arrange furniture on a 2D canvas with snap-to-grid precision
- **3D Visualization** - Switch to a realistic 3D view with lighting, shadows, and orbit controls
- **Colour & Shading** - Customise colours and shading per item or globally
- **Furniture Catalog** - Browse chairs, tables, shelves, lamps, and decorative items
- **Room Customisation** - Configure room dimensions, wall colours, floor types, and ceiling finishes
- **Save & Manage** - Save designs, duplicate, or revisit from the dashboard
- **Keyboard Shortcuts** - Undo, redo, rotate, delete, and more from the keyboard
- **Dark & Light Mode** - Seamless theme switching with system preference detection
- **Onboarding Tour** - Guided walkthrough for first-time users
- **Responsive Design** - Works across desktop and laptop screen sizes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS v4 (OKLCH colour system) |
| 3D Rendering | React Three Fiber + drei |
| State Management | Zustand |
| Animations | Framer Motion |
| Icons | Lucide React |
| Notifications | Sonner |
| Theme | next-themes |
| Fonts | Inter (body) + Sora (headings) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd furnish-vista

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
  app/
    (auth)/          # Login, Signup, Forgot Password
    (dashboard)/     # Dashboard, Designs, Rooms, Settings
    (editor)/        # Room Editor (2D canvas + 3D viewport)
    page.tsx         # Landing page
  components/
    auth/            # Authentication forms
    dashboard/       # Dashboard widgets (Stats, Quick Actions, Recent Designs)
    designs/         # Design cards, grid, actions
    editor/          # Canvas2D, Viewport3D, Toolbar, Palette, Properties
    layout/          # Sidebar, Header, ThemeToggle, UserNav
    shared/          # AuthGuard, ConfirmDialog, EmptyState, Loading, Onboarding
    ui/              # shadcn/ui base components
  hooks/             # useKeyboardShortcuts, useMediaQuery
  lib/               # Constants, mock data, utilities
  services/          # Mock API service layer (auth, design, furniture, room)
  stores/            # Zustand stores (auth, editor, design, UI)
  types/             # TypeScript type definitions
  config/            # Theme configuration
```

## Pages

| Route | Description |
|-------|------------|
| `/` | Landing page with hero, features, and CTA |
| `/login` | User login |
| `/signup` | Account creation with password strength meter |
| `/forgot-password` | Password reset flow |
| `/dashboard` | Overview with stats, quick actions, recent designs |
| `/designs` | Design grid with search, sort, and filter |
| `/designs/[id]` | Design detail with room preview and furniture list |
| `/rooms` | Room templates and existing rooms from designs |
| `/settings` | Profile, appearance, notifications, keyboard shortcuts |
| `/editor/[id]` | Full room editor with 2D/3D views |

## Editor Features

- **2D Canvas**: Top-down room view with grid overlay, dimension labels, pointer-based drag
- **3D Viewport**: Perspective camera with orbit controls, environment lighting, contact shadows
- **Furniture Models**: Category-specific 3D geometry (chair, table, storage, lamp, decor)
- **Properties Panel**: Position, rotation (0-359), scale (25-300%), shading (0-100%), colour picker
- **Room Settings**: Dimensions, shape, floor type, wall/floor/ceiling colours
- **History**: Undo/redo with 50-entry buffer
- **11 Keyboard Shortcuts**: Including Ctrl+Z/Y, R (rotate), Delete, G (grid), +/- (zoom)

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation throughout the application
- Semantic HTML (`<dl>` for shortcuts, `role="meter"` for strength indicators)
- `aria-pressed` states on toggle buttons
- `role="status"` for dynamic notifications
- Focus-visible ring styling
- Screen reader text for icon-only elements

## Mock Data

The application uses a mock service layer that simulates API responses with configurable delays. This allows the frontend to be developed independently and easily connected to a real REST API backend later.

- **User**: Sarah Mitchell (designer)
- **Furniture**: 12 items across 5 categories
- **Designs**: 3 pre-built room designs
- **Room Templates**: 4 configurable room templates

## Deployment

The application is configured for deployment on [Vercel](https://vercel.com):

```bash
npm run build
```

No additional configuration is needed - Next.js deploys out of the box on Vercel.

## Module Information

- **Module**: PUSL3122 - HCI, Computer Graphics & Visualisation
- **Type**: Individual Coursework (Frontend)
- **Backend**: To be built separately with Java/REST API
