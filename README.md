# Hivon Blog Platform

A premium, AI-powered blogging platform built for Hivon Automations. This system features automated 200-word summaries using Google Gemini, robust role-based access control, and a Figma-inspired monochrome design.

## 🚀 Tech Stack
- **Frontend**: Next.js 14/15 (App Router)
- **Styling**: Vanilla CSS (Figma Design System)
- **Database/Auth**: Supabase
- **AI Engine**: Google Gemini 1.5 Flash
- **Deployment**: Vercel

## 🛠️ Features
- **AI Summarization**: Every post automatically generates and stores a ~200-word summary on creation.
- **RBAC (Role Based Access Control)**:
  - **Viewer**: Read posts, view AI summaries, leave comments.
  - **Author**: Create/Edit own posts, monitor discussion.
  - **Admin**: Full authority to edit any post or moderate content.
- **Search & Pagination**: High-performance post discovery.
- **Modern UI**: Strictly monochrome chrome with vibrant hero accents and variable typography.

## 📦 Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Blog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_AI_API_KEY=your_gemini_api_key
   ```

4. **Database Setup:**
   Run the SQL schema provided in `.gsd/templates/schema.sql` within your Supabase SQL Editor to create the necessary tables and RLS policies.

5. **Run locally:**
   ```bash
   npm run dev
   ```

## 🏗️ Architectural Decisions

### AI Summary Strategy
We utilize **Gemini 1.5 Flash** for summarization due to its high speed and accuracy. Summaries are generated **once** during post creation/update and stored in the database. This optimizes cost by avoiding redundant API calls during feed browsing.

### Database Design
The schema utilizes Supabase's built-in Auth system extended by a `profiles` table. Row Level Security (RLS) is strictly enforced at the database layer to ensure Authors cannot modify others' work and Viewers remain read-only.

### Design System
Inspired by Figma's interface, we used a strictly monochrome chrome (#000000, #ffffff) to ensure that the content remains the hero. Typography uses **Inter** with negative tracking for a professional tool-like aesthetic.

## 🌐 Deployment
This project is optimized for **Vercel**. Ensure all environment variables are added to the Vercel project settings before deploying.
