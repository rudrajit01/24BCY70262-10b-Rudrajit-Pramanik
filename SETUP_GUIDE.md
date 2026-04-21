# Next.js 16 Fullstack Auth & Posts Application

A production-grade full-stack application built with Next.js 16 (App Router), featuring secure HTTP-only cookie authentication, RESTful APIs, business logic services, and a comprehensive MongoDB database schema.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: MongoDB (via mongoose)
- **State Management**: Zustand
- **Authentication**: JWT (jose), HTTP-only Cookies, Password Hashing (argon2)
- **API & Forms**: axios, react-hook-form, zod
- **UI Components**: lucide-react, sonner (notifications)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/ (register, login, logout routes)
│   │   └── posts/ (CRUD operations + comments)
│   ├── layout.tsx & page routes
│   ├── login/ & register/ (auth pages)
│   ├── my-posts/ (user's posts)
│   └── posts/[id]/ (single post view)
├── components/ (UI components)
├── lib/ (utilities: db, jwt, api-utils)
├── models/ (Mongoose schemas)
├── services/ (business logic)
└── store/ (Zustand auth store)
```

## Quick Start

1. **Install dependencies**: `pnpm install`
2. **Configure `.env.local`** with MongoDB URI and JWT_SECRET
3. **Run dev server**: `pnpm run dev`
4. **Open**: http://localhost:3000

## Features

✅ User Registration & Login with HTTP-only Cookies
✅ Create, Read, Delete Posts
✅ Comment on Posts
✅ View All Posts or Personal Posts
✅ Pagination Support
✅ Real-time Notifications
✅ Responsive Design
✅ Type-safe with TypeScript

## API Endpoints

**Auth**: POST /api/auth/{register,login,logout}
**Posts**: GET/POST /api/posts, GET /api/posts/mine, DELETE /api/posts/[id]
**Comments**: GET/POST /api/posts/[id]/comments

## Best Practices

- Separated business logic (services/)
- Centralized API utilities
- Type-safe with TypeScript
- Input validation with Zod
- Secure password hashing with Argon2
- JWT authentication with HTTP-only cookies
- Component-based UI with shadcn/ui
- Zustand for state management

## Environment Setup

```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
```

## Running the Application

```bash
# Development
pnpm run dev

# Build
pnpm run build

# Production
pnpm run start
```

Enjoy building your Fullstack application!
