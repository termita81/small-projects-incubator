# Expense Tracker - MVP Specification

## Purpose
Personal/household finance management 

## Tech Stack
- **Frontend**: Svelte + Vite
- **App Type**: PWA (Progressive Web App) with a view to update to hybrid mobile app using Capacitor Jsor something similar
- **Storage**: Local storage (IndexedDB or localStorage)
- **Sync**: Export/import via for device syncing; maybe later also allow some API or cloud storage sync

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
- Recurring expenses tracking: every month/fortnight/week there is phone/gym/rent to pay
- Planned expenses with ranges (e.g., "between $100-$200"): car service might cost $400-500
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
