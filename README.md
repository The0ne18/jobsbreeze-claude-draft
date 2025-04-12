# ContractorFlow

A modern, mobile-first web application for contractors to streamline their business operations.

## Features

- 📱 Mobile-first design for on-the-go management
- 📝 Create and manage estimates and invoices
- 👥 Client management system
- 📊 Dashboard with business insights
- 🔐 Secure authentication and data storage

## Tech Stack

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Turbopack for fast development
- Modern authentication
- Database (to be determined based on requirements)

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
