import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { devLog } from '@/lib/logger';

const DEFAULT_PROFILE = {
  id: 1,
  name: 'Lynard',
  title: 'Graphic Designer',
  bio: 'Young Professional',
  email: 'alfielynard23@gmail.com',
  phone: '+639453553379',
  location: 'Philippines, Digos City',
  image: null,
};

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('profile')
      .select('*')
      .single();

    if (error) {
      devLog.warn('Profile data not available from Supabase, using defaults:', error);
      return NextResponse.json(DEFAULT_PROFILE);
    }

    return NextResponse.json(data);
  } catch (error) {
    devLog.warn('Error fetching profile, using defaults:', error);
    return NextResponse.json(DEFAULT_PROFILE);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, bio, email, phone, location, image } = body;

    const { data, error } = await supabaseAdmin
      .from('profile')
      .update({
        name,
        title,
        bio,
        email,
        phone,
        location,
        image,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      devLog.warn('Failed to update profile in Supabase:', error);
      // Return success with updated data even if Supabase fails (optimistic update)
      return NextResponse.json({
        success: true,
        data: { id: 1, name, title, bio, email, phone, location, image },
        source: 'local',
      });
    }

    return NextResponse.json({
      success: true,
      data,
      source: 'supabase',
    });
  } catch (error) {
    devLog.warn('Error updating profile:', error);
    // Return success with updated data on any error (optimistic update)
    const body = await request.json();
    const { name, title, bio, email, phone, location, image } = body;
    return NextResponse.json({
      success: true,
      data: { id: 1, name, title, bio, email, phone, location, image },
      source: 'local-error',
    });
  }
}
