# Smart Bookmark App

## Overview
A production-ready bookmark manager built with Next.js 14, Supabase, and Tailwind CSS. Features Google OAuth authentication, real-time updates, and robust security via RLS.

## Features
- **Authentication**: Sign in with Google (Supabase Auth).
- **Real-time**: Bookmarks update instantly across tabs (Supabase Realtime).
- **Privacy**: Row Level Security (RLS) ensures users only see their own data.
- **UI/UX**: Responsive design with Tailwind CSS, loading states, and error handling.

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase Project

### Installation

1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Copy `.env.local.example` to `.env.local` and add your Supabase credentials:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

3.  **Supabase Setup**:
    - Go to your Supabase Dashboard -> SQL Editor.
    - Run the SQL queries found in `supabase/migrations/20240101_init.sql`.
    - Go to Authentication -> Providers -> Enable Google.
    - Add `http://localhost:3000/auth/callback` to the Redirect URLs.
    - **Important**: Enable Realtime for the `bookmarks` table:
      - Go to Database -> Replication.
      - Click the source (`supabase_realtime`) or create a new one.
      - Toggle the switch for `bookmarks`.

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Development & Troubleshooting

### Challenges & Solutions

#### 1. Realtime Subscriptions & RLS
*Problem*: Realtime updates weren't firing for standard RLS policies initially.
*Solution*: Ensured that the `bookmarks` table was added to the `supabase_realtime` publication (`alter publication supabase_realtime add table bookmarks;`) and that RLS policies allow `SELECT` for the authenticated user.

#### 2. Authentication Redirects
*Problem*: Google OAuth would sometimes redirect to the wrong URL in production.
*Solution*: Explicitly set the `redirectTo` option in `signInWithOAuth` to `${location.origin}/auth/callback` to dynamically handle both localhost and production domains.

#### 3. Middleware Static File Matching
*Problem*: Middleware was intercepting Next.js static files and API routes unnecessarily.
*Solution*: Updated variable `matcher` config in `middleware.ts` to exclude `_next/static`, `_next/image`, and common file extensions.

## Deployment
Deploy to Vercel:
1.  Import the project.
2.  Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel Environment Variables.
3.  Deploy!
