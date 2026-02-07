# Supabase Setup Guide

This guide will help you set up Supabase authentication and database for the LinguaAI translation app.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Fill in the project details:
   - Name: `LinguaAI` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose the region closest to your users
4. Wait for the project to be created (this may take a few minutes)

## 2. Get Your API Keys

1. Go to Project Settings → API
2. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon (public) key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Set Environment Variables

Add these to your project's environment variables (in Vercel or `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Run Database Migrations

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `/scripts/setup-database.sql`
5. Click "Run" to execute the migrations

This will create:
- `profiles` table - Extended user profile information
- `translation_history` table - Stores all user translations
- `saved_translations` table - Bookmarked translations
- Row Level Security (RLS) policies - Ensures users can only access their own data
- Indexes and triggers for performance and data consistency

## 5. Enable Email Authentication

1. Go to Authentication → Providers
2. Make sure "Email" provider is enabled (it should be by default)
3. Configure email templates if desired (optional)

## 6. Test Authentication

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/auth/signup`
3. Create a test account
4. You should be redirected to login
5. Sign in with your test account
6. You should be able to access the dashboard at `/dashboard`

## Database Schema Overview

### Profiles Table
- `id` (UUID) - References auth.users
- `email` (TEXT) - User's email
- `full_name` (TEXT) - User's full name
- `avatar_url` (TEXT) - Profile avatar URL
- `created_at` (TIMESTAMP) - Account creation date
- `updated_at` (TIMESTAMP) - Last profile update

### Translation History Table
- `id` (UUID) - Translation record ID
- `user_id` (UUID) - References auth.users
- `source_text` (TEXT) - Original text
- `translated_text` (TEXT) - Translated text
- `source_language` (VARCHAR) - Source language code (e.g., 'en')
- `target_language` (VARCHAR) - Target language code (e.g., 'es')
- `model_used` (VARCHAR) - Model used for translation
- `created_at` (TIMESTAMP) - Translation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### Saved Translations Table
- `id` (UUID) - Bookmark record ID
- `user_id` (UUID) - References auth.users
- `translation_id` (UUID) - References translation_history
- `title` (TEXT) - Custom title for the saved translation
- `created_at` (TIMESTAMP) - When saved

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Password Hashing**: Supabase handles secure password hashing
- **Session Management**: Automatic session token refresh
- **HTTPS Only**: All API calls are encrypted

## Troubleshooting

### "Missing environment variables"
Make sure you've set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your environment.

### "Authentication error when signing up"
Check that the Email provider is enabled in Supabase Authentication settings.

### "Can't access saved translations"
Verify that the database migrations have been run successfully. Check the SQL Editor to confirm tables exist.

### "CORS errors"
This is usually not an issue with Supabase's official client library. Ensure you're using the latest version.

## Next Steps

1. Customize the user profile fields if needed
2. Add email verification (optional)
3. Implement password reset functionality
4. Add OAuth providers (Google, GitHub, etc.) for social login
5. Set up email notifications for translation history
