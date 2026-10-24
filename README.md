# 🏫 Campus Helpdesk - Issue Tracking & Resolution Portal

A modern, responsive, and robust **Campus Helpdesk System** built with **React 19**, **TypeScript**, and **Vite**. The portal streamlines reporting, triaging, and tracking of campus-wide facilities, IT networks, classroom technology, residential housing, and security incidents.

---

## 🚀 Key Features

### 1. 📝 Issue Submission Portal
- **Role-based Reporting**: Supports submissions from **Students**, **Faculty**, **Staff**, and **Visitors**.
- **Categorization**:
  - `IT & Wi-Fi` (routers, access points, login portal, workstation networks)
  - `Facilities & Maintenance` (plumbing, electrical, HVAC, sanitation)
  - `Classroom & Lab Equipment` (projectors, smartboards, audio systems, lab rigs)
  - `Hostel & Housing` (dormitory appliances, furniture, room climate)
  - `Library Services` (kiosks, barcode scanners, printing stations)
  - `Campus Safety & Security` (emergency callboxes, lighting, gate access)
  - `Other`
- **Priority Matrix**: `Low`, `Medium`, `High`, and `Urgent` with color-coded severity badges.
- **Attachment Support**: Integrated client-side file upload (screenshots/images/PDFs) with instant preview.
- **Instant Reference ID**: Auto-generates unique copyable reference codes (e.g. `TKT-2026-1001`).
- **Quick Test Tool**: One-click **"Fill Sample Issue"** button to rapidly test ticket submission.

---

### 2. 🔄 3-Stage Lifecycle & Status Tracking
Every ticket transitions through three distinct operational states:
1. **`Pending`** 🟡: New submission recorded, awaiting initial triage and team dispatch.
2. **`In Progress`** 🔵: Technician or departmental lead assigned; diagnostic work/repair actively underway.
3. **`Resolved`** 🟢: Issue resolved with documented resolution remarks and verified fix.

- **Immutable Audit Log**: Every status change or technician reassignment records a timestamp, actor, and remarks in the ticket's history timeline.
- **Resolution Notes**: Enforces or prompts technicians to specify resolution actions when marking tickets as resolved.

---

### 3. 📊 Admin Operations Dashboard & Statistics
- **Real-Time KPI Metric Cards**:
  - **Total Tickets** count
  - **Pending** count with visual load indicator
  - **In Progress** active workload tracker
  - **Resolved** count and calculated **Overall Resolution Rate (%)**
- **Departmental / Category Breakdown**: Visual progress bars showing distribution of issues across campus facilities.
- **Priority Distribution & SLA Monitor**: Highlights urgent tickets requiring immediate response.
- **Multi-Criteria Filtering & Search**:
  - Full-text search across Ticket ID, title, keywords, reporter name, room/building, and description.
  - Filter pills by status (`All`, `Pending`, `In Progress`, `Resolved`) with live counters.
  - Filter dropdowns by Department/Category and Priority level.
  - Sort by `Newest First`, `Oldest First`, `Highest Priority`, or `Status (Pending First)`.
- **Dual Display Modes**:
  - **Table View**: Desktop-optimized data table with inline status dropdowns for instant triage.
  - **Card View**: Touch-friendly card grid optimized for mobile and tablet screens.
- **Ticket Management Modal**:
  - Inspect full ticket details, reporter contact information, and attached images.
  - Reassign technician lead.
  - Change status with resolution notes and internal timeline remarks.
  - Safe ticket deletion with confirmation prompt.
- **Data Export & Management**:
  - **Export to CSV**: Generates a downloadable spreadsheet report of all campus tickets.
  - **Reset Demo Data**: One-click restoration of realistic campus demo records.

---

### 4. 🔍 Student Self-Service Ticket Tracker
- Search any ticket by **Ticket Reference ID** (e.g. `TKT-2026-1001`), **Student ID**, or **Campus Email**.
- Visual 3-step progress stepper:
  ```
  [ 1. Pending ] ───▶ [ 2. In Progress ] ───▶ [ 3. Resolved ]
  ```
- Displays assigned technician, location, attachment previews, resolution summary, and step-by-step timestamped activity history.
- Pre-populated quick-test chips for convenient status inspection.

---

### 5. 💾 LocalStorage Persistence
- Complete offline-first capability via the browser's `localStorage` (`campus_helpdesk_tickets_v1`).
- Initialized with realistic sample campus tickets across multiple buildings and categories upon first load.
- All modifications (submissions, inline status changes, modal updates, deletions) immediately persist.

---

### 6. 📱 Responsive Design
- Built mobile-first with CSS variables, fluid grids, and accessible contrast.
- Adapts seamlessly to smartphones, tablets, laptops, and ultra-wide campus operations displays.
- Responsive sticky navigation bar with a mobile drawer toggle.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict mode, VerbatimModuleSyntax) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Icons** | Custom accessible SVG icon components (Zero third-party overhead) |
| **Styling** | Custom responsive CSS design system with CSS custom properties |
| **Storage** | Client-side `localStorage` with automated JSON serialization & validation |

---

## 📁 Project Architecture

```
campus-helpdesk/
├── index.html                 # HTML shell with viewport and metadata
├── package.json               # Dependencies and build scripts
├── tsconfig.json              # TypeScript root configuration
├── tsconfig.app.json          # Strict TypeScript bundler settings
├── src/
│   ├── main.tsx               # Application bootstrap
│   ├── App.tsx                # State coordination, routing, and toast alerts
│   ├── index.css              # Base resets & font definitions
│   ├── types/
│   │   └── ticket.ts          # Ticket, Status, Category, Priority, Stats types
│   ├── data/
│   │   └── seedData.ts        # Realistic default campus issues & timelines
│   ├── services/
│   │   └── ticketStorage.ts   # LocalStorage CRUD, CSV export, & statistics
│   ├── components/
│   │   ├── Navbar.tsx         # Navigation header, pending pill, mobile drawer
│   │   ├── Icons.tsx          # Accessible SVG icon library
│   │   ├── IssueForm.tsx      # Multi-section submission form & validation
│   │   ├── StudentTracker.tsx # Status search & visual stepper (Pending->Resolved)
│   │   ├── StatsCards.tsx     # KPI metrics & departmental breakdown
│   │   ├── AdminDashboard.tsx # Filter controls, sort, table/card toggle, modal
│   │   ├── TicketTable.tsx    # Responsive table with inline status changer
│   │   ├── TicketCard.tsx     # Mobile card component
│   │   ├── TicketDetailModal.tsx # Full detail & edit modal with timeline logs
│   │   └── Toast.tsx          # Non-intrusive alert toast stack
│   └── styles/
│       └── helpdesk.css       # Complete design tokens, components, & media queries
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation
Clone or navigate to the repository directory:
```bash
cd campus-helpdesk
```

Install dependencies (if not already installed):
```bash
npm install
```

### Development
Start the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build
Compile TypeScript and bundle the application for production:
```bash
npm run build
```
The optimized bundle will be generated in the `dist/` directory.

### Code Quality & Linting
Run ESLint to check for code standards and hook rules:
```bash
npm run lint
```

---

## 📄 License
This project is created for university campus facilities and educational use.
#   C a m p u s - H e l p - d e s k  
 