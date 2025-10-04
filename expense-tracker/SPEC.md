# Expense Tracker - MVP Specification

## Purpose
Personal/household finance management for 1-3 people with shared view (everyone sees the same data).

## Tech Stack
- **Frontend**: Svelte + Vite
- **App Type**: PWA (Progressive Web App)
- **Storage**: Local storage (IndexedDB or localStorage)
- **Sync**: Export/import for device syncing

## Core Features (MVP)
- Add income/expense transactions
- Multi-category tagging per transaction
- View recent transactions
- Basic summary/totals
- Export/import data

## UI Design
- Minimal, clean design
- Fast to load, simple to write, easy on the eye
- **Landing page components**:
  - Quick "Add" button (prominent)
  - Recent transactions list
  - Summary/totals display

## Future Features (Post-MVP)
- Recurring expenses tracking
- Planned expenses with ranges (e.g., "between $100-$200")
- Spending analytics:
  - Category breakdowns
  - Monthly splits
  - Charts/visualizations
- Cloud sync between devices

## Data Model (Draft)

### Transaction
- ID (unique)
- Type (income/expense)
- Amount
- Categories (array - multiple tags)
- Description/note
- Date
- Timestamp

### Categories
- Customizable
- Multiple categories per transaction
- Suggested defaults: Groceries, Utilities, Entertainment, Transport, Healthcare, etc.
