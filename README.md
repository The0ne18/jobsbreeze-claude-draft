# ContractorFlow

A modern, mobile-first web application for contractors to streamline their business operations.

## Features

- 📱 Mobile-first design for on-the-go management
- 📝 Create and manage estimates and invoices
- 👥 Client management system
- 📊 Dashboard with business insights
- 🔐 Secure authentication and data storage

## Tech Stack

- **Frontend**:
  - Next.js 14 with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Turbopack for fast development

- **Backend**:
  - Supabase (PostgreSQL + Real-time + Auth)
  - Row Level Security (RLS) for data protection
  - Real-time subscriptions
  - Edge Functions for serverless compute

- **Authentication**:
  - Supabase Auth with JWT
  - Role-based access control
  - Secure session management

- **Database**:
  - PostgreSQL (via Supabase)
  - Real-time capabilities
  - Strong data consistency
  - Automatic backups

For detailed backend standards and practices, see:
- [Backend Standards](./src/docs/BACKEND_STANDARDS.md)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)

## Project Structure

```
src/
├── app/
│   ├── auth/        # Authentication related pages
│   └── dashboard/   # Dashboard and main application pages
├── components/
│   ├── ui/          # Reusable UI components
│   ├── forms/       # Form components
│   └── layouts/     # Layout components
├── lib/
│   ├── utils/       # Utility functions
│   ├── types/       # TypeScript types/interfaces
│   └── api/         # API related functions
├── hooks/           # Custom React hooks
└── styles/          # Global styles and Tailwind configurations
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT License

## Environment Variables

This project uses environment variables for configuration. Create a `.env.local` file in the root directory with the following variables:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Prisma database connection string | `file:./dev.db` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `your-anon-key` |

### Setting Up Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` with your actual configuration:
   - For Supabase variables, get these from your Supabase project settings
   - For database configuration, use the appropriate connection string format

3. Never commit `.env.local` to version control. It's already in `.gitignore`

### Security Notes

- Keep your environment variables secure and never share them publicly
- Use different values for development and production environments
- Regularly rotate sensitive keys and tokens
- Consider using a secrets management service for production deployments

## Setting Up the Database

This project uses Supabase as the database provider. For detailed setup instructions, see [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

### Method 1: SQL Editor (Recommended)

The most reliable way to set up the database tables is through the Supabase SQL Editor:

1. Go to [app.supabase.io](https://app.supabase.io) and log in
2. Select your project from the dashboard
3. In the left sidebar, click on "SQL Editor"
4. Click "New Query" to create a new SQL script
5. Copy the contents of `supabase/manual_setup.sql`
6. Paste into the SQL Editor and click "Run"

### Method 2: Admin API Setup

If you have the Supabase service role key (admin key), you can set up the database via API:

1. Get your service role key by running:
   ```bash
   npm run get-admin-key
   ```
   Then follow the instructions to add it to your `.env.local` file.

2. Run the setup with the admin key:
   ```bash
   npm run setup-db-with-admin
   ```

### Verifying the Setup

You can verify if your tables are correctly set up by running:

```bash
npm run verify-db
```

### Database Tables

The following tables will be created:

- `users`: Authentication and user information
- `clients`: Client contact information
- `estimates`: Estimate documents
- `line_items`: Line items for estimates
- `items`: Catalog of items

### Row Level Security (RLS)

The setup includes Row Level Security policies that ensure:
- Users can only view their own user data
- Only authenticated users can access and modify data
- Data is properly secured at the database level

### Migrations

If you need to make changes to the database schema:
1. Add your changes to `supabase/migrations/`
2. Run the setup script again or apply manually
