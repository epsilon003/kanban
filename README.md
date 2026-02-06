# Kanban Board - Multi-User Task Management Application

A production-ready Kanban board application with Google OAuth authentication, cloud database synchronization, and real-time collaboration. Built with React, TypeScript, Firebase, and Tailwind CSS.

## Features

### Authentication & User Management
- Google OAuth single sign-on
- Secure Firebase Authentication
- User profile display with photo and name
- Private, isolated boards per user
- Session management and sign out

### Cloud Database
- Real-time Firestore synchronization
- Automatic cloud backups
- Multi-device access
- Offline support
- Data persistence across sessions

### Task Management
- Drag and drop tasks between columns
- Reorder tasks within columns
- Create, edit, and delete tasks
- Priority levels: low, medium, high, urgent
- Tag management with color coding
- Due date tracking with overdue detection
- Assignee assignment with avatar display
- Work-in-progress limits with visual warnings
- Rich task descriptions

### User Experience
- Interactive onboarding tutorial for first-time users
- Dark mode with system preference detection
- Fully responsive layout (desktop, tablet, mobile)
- Keyboard navigation support
- WCAG 2.1 AA accessibility compliance
- Loading states and error handling

### Responsive Design
- Desktop: Four columns with wrapping layout
- Tablet: Two columns per row
- Mobile: Single column stack
- No horizontal scrolling required
- Touch-optimized for mobile devices

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend Framework | React | 18.2.0 |
| Type System | TypeScript | 5.3.3 |
| Backend Services | Firebase | 10.7.1 |
| Styling | Tailwind CSS | 3.4.1 |
| Build Tool | Vite | 5.0.11 |
| Drag & Drop | @dnd-kit/core | 6.1.0 |
| Drag & Drop | @dnd-kit/sortable | 8.0.0 |
| Onboarding | react-joyride | 2.7.2 |
| Date Utilities | date-fns | 3.0.6 |
| Class Management | clsx | 2.1.0 |

## Architecture

### Component Hierarchy

```
App
├── LoginPage (Authentication)
├── OnboardingTutorial (First-time user guide)
└── KanbanBoard (Main application)
    ├── KanbanColumn (Column container)
    │   ├── KanbanCard (Task card)
    │   └── TaskModal (Create/edit dialog)
    └── UI Primitives
        ├── Button
        ├── Modal
        ├── Avatar
        ├── DarkModeToggle
        └── UserMenu
```

### State Management

- `useAuth` - Authentication state and methods
- `useFirestore` - Database synchronization and operations
- `useDarkMode` - Theme preference management
- Real-time listeners for instant updates
- Optimistic UI updates for smooth interactions

### Data Flow

1. User authentication via Firebase Auth
2. Real-time data sync via Firestore listeners
3. Local state updates trigger UI re-renders
4. User actions write to Firestore
5. Firestore updates propagate to all connected clients

## Project Structure

```
kanban-board/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── LoginPage.tsx
│   │   ├── KanbanBoard/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanBoard.types.ts
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── KanbanCard.tsx
│   │   │   └── TaskModal.tsx
│   │   ├── Onboarding/
│   │   │   └── OnboardingTutorial.tsx
│   │   └── primitives/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Avatar.tsx
│   │       ├── DarkModeToggle.tsx
│   │       └── UserMenu.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFirestore.ts
│   │   └── useDarkMode.ts
│   ├── lib/
│   │   └── firebase.ts
│   ├── utils/
│   │   ├── task.utils.ts
│   │   └── column.utils.ts
│   ├── styles/
│   │   └── globals.css
│   └── main.tsx
├── .env.example
├── package.json
└── README.md
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Security

### Authentication

- OAuth handled by Firebase Authentication
- No password storage in application
- Secure session management
- Automatic token refresh

## Keyboard Navigation

- Tab: Move focus between elements
- Enter: Open task details
- Space: Begin dragging task
- Arrow Keys: Move dragged task
- Escape: Close modal or cancel drag
- Shift+Tab: Navigate backwards

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Testing

Manual testing checklist:

1. Sign in with Google account
2. Complete or skip onboarding tutorial
3. Create new task
4. Drag task between columns
5. Edit task details
6. Delete task
7. Toggle dark mode
8. Test on mobile device
9. Sign out and sign back in
10. Verify data persistence

## Contributing

Feel free to:
1. Fork the repository
2. Suggest improvements
3. Report issues
4. Share feedback
