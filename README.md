# Life OS

A personal note-taking application built with Next.js, featuring a rich WYSIWYG editor powered by Lexical.

## Features

- **Rich Text Editor**: WYSIWYG editor built with Lexical supporting:
  - Text formatting (bold, italic)
  - Floating toolbar that appears on text selection
  - Clean, borderless design
- **Note Persistence**: Server-side note saving with PostgreSQL database
- **Notes List**: Minimalist sidebar showing saved notes as:
  - Thin grey lines (30px) that expand on hover (50px)
  - Date tooltips showing creation/update time
  - Fixed positioning on the left side
- **Modern UI**: Clean beige-themed interface with centered layout
- **Real-time Editing**: Instant text formatting with visual feedback

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Editor**: Lexical (Meta's rich text editor framework)
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Code Quality**: Biome for linting and formatting

## Database Schema

### Notes Table
- `id` - Auto-incrementing primary key
- `content` - Text content of the note
- `createdAt` - Timestamp when note was created
- `updatedAt` - Timestamp when note was last updated
- `deletedAt` - Soft delete timestamp (nullable)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up database**:
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env` and configure your DATABASE_URL
   - Run database migrations:
   ```bash
   npm run db:push
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to start taking notes!

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Drizzle Studio
- `npm run check` - Run Biome linting
- `npm run typecheck` - Type checking

## Architecture

The application follows a clean architecture pattern:

- **Components**: Reusable UI components in `src/components/`
- **Server Actions**: Database operations in `src/app/actions.ts`
- **Database**: Schema and connection in `src/server/db/`
- **Styling**: Tailwind CSS with stone color palette

## Contributing

This project uses conventional commits for commit messages and Biome for code formatting and linting.