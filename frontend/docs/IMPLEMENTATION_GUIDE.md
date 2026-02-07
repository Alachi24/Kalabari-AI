# LinguaAI Implementation Guide

Complete guide to setting up and running LinguaAI with local Hugging Face models and Supabase authentication.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Supabase Configuration](#supabase-configuration)
3. [Local ML Models](#local-ml-models)
4. [Authentication Setup](#authentication-setup)
5. [Testing the App](#testing-the-app)
6. [Troubleshooting](#troubleshooting)

---

## Initial Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <repo-url>
cd linguaai

# Install dependencies
npm install

# Install Transformers.js for local ML
npm install @xenova/transformers
```

### Step 2: Environment Variables

Create `.env.local` in the root directory:

```env
# Required: Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: For debugging
DEBUG=linguaai:*
```

Get your Supabase credentials from your project settings in the dashboard.

---

## Supabase Configuration

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization and project settings
4. Wait for the project to initialize (2-3 minutes)

### Step 2: Set Up Authentication

1. In your Supabase dashboard, go to **Authentication > Providers**
2. Ensure **Email** provider is enabled (it's on by default)
3. Go to **URL Configuration**
4. Set **Site URL** to `http://localhost:3000` (for development)
5. Add redirect URLs for your production domain

### Step 3: Create Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy all SQL from `/scripts/setup-database.sql`
3. Create a new query and paste the SQL
4. Click "Run"

This creates:
- `profiles` - User profile information
- `translation_history` - All user translations
- Row-Level Security (RLS) policies for data protection

### Step 4: Enable Row-Level Security

The database migration script automatically enables RLS. Verify:

1. Go to **Authentication > Policies** in Supabase
2. You should see policies for `translation_history` table
3. Ensure `Enable RLS` is toggled ON

---

## Local ML Models

### How It Works

**DistilBERT** (Language Detection):
- Runs zero-shot classification on input text
- Detects language with high accuracy
- Models cached locally for speed

**Opus-MT** (Translation):
- Helsinki-NLP models for 100+ language pairs
- ~150-300MB per model
- Caches on first use, instant on subsequent uses

### First Run Performance

**Expected behavior:**
1. First translation request: 30-60 seconds (model downloads)
2. Subsequent requests: <1 second

**To speed up:**
- Pre-load models by translating a test phrase on app startup
- Use a faster internet connection for initial download

### Supported Language Pairs

Current support includes:
- English ↔ Spanish
- English ↔ French
- English ↔ German
- English ↔ Portuguese
- English ↔ Italian
- English ↔ Japanese
- English ↔ Chinese

Add more by updating `/lib/ml/local-inference.ts` `modelMap`.

---

## Authentication Setup

### User Registration Flow

1. User navigates to `/auth/signup`
2. Fills in email and password
3. Supabase creates user account
4. User is automatically logged in
5. Redirected to `/dashboard`

### User Login Flow

1. User navigates to `/auth/login`
2. Enters email and password
3. Supabase authenticates user
4. Session is stored in browser
5. Redirected to `/dashboard`

### Protected Routes

Dashboard (`/dashboard`) is protected:
- Middleware checks for valid session
- Unauthenticated users redirected to `/auth/login`
- Session persists across browser refreshes

### Logout

Logout is available on the dashboard:
- Clears Supabase session
- Redirects to home page
- User must log in again to access dashboard

---

## Testing the App

### Test Scenario 1: Complete User Flow

```
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create account: test@example.com / password123
4. See dashboard with empty history
5. Go back home (click logo)
6. Enter: "Hello, how are you?"
7. Select target language: Spanish
8. Click "Translate"
   → Wait 30-60 seconds on first translation
   → Should see: "Hola, ¿cómo estás?"
9. Click "Save" to save to history
10. Go to dashboard - should see translation in history
```

### Test Scenario 2: Language Detection

```
1. On home page, clear source text
2. Type: "Bonjour, comment allez-vous?"
3. Wait 500ms
4. Language selector should change to "French"
5. Select "English" as target
6. Click "Translate"
7. Should see English translation
```

### Test Scenario 3: Multiple Languages

```
1. Test these translations:
   - English → Spanish
   - English → French
   - English → German
2. Verify each works correctly
3. Check dashboard for all saved translations
```

---

## Troubleshooting

### Models Not Loading

**Problem**: "Failed to initialize transformers.js"

**Solution**:
1. Check browser console (F12 → Console tab)
2. Verify CORS headers are correct
3. Models download from Hugging Face CDN
4. Ensure internet connection is stable
5. Try clearing browser cache and reloading

### Translation Timeout

**Problem**: Translation takes >2 minutes

**Solution**:
1. This is normal for first request
2. Restart the development server
3. Try a shorter text snippet
4. Check available RAM (needs ~4GB)

### Authentication Not Working

**Problem**: Can't sign up or login

**Solution**:
1. Verify Supabase credentials in `.env.local`
2. Check Supabase dashboard is accessible
3. Verify auth provider is enabled
4. Check browser console for errors
5. Try incognito/private window to clear cache

### Database Errors

**Problem**: Translation save fails

**Solution**:
1. Verify database migration ran successfully
2. Check Row-Level Security is enabled
3. Verify user is authenticated
4. Check Supabase logs for SQL errors

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Run linter
npm run lint
```

---

## Next Steps

1. **Customize**: Update branding and colors
2. **Add Languages**: Support more language pairs in `/lib/ml/local-inference.ts`
3. **Deploy**: Push to Vercel with your Supabase credentials
4. **Feedback**: Test with real users and gather feedback

---

## Support

For issues with:
- **Supabase**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Local ML**: See [LOCAL_ML_SETUP.md](./LOCAL_ML_SETUP.md)
- **General Setup**: See [SETUP.md](./SETUP.md)
