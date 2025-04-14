# Project State Documentation

Last Updated: [Current Date]

## Project Overview

JobsBreeze is a modern invoicing and client management application built with Next.js, TypeScript, and Supabase. The application provides features for managing clients, invoices, and business settings with a focus on user experience and type safety.

## Technical Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **API Client**: Axios with custom wrapper

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Protected dashboard pages
├── components/
│   ├── features/          # Feature-specific components
│   └── ui/               # Reusable UI components
├── contexts/              # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   └── api/             # API client and related utilities
├── services/            # Service layer for API interactions
└── types/              # TypeScript type definitions
```

## Core Features

### Authentication
- Implemented login and registration flows
- Protected routes with middleware
- Remember me functionality
- Error handling and validation
- Redirect handling after authentication

### Client Management
- CRUD operations for clients
- Search functionality
- Loading states per client
- Error handling with retry options
- Integration with invoices

### Business Settings
- Business information management
- Data persistence with Supabase
- Form validation with Zod
- Error handling and success notifications

## Recent Implementations

### Phase 3: API and Error Handling
- Created base API client with error handling
- Implemented request/response interceptors
- Added service layer for better abstraction
- Enhanced error handling across components
- Added loading states and retry mechanisms

### Type System
- Client interface with string IDs
- Form data validation with Zod
- API error types
- Response type handling

## Current State

### Completed Features
- Authentication system
- Client management
- Basic invoice management
- Business settings
- API abstraction layer
- Error handling

### In Progress
- Enhanced invoice management
- PDF generation
- Email notifications
- Data export functionality

### Known Issues
- Type mismatches between API and frontend in some areas
- Need for more comprehensive error handling in some components
- Some components need loading state improvements

## Next Steps

1. Complete invoice management features
2. Implement PDF generation for invoices
3. Add email notification system
4. Enhance data export functionality
5. Improve error handling and loading states
6. Add comprehensive test coverage

## Development Guidelines

### Code Organization
- Feature-based component organization
- Separation of concerns between components and hooks
- Type-first development approach
- Service layer for API interactions

### Type Safety
- Use TypeScript strict mode
- Zod schemas for runtime validation
- Proper type definitions for all APIs
- No any types unless absolutely necessary

### State Management
- Use React Query for server state
- Local state with useState/useReducer
- Context for global state
- Proper loading and error states

### Error Handling
- Consistent error types
- User-friendly error messages
- Proper error boundaries
- Retry mechanisms where appropriate

## Environment Setup

Required environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_api_url
```

## Additional Resources

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [README.md](./README.md) for basic setup instructions
- TypeScript configuration in `tsconfig.json`
- ESLint configuration in `eslint.config.mjs`

## Notes

This documentation will be updated as the project evolves. Please refer to the git history and issue tracker for more detailed information about specific changes and upcoming features. 