import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import portfolioData from '@/data/portfolio.json';
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET() {
  try {
    const [projectsRes, achievementsRes, skillsRes, languagesRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('skills').select('*'),
      supabaseAdmin.from('languages').select('*'),
    ]);

    // If Supabase fails, fallback to local JSON data
    if (projectsRes.error || achievementsRes.error || skillsRes.error) {
      console.warn('Supabase connection failed, using fallback data');
      console.error('Projects error:', projectsRes.error);
      console.error('Achievements error:', achievementsRes.error);
      console.error('Skills error:', skillsRes.error);
      
      return NextResponse.json({
        projects: portfolioData.projects || [],
        achievements: portfolioData.achievements || [],
        skills: portfolioData.skills || [],
        languages: [],
        source: 'fallback',
      });
    }

    return NextResponse.json({
      projects: projectsRes.data || [],
      achievements: achievementsRes.data || [],
      skills: skillsRes.data || [],
      languages: languagesRes.data || [],
      source: 'supabase',
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    // Fallback to local data on any error
    return NextResponse.json({
      projects: portfolioData.projects || [],
      achievements: portfolioData.achievements || [],
      skills: portfolioData.skills || [],
      source: 'fallback-error',
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (!auth) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { type, item } = body;

    // Validate input
    if (!type || !item) {
      return NextResponse.json(
        { error: 'Type and item are required' },
        { status: 400 }
      );
    }

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
    } else if (type === 'language') {
      result = await supabaseAdmin
        .from('languages')
        .insert([item])
        .select();
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    if (result?.error) {
      throw result.error;
    }

    // Fetch all data to return
    const [projectsRes, achievementsRes, skillsRes, languagesRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('skills').select('*'),
      supabaseAdmin.from('languages').select('*'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsRes.data || [],
        achievements: achievementsRes.data || [],
        skills: skillsRes.data || [],
        languages: languagesRes.data || [],
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (!auth) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { type, id, item } = body;

    // Validate input
    if (!type || !id || !item) {
      return NextResponse.json(
        { error: 'Type, id, and item are required' },
        { status: 400 }
      );
    }

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
    } else if (type === 'language') {
      result = await supabaseAdmin
        .from('languages')
        .update(item)
        .eq('id', id)
        .select();
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    if (result?.error) {
      throw result.error;
    }

    // Fetch all data to return
    const [projectsRes, achievementsRes, skillsRes, languagesRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('skills').select('*'),
      supabaseAdmin.from('languages').select('*'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsRes.data || [],
        achievements: achievementsRes.data || [],
        skills: skillsRes.data || [],
        languages: languagesRes.data || [],
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (!auth) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = parseInt(searchParams.get('id') || '0');

    // Validate input
    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and id are required' },
        { status: 400 }
      );
    }

    let result;

    if (type === 'project') {
      result = await supabaseAdmin.from('projects').delete().eq('id', id);
    } else if (type === 'achievement') {
      result = await supabaseAdmin.from('achievements').delete().eq('id', id);
    } else if (type === 'skill') {
      result = await supabaseAdmin.from('skills').delete().eq('id', id);
    } else if (type === 'language') {
      result = await supabaseAdmin.from('languages').delete().eq('id', id);
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    if (result?.error) {
      throw result.error;
    }

    // Fetch all data to return
    const [projectsRes, achievementsRes, skillsRes, languagesRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('skills').select('*'),
      supabaseAdmin.from('languages').select('*'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsRes.data || [],
        achievements: achievementsRes.data || [],
        skills: skillsRes.data || [],
        languages: languagesRes.data || [],
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
