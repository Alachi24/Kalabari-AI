import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Handle cookie setting
            }
          },
        },
      }
    );

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - please sign in' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const dataType = formData.get('dataType') as string;
    const languagePairs = formData.get('languagePairs') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['text/csv', 'application/json', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload CSV, JSON, or TXT.' },
        { status: 400 }
      );
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();

    // Store contribution metadata in Supabase
    const { data, error } = await supabase
      .from('dataset_contributions')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_size: file.size,
        data_type: dataType,
        language_pairs: languagePairs,
        status: 'pending_review',
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('[v0] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save contribution' },
        { status: 500 }
      );
    }

    console.log('[v0] Dataset contribution received:', {
      userId: user.id,
      fileName: file.name,
      fileSize: file.size,
      dataType,
      languagePairs,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Dataset uploaded successfully',
        contributionId: data?.[0]?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}
