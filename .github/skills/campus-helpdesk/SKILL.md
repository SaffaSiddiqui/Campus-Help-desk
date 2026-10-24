---
name: campus-helpdesk
description: Guidelines and best practices for developing, maintaining, and extending the Campus Helpdesk React application, including issue submission validation, 3-stage status workflows, statistics management, responsive UI design, and build verification.
---

# Campus Helpdesk Development & Maintenance Skill

This skill provides step-by-step guidance for writing code, validating forms, updating operational statuses, managing analytics, and verifying builds within the **Campus Helpdesk** codebase.

---

## 1. Project Architecture & Stack Overview

- **Core Stack**: React 19, TypeScript (`verbatimModuleSyntax: true`), Vite, and vanilla CSS with design tokens.
- **State & Storage**: Client-side `localStorage` (`campus_helpdesk_tickets_v1`) with seed data fallback.
- **Directory Structure**:
  - `src/types/ticket.ts`: Strict TypeScript interfaces for tickets, statuses, priorities, categories, and statistics.
  - `src/services/ticketStorage.ts`: Persistence layer, CRUD operations, statistics computation, and CSV export.
  - `src/components/`: Modular React components (`IssueForm`, `AdminDashboard`, `StudentTracker`, `TicketTable`, `TicketCard`, `TicketDetailModal`, `StatsCards`, `Navbar`, `Toast`, `Icons`).
  - `src/styles/helpdesk.css`: Centralized CSS variables, typography, layout, animations, and media queries.

---

## 2. Writing Clean, Reusable React Components

Follow these architectural rules when creating or updating components:

1. **Strict TypeScript & Type-Only Imports**:
   - Always import types using the `import type { ... }` syntax to satisfy `"verbatimModuleSyntax": true`.
   - Explicitly type component props using `interface` or `type`.
   - Never use `any`; use defined union types (e.g. `TicketStatus`, `TicketPriority`, `TicketCategory`).

2. **React 19 Hooks Best Practices**:
   - **Avoid Synchronous `setState` in Effects**: Do not use `useEffect` solely to sync props or load initial localStorage data. Use lazy state initializers:
     ```tsx
     // Correct
     const [tickets, setTickets] = useState<Ticket[]>(() => ticketStorage.getTickets());
     ```
   - **Derive State with `useMemo`**: Derive dependent statistics automatically from the source list:
     ```tsx
     // Correct
     const stats = useMemo(() => ticketStorage.getStats(tickets), [tickets]);
     ```
   - **Reset Component State with `key`**: Instead of adding an effect to sync an edit modal or form when the selected item changes, pass `key={selectedTicket?.id || 'none'}` to remount the component cleanly.

3. **No Unused Code (`noUnusedLocals` / `noUnusedParameters`)**:
   - Every imported symbol, variable, and parameter must be utilized. Remove unused imports before committing.

4. **Zero-Dependency SVG Icons**:
   - Store and reuse icons in `src/components/Icons.tsx`.
   - Maintain uniform sizing props (`size?: number`, `className?: string`) and forward SVG attributes.

---

## 3. Creating Responsive and Accessible UI

1. **Design Tokens & Variables (`src/styles/helpdesk.css`)**:
   - Use CSS custom properties for all branding, statuses, backgrounds, and borders:
     - Pending: `--status-pending` (`#b45309`), `--status-pending-bg` (`#fef3c7`)
     - In Progress: `--status-inprogress` (`#1d4ed8`), `--status-inprogress-bg` (`#dbeafe`)
     - Resolved: `--status-resolved` (`#047857`), `--status-resolved-bg` (`#d1fae5`)
     - Urgent: `--priority-urgent` (`#b91c1c`), `--priority-urgent-bg` (`#fee2e2`)

2. **Responsive Layouts**:
   - **Desktop**: Support multi-column tables, KPI metrics grids, and full-width side-by-side filters.
   - **Mobile & Tablet (`<= 768px`)**:
     - Collapse the navigation bar into a hamburger drawer.
     - Switch tables to mobile cards (`TicketCard.tsx`) or enable horizontal touch-scrolling.
     - Stack grid layouts (`.form-grid-3`, `.form-grid-2`, `.modal-meta-grid`) to single column.

3. **Accessibility (a11y)**:
   - Provide proper `aria-label` on icon-only buttons (e.g., modal close buttons, search clear, delete buttons).
   - Use `role="dialog"` and `aria-modal="true"` for overlay modals.
   - Listen to `Escape` key events to dismiss modals.
   - Use semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<table>`, `<button>`).
   - Ensure high contrast for text over badge backgrounds.

---

## 4. Validating Student Issue Form

When modifying or expanding the issue submission form (`src/components/IssueForm.tsx`):

1. **Validation Rules**:
   - **Title**: Required, trimmed length $\ge 5$ characters.
   - **Description**: Required, trimmed length $\ge 15$ characters to ensure adequate diagnostic detail.
   - **Location**: Required (must specify campus building and room/area).
   - **Reporter Name**: Required.
   - **Campus Email**: Required, validated against standard email pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
   - **Student / Staff ID**: Required (e.g., `STU-#####` or `STF-#####`).
   - **Category**: Must match one of the defined `TicketCategory` values.
   - **Priority**: Must match one of the defined `TicketPriority` values (`Low`, `Medium`, `High`, `Urgent`).

2. **Attachment Handling**:
   - Restrict file upload to valid image types or PDFs.
   - Validate client-side file size (limit $\le 2\text{ MB}$).
   - Read file with `FileReader.readAsDataURL` and preview attachments cleanly.

3. **User Feedback & Reference Generation**:
   - Display `.input-error` borders and `.error-text` beneath invalid fields.
   - Upon successful submission, display the confirmation view with a unique copyable Ticket Reference ID (e.g., `TKT-2026-XXXX`).
   - Include a "Track Status" action and a "Submit Another Issue" reset trigger.

---

## 5. Managing `Pending`, `In Progress`, and `Resolved` Statuses

The helpdesk workflow enforces strict lifecycle progression:

1. **Status Definitions**:
   - **`Pending`**: New ticket created. Awaiting administrative triage and technician assignment.
   - **`In Progress`**: Dispatched to a technician or support lead. Active troubleshooting in progress.
   - **`Resolved`**: Work completed, verified by staff, with documented resolution remarks.

2. **Audit Logging & Timeline Preservation**:
   - Never mutate ticket history without recording an audit event.
   - When a status transition occurs, append a new `TicketTimelineEntry`:
     ```ts
     {
       id: `TL-${Date.now()}`,
       timestamp: new Date().toISOString(),
       status: newStatus,
       action: `Status changed to ${newStatus}`,
       performedBy: actorName,
       note: remarks || undefined
     }
     ```
   - When transitioning to **`Resolved`**, record `resolvedAt` timestamp and prompt for `resolutionNotes`.

3. **Status Controls**:
   - Provide an inline dropdown in both `TicketTable.tsx` and `TicketCard.tsx` for quick triaging.
   - Provide rich status selection buttons inside `TicketDetailModal.tsx` for comprehensive management.

---

## 6. Keeping Dashboard Statistics Accurate

1. **Single Source of Truth**:
   - All statistics must derive directly from the current list of tickets (`Ticket[]`).
   - Avoid maintaining desynchronized manual counters.

2. **Core Metrics to Calculate (`ticketStorage.getStats`)**:
   - `total`: Total number of active tickets.
   - `pending`: Tickets where `status === 'Pending'`.
   - `inProgress`: Tickets where `status === 'In Progress'`.
   - `resolved`: Tickets where `status === 'Resolved'`.
   - `urgent`: Tickets where `priority === 'Urgent'`.
   - `resolutionRate`: Computed as $\text{round}\left(\frac{\text{resolved}}{\text{total}} \times 100\right)$ (or $0$ if $\text{total} = 0$).
   - `byCategory`: Distribution count per department/category.
   - `byPriority`: Distribution count per priority level.

3. **Immediate Updates**:
   - Whenever a ticket is created, updated, or deleted, recalculate statistics immediately to ensure KPI cards and progress bars reflect the latest data.

---

## 7. Testing Changes & Build Verification

Before concluding any development task or PR:

1. **Verify Static Types & Build**:
   ```bash
   npm run build
   ```
   - Must run `tsc -b && vite build` and exit with code `0`.
   - Inspect build output for TypeScript errors or bundle size warnings.

2. **Run Linter**:
   ```bash
   npm run lint
   ```
   - Must execute `eslint .` without errors or warnings.
   - Confirm all React hook dependencies and rules (`react-hooks/set-state-in-effect`, `react-hooks/exhaustive-deps`) pass.

3. **Test Local Development Server**:
   ```bash
   npm run dev
   ```
   - Confirm Vite starts without configuration issues.

---

## 8. Reporting Errors Honestly

1. **Transparency**:
   - If `npm run build` or `npm run lint` fails, report the exact error code, offending file name, and line number directly.
   - Never pretend a command passed or hide warnings.

2. **Root Cause Analysis**:
   - State the cause clearly (e.g., unused variable in TypeScript, missing hook dependency, invalid CSS token, or broken import path).
   - Apply the targeted fix, rerun the verification command, and confirm the resolution.

