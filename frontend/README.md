# LinguaAI - AI-Powered Language Translation App

A modern, full-featured language translation application built with Next.js, Supabase, and local Hugging Face models running with Transformers.js. Everything runs locally—no API keys needed!

## Features

- **Local AI Translation**: Uses Helsinki-NLP/Opus-MT models running locally via Transformers.js for offline translation
- **Local Language Detection**: DistilBERT-based language detection running entirely on your machine
- **User Authentication**: Secure sign-up and sign-in with Supabase Auth
- **Translation History**: Save and manage all your translations in Supabase
- **User Dashboard**: View translation statistics and recent translations
- **Copy & Save**: Quickly copy translations to clipboard or save for later reference
- **Protected Routes**: Middleware-based route protection for authenticated features
- **Offline-First**: Models cache locally—subsequent translations are instant

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL with Row-Level Security
- **ML/AI**: Transformers.js + Hugging Face (DistilBERT, Opus-MT) - runs locally
- **State Management**: React Hooks

## Project Structure

```
linguaai/
├── app/
│   ├── api/
│   │   ├── translate-local/           # Local translation (Opus-MT)
│   │   ├── detect-language-local/     # Local language detection (DistilBERT)
│   │   └── translations/
│   │       ├── save/                  # Save translation to Supabase
│   │       ├── history/               # Fetch translation history
│   │       └── delete/[id]/           # Delete translation
│   ├── auth/
│   │   ├── signup/                    # User registration with Supabase
│   │   ├── login/                     # User sign in with Supabase
│   │   └── layout.tsx
│   ├── dashboard/                     # User dashboard (protected)
│   ├── layout.tsx                     # Root layout
│   ├── globals.css                    # Global styles
│   └── page.tsx                       # Home page
├── components/
│   ├── header.tsx                     # Navigation header
│   ├── hero.tsx                       # Translation interface
│   ├── features.tsx                   # Feature showcase
│   ├── footer.tsx                     # Footer
│   └── ui/                            # shadcn/ui components
├── lib/
│   ├── ml/
│   │   └── local-inference.ts         # Transformers.js ML inference
│   ├── supabase/
│   │   ├── client.ts                  # Client-side Supabase
│   │   ├── server.ts                  # Server-side Supabase
│   │   └── middleware.ts              # Auth middleware
│   ├── actions/
│   │   └── auth.ts                    # Server actions for auth
│   ├── language-detection.ts          # Language detection logic
│   ├── types/
│   │   └── auth.ts                    # TypeScript types
│   └── utils.ts                       # Utility functions
├── scripts/
│   └── setup-database.sql             # Database migrations
├── docs/
│   ├── SUPABASE_SETUP.md             # Supabase configuration
│   ├── LOCAL_ML_SETUP.md             # Local Transformers.js models
│   └── SETUP.md                       # General setup
├── proxy.ts                           # Next.js proxy middleware (Next 16)
├── middleware.ts                      # Auth middleware configuration
├── package.json
├── next.config.mjs
└── tsconfig.json
```

## Quick Start

### 1. Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)
- No API keys needed for translations (runs locally!)

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase (required for auth and translation history)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
# Install Transformers.js for local ML models
npm install @xenova/transformers
```

### 4. Setup Supabase Database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the contents of `/scripts/setup-database.sql`
4. Paste and run it in the SQL Editor
5. This creates all required tables with Row-Level Security

See [SUPABASE_SETUP.md](/docs/SUPABASE_SETUP.md) for detailed instructions.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Features Explained

### Authentication Flow

1. **Sign Up**: Users create an account with email and password
2. **Sign In**: Users authenticate with Supabase Auth
3. **Protected Routes**: Middleware redirects unauthenticated users to login
4. **Session Management**: Automatic token refresh via Supabase client

### Translation Pipeline

1. **Input**: User enters text in the translation interface
2. **Language Detection**: System detects source language (auto or manual selection)
3. **Translation**: Sends to Helsinki-NLP/Opus-MT via Hugging Face API
4. **Save**: User can save translation to their history in Supabase
5. **History**: Dashboard displays all saved translations with timestamps

### Database Schema

**Profiles Table**
- Stores extended user information beyond auth.users
- One record per authenticated user
- RLS: Users can only view/edit their own profile

**Translation History Table**
- Stores all user translations
- Includes source/target text, languages, and timestamp
- RLS: Users can only view/modify their own translations

**Saved Translations Table**
- Bookmarks for frequently accessed translations
- Links to translation_history records
- RLS: Users can only manage their own bookmarks

All tables have Row-Level Security (RLS) enabled to ensure data privacy.

## API Endpoints

### Translation
- `POST /api/translate` - Translate text using Helsinki-NLP model
- `POST /api/detect-language` - Detect language of input text

### User Data
- `POST /api/translations/save` - Save translation to history (requires auth)
- `GET /api/translations/history` - Fetch user's translation history (requires auth)
- `DELETE /api/translations/delete/[id]` - Delete a translation (requires auth)

All endpoints require valid authentication except the translation endpoint (which can use optional API keys).

## Configuration Options

### Supported Languages

The app supports 100+ language pairs through Helsinki-NLP models. Language codes follow ISO 639-1 standard (e.g., 'en' for English, 'es' for Spanish).

### Translation Models

- **Primary**: Helsinki-NLP/Opus-MT (high accuracy, fast)
- **Fallback**: Language-specific fine-tuned models when available

## Security Features

- **Row-Level Security (RLS)**: Database-level access control
- **Secure Authentication**: Supabase handles password hashing and session management
- **HTTPS Only**: All API calls encrypted in transit
- **Environment Variables**: Sensitive keys not exposed in code
- **Server Actions**: Auth operations executed on server only

## Troubleshooting

### Authentication Issues
- Ensure Supabase environment variables are set correctly
- Check that Email provider is enabled in Supabase Authentication settings
- Clear browser cookies and try again

### Translation Failures
- Verify Hugging Face API key is valid (if configured)
- Check that language codes are valid ISO 639-1 codes
- Ensure text input is not empty or excessively long

### Database Connection
- Confirm Supabase project is active and not paused
- Verify Row-Level Security policies are correctly configured
- Check PostgreSQL logs in Supabase dashboard

### Middleware/Protected Routes
- Ensure proxy.ts (or middleware.ts for older Next.js) is configured
- Clear Next.js cache: `rm -rf .next`
- Restart development server

## Performance Optimization

- **Language Detection**: Debounced at 500ms to reduce API calls
- **Database Indexes**: Created on frequently queried columns
- **Translation Caching**: Implement Redis cache for repeated queries (future)
- **Image Optimization**: Next.js Image component used for all images
- **Code Splitting**: Dynamic imports for heavy components

## Future Enhancements

1. **Document Translation**: Support PDF, DOCX, and other file formats
2. **Real-time Collaboration**: Multiple users translating together
3. **Translation Memory**: Store common phrase translations for reuse
4. **Advanced Filters**: Search and filter translation history
5. **Export Features**: Download translations as PDF or DOCX
6. **Offline Mode**: Cache recent translations for offline access
7. **Custom Models**: Fine-tune models for domain-specific translations
8. **Team Features**: Shared translation projects and workflows

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel Settings
4. Deploy automatically on push

### Deploy to Other Platforms

The app can be deployed to any Node.js-compatible platform. Ensure:
- Environment variables are configured
- Database migrations are run
- Build output is optimized with `npm run build`

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check [SUPABASE_SETUP.md](/docs/SUPABASE_SETUP.md) for configuration help
2. Review [DISTILBERT_SETUP.md](/docs/DISTILBERT_SETUP.md) for AI model setup
3. Open an issue on GitHub with detailed information

## Acknowledgments

- Helsinki-NLP for the Opus-MT translation models
- Supabase for serverless database and auth
- Vercel for Next.js framework
- Hugging Face for the inference API
- shadcn/ui for beautiful components
