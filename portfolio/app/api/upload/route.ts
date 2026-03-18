import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth';
import {
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  INVALID_FILE_TYPE_MESSAGE,
  FILE_TOO_LARGE_MESSAGE,
} from '@/lib/constants';
import { devLog } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (!auth) {
      return unauthorizedResponse();
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string || 'portfolio-images';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: INVALID_FILE_TYPE_MESSAGE },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: FILE_TOO_LARGE_MESSAGE },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const fileBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      devLog.error('Upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      fileName,
    });
  } catch (error) {
    devLog.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
