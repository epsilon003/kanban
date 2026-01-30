# Kanban Board Component

A production-grade, fully accessible Kanban board component built with React, TypeScript, and Tailwind CSS. Features drag-and-drop task management, **dark mode toggle**, responsive design, and comprehensive keyboard navigation.

## Key Features

### Dark Mode
- **Smart toggle** - Sun/moon icon in header
- **Auto-detection** - Follows system preference
- **Persistent** - Remembers your choice
- **Fully themed** - All components support both modes

### Core Functionality
- Drag-and-drop tasks between columns
- Reorder tasks within columns
- Create, edit, and delete tasks
- Priority levels (low, medium, high, urgent)
- Tag management
- Due date tracking with overdue detection
- Assignee avatars
- WIP (Work In Progress) limits with visual warnings
- Empty state handling

### Accessibility
- WCAG 2.1 AA compliant
- Full keyboard navigation
- Screen reader support
- ARIA labels and roles
- Focus management
- High contrast colors

### Responsive Design
- Desktop: Multi-column layout
- Tablet: Horizontal scroll
- Mobile: Touch-optimized

### Storybook Documentation
- 7 comprehensive stories
- Interactive demos
- All states and variants
- Accessibility examples

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/kanban-component-yourname.git
cd kanban-component-yourname

# Install dependencies
npm install

# Run Storybook (recommended for development)
npm run storybook

# OR run the development server
npm run dev
```

## Quick Start

### View in Storybook
```bash
npm run storybook
```
Opens at `http://localhost:6006` with 7 interactive stories

### Run Development Server
```bash
npm run dev
```
Opens at `http://localhost:5173`

### Build for Production
```bash
npm run build
```
Creates optimized build in `dist/` folder 

## Architecture

### Component Structure
```
KanbanBoard (Main orchestrator)
├── KanbanColumn (Individual columns)
│   ├── KanbanCard (Draggable task cards)
│   └── TaskModal (Edit/create modal)
└── Primitives (Reusable UI)
    ├── Button
    ├── Modal
    ├── Avatar
    └── DarkModeToggle
```

### State Management
- Custom `useKanbanBoard` hook for centralized state
- `useDarkMode` hook for theme management
- Optimistic UI updates for smooth UX
- Efficient re-render optimization

### Drag-and-Drop
- Built with @dnd-kit/core (low-level primitives)
- Custom drag logic and visual feedback
- Mouse and keyboard support
- Smooth animations

### Type Safety
- TypeScript strict mode enabled
- 100% type coverage
- No `any` types
- Comprehensive interfaces

## Storybook Stories

1. **Default** - Standard board with sample tasks
2. **Empty State** - Board with no tasks
3. **With Many Tasks** - Performance test with 60+ tasks
4. **Different Priorities** - All priority levels showcased
5. **Interactive Demo** - Fully functional with all features
6. **Mobile View** - Responsive layout demonstration
7. **Accessibility Demo** - Keyboard navigation guide

## Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.2.0 | Component framework |
| TypeScript | ^5.3.3 | Type-safe development |
| Tailwind CSS | ^3.4.1 | Utility-first styling |
| Vite | ^5.0.11 | Build tooling |
| @dnd-kit/core | ^6.1.0 | Drag-and-drop primitives |
| @dnd-kit/sortable | ^8.0.0 | Sortable list utilities |
| Storybook | ^7.6.7 | Component documentation |
| date-fns | ^3.0.6 | Date manipulation |
| clsx | ^2.1.0 | Conditional classnames |

## Design System

### Color Palette
- **Primary**: Blue (#0ea5e9) - Interactive elements
- **Neutral**: Gray scale - UI structure
- **Success**: Green - Completed states
- **Warning**: Orange - Alerts
- **Error**: Red - Critical states

### Dark Mode Colors
- **Background**: neutral-50 (light) / neutral-900 (dark)
- **Cards**: white (light) / neutral-800 (dark)
- **Text**: neutral-900 (light) / neutral-100 (dark)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **Scales**: Tailwind default

### Spacing
- **Base unit**: 4px
- **Consistent scale**: Tailwind spacing

## Deployment

### Cloudflare Pages
```bash
# Push to GitHub, then:
# 1. Go to https://pages.cloudflare.com
# 2. Connect repository
# 3. Build command: npm run build
# 4. Output: dist
# 5. Deploy!
```

**Benefits:**
- Unlimited bandwidth
- Super fast global CDN
- Free SSL/HTTPS
- DDoS protection
- Free analytics

## Usage Example

```tsx
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { useKanbanBoard } from './hooks/useKanbanBoard';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  } = useKanbanBoard(initialColumns, initialTasks);

  const { isDark, toggle } = useDarkMode();

  return (
    <div className={isDark ? 'dark' : ''}>
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
}
```

## Project Structure

```
kanban-component/
├── src/
│   ├── components/
│   │   ├── KanbanBoard/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanBoard.types.ts
│   │   │   ├── KanbanBoard.stories.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── KanbanCard.tsx
│   │   │   └── TaskModal.tsx
│   │   └── primitives/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Avatar.tsx
│   │       └── DarkModeToggle.tsx
│   ├── hooks/
│   │   ├── useKanbanBoard.ts
│   │   └── useDarkMode.ts
│   ├── utils/
│   │   ├── task.utils.ts
│   │   └── column.utils.ts
│   ├── data/
│   │   └── sampleData.ts
│   └── styles/
│       └── globals.css
├── .storybook/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Keyboard Navigation

- **Tab** - Move between tasks
- **Enter** - Open task for editing
- **Space** - Pick up task for dragging
- **Arrow Keys** - Move dragged task
- **Escape** - Close modal or cancel drag
- **Shift+Tab** - Navigate backwards

## Testing

### Manual Testing
All features tested through Storybook stories.

### Test Locally
```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

## Contributing

Feel free to:
1. Fork the repository
2. Suggest improvements
3. Report issues
4. Share feedback

## Highlights

- Production-quality code
- Fully accessible (WCAG 2.1 AA)
- Dark mode support
- Comprehensive documentation
- 7 Storybook stories
- TypeScript strict mode
- Ready to deploy
- Modern React patterns

---
