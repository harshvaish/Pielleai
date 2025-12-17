# Eagle Booking

A comprehensive event booking and management platform for coordinating artists and venues. Built for internal use by Eagle Booking managers to streamline the entire event lifecycle from artist availability through event confirmation and execution.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Database Architecture](#database-architecture)
- [User Roles & Permissions](#user-roles--permissions)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Scripts](#scripts)

## About

Eagle Booking is an internal administrative platform designed to manage the complete event booking workflow between artists and venues. The system handles artist profiles, venue management, availability tracking, event proposals, confirmations, and comprehensive event logistics including costs, technical requirements, and post-event management.

### Key Capabilities

- **Multi-role Access Control:** Admins, artist managers, and venue managers with granular permissions
- **Artist Management:** Complete artist profiles with social media metrics, billing information, and availability calendars
- **Venue Management:** Venue profiles with capacity, type classification, and billing details
- **Event Lifecycle:** Full event workflow from proposal through pre-confirmation, confirmation, and completion
- **Calendar System:** Interactive calendar views with conflict detection and availability management
- **Financial Tracking:** Comprehensive cost tracking including deposits, booking percentages, and expense management
- **Notes System:** Context-aware notes for artists, venues, events, and user profiles

## Features

### 🎭 Artist Management

- Create and manage artist profiles with personal, billing, and social media data
- Track artist availability with start/end dates and status management
- Link artists to their managers for relationship tracking
- Social media metrics tracking (TikTok, Instagram, Facebook, X)
- Geographic zone assignments for touring preferences
- Language capabilities tracking
- Avatar and profile image management
- Stage name and biographical information
- Tour manager contact details

### 🏛️ Venue Management

- Comprehensive venue profiles with capacity and type classification (small, medium, big)
- Billing and tax information management
- Geographic location and contact details
- Social media presence tracking
- Link venues to promoters/managers
- Status management (active, waiting approval, disabled, banned)

### 📅 Event Management

- Event creation with artist-venue pairing
- Availability-based booking system with conflict detection
- Event status workflow: proposed → pre-confirmed → confirmed → rejected/ended
- Comprehensive financial tracking:
  - MO costs and venue manager costs
  - Deposit management with invoice tracking
  - Booking percentages and artist net costs
  - Transportation and hotel/restaurant expenses
  - Cash balance calculations
- Technical requirements:
  - Sound check scheduling
  - Technical rider document upload
  - Evening contact information
- Event checklist tracking:
  - Contract signing
  - Deposit invoice issuing and verification
  - Tech sheet submission
  - Artist and professional engagement
  - Performance completion
  - Post-date feedback
  - Bordereau processing
- Notes system for event-specific communication

### 📆 Calendar Views

- Interactive monthly and weekly calendar views
- Color-coded event status visualization
- Conflict detection and highlighting
- Filter by artist, venue, status, date range, and manager
- Export functionality for event data

### 👥 User Management

- User authentication with email verification (Better Auth)
- Email OTP verification for secure account access
- Password reset functionality via email
- Role-based access control (user, artist-manager, venue-manager, admin)
- User status management (active, waiting-for-approval, disabled, banned)
- Profile completion workflow
- Avatar upload and management
- Multi-language support
- Comprehensive billing information

### 🔍 Search & Filtering

- Full-text search across artists, venues, and managers
- Advanced filtering by multiple criteria
- Trigram-based fuzzy search for flexible matching
- Real-time search suggestions

### 📝 Notes System

- Context-aware notes for artists, venues, events, and user profiles
- Timestamped entries with writer attribution
- Cascading deletion for data integrity

### 🌐 Internationalization

- Multi-language support for users and artists
- Country and subdivision management
- EU/non-EU country classification
- Timezone-aware date handling (UTC storage, Europe/Rome business logic)

## Tech Stack

### Core Framework

- **Next.js 15.5.3** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework

### Database & ORM

- **PostgreSQL** - Primary database (hosted on Supabase)
- **Drizzle ORM 0.43.1** - Type-safe database toolkit
- **Drizzle Kit 0.31.1** - Database migrations and management

### Authentication & Authorization

- **Better Auth 1.2.10** - Modern authentication solution
- **Email OTP** - Two-factor authentication via email
- **Role-based Access Control** - Admin plugin with custom roles

### UI Components

- **Radix UI** - Accessible component primitives
  - Dialog, Dropdown Menu, Popover, Select, Tabs, Accordion, Avatar, Checkbox, Radio Group
- **Lucide React 0.511.0** - Icon library
- **Sonner 2.0.3** - Toast notifications
- **Vaul 1.1.2** - Drawer component
- **React Big Calendar 1.19.2** - Event calendar views

### Form Management

- **React Hook Form 7.58.1** - Form state management
- **Zod 3.25.23** - Schema validation
- **@hookform/resolvers 5.1.1** - Form validation integration

### Data Fetching & State

- **SWR 2.3.3** - Data fetching and caching
- **Axios 1.12.2** - HTTP client

### Date & Time

- **date-fns 4.1.0** - Date manipulation
- **date-fns-tz 3.2.0** - Timezone support
- **React Day Picker 9.7.0** - Date picker component

### File Handling

- **Browser Image Compression 2.0.2** - Client-side image optimization
- **File Saver 2.0.5** - File downloads
- **PapaParse 5.5.3** - CSV parsing and generation

### Email

- **SendGrid Mail 8.1.5** - Transactional email service

### Development Tools

- **ESLint 9** - Code linting
- **Turbopack** - Fast bundler for development
- **TSX 4.19.4** - TypeScript execution

## Prerequisites

- **Node.js** 20.x or higher
- **npm** (comes with Node.js)
- **PostgreSQL** database (Supabase account)
- **Supabase project** with required extensions:
  - `btree_gist` - Advanced constraint and exclusion indexes
  - `pg_trgm` - Trigram-based text search
- **SendGrid account** for email functionality

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd milano-ovest-admin
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory with the required environment variables (see [Environment Variables](#environment-variables) section).

4. **Set up the database**

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

5. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
milano-ovest-admin/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── (private)/            # Protected auth routes
│   │   ├── accedi/               # Login page
│   │   ├── registrati/           # Registration page
│   │   ├── conferma-email/       # Email confirmation
│   │   ├── recupera-password/    # Password recovery
│   │   └── reset-password/       # Password reset
│   ├── (private)/                # Protected application routes
│   │   ├── _components/          # Shared private components
│   │   ├── artisti/              # Artists management
│   │   ├── calendario/           # Calendar view
│   │   ├── dashboard/            # Admin dashboard
│   │   ├── eventi/               # Events management
│   │   ├── locali/               # Venues management
│   │   ├── manager-artisti/      # Artist managers
│   │   ├── promoter-locali/      # Venue managers
│   │   └── profilo/              # User profile
│   ├── _components/              # Shared components
│   ├── api/                      # API routes
│   │   ├── artist-availabilities/
│   │   ├── artist-managers/
│   │   ├── auth/
│   │   ├── country-subdivisions/
│   │   ├── events/
│   │   ├── search/
│   │   └── upload/
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   └── ui/                       # Shadcn UI components
├── lib/                          # Core utilities and logic
│   ├── auth.ts                   # Better Auth configuration
│   ├── auth-client.ts            # Client-side auth
│   ├── cache/                    # SWR cache configurations
│   ├── classes/                  # Custom classes (AppError)
│   ├── constants.ts              # Application constants
│   ├── data/                     # Data fetching functions
│   │   ├── artists/
│   │   ├── events/
│   │   ├── venues/
│   │   ├── artist-managers/
│   │   ├── venue-managers/
│   │   ├── auth/
│   │   ├── notes/
│   │   └── profiles/
│   ├── database/                 # Database configuration
│   │   ├── connection.ts         # Drizzle connection
│   │   ├── schema.ts             # Database schema
│   │   ├── relations.ts          # Table relations
│   │   └── tstz-range.ts         # Timestamp range utilities
│   ├── hooks/                    # Custom React hooks
│   ├── permissions.ts            # Role-based permissions
│   ├── server-actions/           # Server actions
│   │   ├── artists/
│   │   ├── events/
│   │   ├── venues/
│   │   ├── artist-managers/
│   │   ├── venue-managers/
│   │   ├── auth/
│   │   ├── notes/
│   │   └── users/
│   ├── supabase-server-client.ts # Supabase client
│   ├── types.ts                  # TypeScript types
│   ├── utils.ts                  # Utility functions
│   └── validation/               # Zod schemas
│       ├── artist-form-schema.ts
│       ├── event-form-schema.ts
│       ├── venue-form-schema.ts
│       ├── artist-manager-form-schema.ts
│       ├── venue-manager-form-schema.ts
│       ├── auth/
│       └── filters/
├── drizzle/                      # Database migrations
├── public/                       # Static assets
│   ├── images/
│   └── favicon/
├── middleware.ts                 # Next.js middleware (auth)
├── drizzle.config.ts            # Drizzle configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript configuration
```

## Database Architecture

### Database Hosting

The application uses **PostgreSQL** hosted on **Supabase** with direct database connection (bypassing Row-Level Security for full administrative access).

### Core Tables

- **users** - Authentication and base user information
- **profiles** - Extended user profile data for managers
- **artists** - Complete artist profiles and metadata
- **venues** - Venue information and specifications
- **events** - Event bookings and management
- **artist_availabilities** - Artist availability time windows
- **artist_notes / event_notes / profile_notes** - Context-specific notes
- **manager_artists** - Artist-to-manager relationships
- **artist_zones** - Artist geographic preferences
- **artist_languages / profile_languages** - Language capabilities
- **countries / subdivisions** - Geographic data
- **languages** - Supported languages
- **zones** - Geographic zones
- **mo_coordinators** - Milano Ovest coordinators

### Key Database Features

#### Enums

- `user_roles`: user, artist-manager, venue-manager, admin
- `user_status`: active, waiting-for-approval, disabled, banned
- `event_status`: proposed, pre-confirmed, confirmed, rejected, ended
- `availability_status`: available, booked, expired
- `venue_types`: small, medium, big
- `profile_genders`: male, female, non-binary

#### Advanced Features

- **TSTZRANGE columns** - Timestamp with timezone ranges for availability management
- **GiST indexes** - For range-based queries and conflict detection
- **Trigram indexes** - For fuzzy text search (pg_trgm extension)
- **Unique constraints** - One confirmed event per availability
- **Check constraints** - Data validation at database level

#### Timezone Handling

- All dates/timestamps are stored in **UTC**
- Business logic operates in **Europe/Rome** timezone
- Frontend converts user input to UTC before sending to backend
- Backend stores and queries exclusively in UTC
- Frontend converts UTC responses to business timezone for display

#### Automated Maintenance

A **cron job** runs on Supabase at **midnight UTC** daily to handle expiration dates on events and availabilities (`handle_availabilities_and_events_ends`).

## User Roles & Permissions

The application implements role-based access control with four user roles:

### Admin

- Full system access
- User approval and management
- Create/read/update/delete all entities
- Access to dashboard with pending approvals
- Can manage all artists, venues, and events

### Artist Manager

- Manage assigned artists
- Create and manage artist availabilities
- View and create event proposals for their artists
- Update own profile
- Limited to own managed entities

### Venue Manager

- Manage assigned venues
- View and respond to event proposals for their venues
- Update own profile
- Limited to own managed entities

### User (Default)

- Read-only access
- Must be upgraded to artist-manager or venue-manager by admin
- Awaits approval after registration

### Permission System

Built with Better Auth's admin plugin and custom access control:

```typescript
- user: ['read']
- admin: ['create', 'read', 'update', 'delete', 'update:own', 'delete:own']
- artist-manager: ['create', 'read', 'update:own', 'delete:own']
- venue-manager: ['create', 'read', 'update:own', 'delete:own']
```

## Development

### Getting Started

```bash
# Install dependencies
npm install

# Run development server with Turbopack
npm run dev

# Open http://localhost:3000
```

### Database Management

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Pull schema from existing database
npm run db:pull

# Push schema directly to database (development only)
npm run db:push
```

### Code Quality

```bash
# Run ESLint
npm run lint
```

### Project Conventions

- **Date/Time**: All database dates in UTC, business logic in Europe/Rome timezone
- **Authentication**: Better Auth with email verification and OTP
- **Forms**: React Hook Form + Zod validation
- **API**: Next.js API routes and Server Actions
- **Styling**: Tailwind CSS with custom design system
- **Components**: Shadcn with custom styling

## Environment Variables

Create a `.env.local` file with the following variables:

### Database

```bash
DATABASE_URL=                     # PostgreSQL connection string
```

### Authentication

```bash
BETTER_AUTH_SECRET=               # Auth encryption secret
BETTER_AUTH_URL=                  # Application URL
BETTER_AUTH_COOKIE_PREFIX=        # Cookie prefix for auth
```

### Supabase

```bash
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=        # Supabase service role key
```

### Email (SendGrid)

```bash
SENDGRID_API_KEY=                 # SendGrid API key
SENDGRID_FROM_EMAIL=              # Sender email address
```

### File Storage

```bash
NEXT_PUBLIC_STORAGE_BUCKET=       # Supabase storage bucket name
```

## Deployment

The application is deployed to **Vercel** with two environments:

### Staging

- Automatic deployment from staging branch
- Uses staging environment variables
- Staging database

### Production

- Automatic deployment from main branch
- Uses production environment variables
- Production database

### Deployment Requirements

- All environment variables must be configured in Vercel
- Database migrations should be run before deployment
- Ensure Supabase cron job is configured for automated maintenance

### Build Command

```bash
npm run build
```

### Start Command

```bash
npm start
```

## Scripts

| Script                | Description                             |
| --------------------- | --------------------------------------- |
| `npm run dev`         | Start development server with Turbopack |
| `npm run build`       | Build production bundle                 |
| `npm start`           | Start production server                 |
| `npm run lint`        | Run ESLint code linting                 |
| `npm run db:generate` | Generate Drizzle migration files        |
| `npm run db:migrate`  | Apply database migrations               |
| `npm run db:pull`     | Pull schema from database               |
| `npm run db:push`     | Push schema to database                 |

---

**Eagle Booking** - Internal event management platform  
Built with Next.js, TypeScript, and PostgreSQL  
© 2025 Eagle Booking. All rights reserved.
