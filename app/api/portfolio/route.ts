import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const [projectsRes, achievementsRes, skillsRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('skills').select('*'),
    ]);

    if (projectsRes.error || achievementsRes.error || skillsRes.error) {
      throw new Error('Failed to fetch from Supabase');
    }

    return NextResponse.json({
      projects: projectsRes.data || [],
      achievements: achievementsRes.data || [],
      skills: skillsRes.data || [],
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, item } = body;

    let result;

    if (type === 'project') {
      result = await supabaseAdmin
        .from('projects')
        .insert([item])
        .select();
    } else if (type === 'achievement') {
      result = await supabaseAdmin
        .from('achievements')
        .insert([item])
        .select();
    } else if (type === 'skill') {
      result = await supabaseAdmin
        .from('skills')
        .insert([item])
        .select();
    }

    if (result?.error) {
      throw result.error;
    }

    // Fetch all data to return
    const [projectsRes, achievementsRes, skillsRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('skills').select('*'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsRes.data || [],
        achievements: achievementsRes.data || [],
        skills: skillsRes.data || [],
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, item } = body;

    let result;

    if (type === 'project') {
      result = await supabaseAdmin
        .from('projects')
        .update(item)
        .eq('id', id)
        .select();
    } else if (type === 'achievement') {
      result = await supabaseAdmin
        .from('achievements')
        .update(item)
        .eq('id', id)
        .select();
    } else if (type === 'skill') {
      result = await supabaseAdmin
        .from('skills')
        .update(item)
        .eq('id', id)
        .select();
    }

    if (result?.error) {
      throw result.error;
    }

    // Fetch all data to return
    const [projectsRes, achievementsRes, skillsRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('skills').select('*'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsRes.data || [],
        achievements: achievementsRes.data || [],
        skills: skillsRes.data || [],
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = parseInt(searchParams.get('id') || '0');

    let result;

    if (type === 'project') {
      result = await supabaseAdmin.from('projects').delete().eq('id', id);
    } else if (type === 'achievement') {
      result = await supabaseAdmin.from('achievements').delete().eq('id', id);
    } else if (type === 'skill') {
      result = await supabaseAdmin.from('skills').delete().eq('id', id);
    }

    if (result?.error) {
      throw result.error;
    }

    // Fetch all data to return
    const [projectsRes, achievementsRes, skillsRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('skills').select('*'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsRes.data || [],
        achievements: achievementsRes.data || [],
        skills: skillsRes.data || [],
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
