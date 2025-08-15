# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a Laravel application using:

- **Backend**: Laravel 12 with PHP 8.2+, using SQLite database
- **Frontend**: React 19 with TypeScript, Inertia.js for SPA experience
- **UI**: Tailwind CSS 4, Radix UI components, shadcn/ui pattern
- **Testing**: Pest for PHP tests
- **Build**: Vite for frontend bundling with SSR support

## Key Structure

- `app/` - Laravel application code (Controllers, Models, Middleware)
- `resources/js/` - React TypeScript frontend
  - `components/` - Reusable UI components including `ui/` shadcn components
  - `pages/` - Inertia.js page components
  - `layouts/` - Layout components for auth, app, settings
  - `hooks/` - Custom React hooks
- `routes/` - Laravel route definitions (web.php, auth.php, settings.php)
- `tests/` - Pest test files organized by Feature and Unit

## Development Commands

**Start development server:**
```bash
composer dev
```
This runs Laravel server, queue worker, Pail logs, and Vite dev server concurrently.

**For SSR development:**
```bash
composer dev:ssr
```

**Frontend commands:**
```bash
npm run dev          # Vite dev server
npm run build        # Production build
npm run build:ssr    # Build with SSR
npm run lint         # ESLint with auto-fix
npm run format       # Prettier formatting
npm run types        # TypeScript type checking
```

**Testing:**
```bash
composer test        # Run Pest tests
php artisan test     # Alternative test command
```

**Code quality:**
```bash
./vendor/bin/pint    # Laravel Pint (PHP formatter)
npm run lint         # ESLint for TypeScript/React
npm run format:check # Check Prettier formatting
```

## Key Files

- `composer.json` - Contains useful dev scripts including the `dev` concurrently setup
- `vite.config.ts` - Vite configuration with Laravel plugin and SSR
- `inertiajs/inertia-laravel` - Handles React/Laravel integration
- `tightenco/ziggy` - Route generation for frontend (aliased as 'ziggy-js')

## Component Patterns

- Uses shadcn/ui component library in `resources/js/components/ui/`
- Custom hooks for appearance/theme management and responsive behavior
- Layout system with separate auth, app, and settings layouts
- Icon system using Lucide React
