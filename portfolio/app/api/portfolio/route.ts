import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import portfolioData from '@/data/portfolio.json';
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth';
import { devLog } from '@/lib/logger';

// Helper function to add no-cache headers
const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  try {
    const [projectsRes, achievementsRes, skillsRes, languagesRes, educationsRes, coreSkillsRes, softSkillsRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('skills').select('*'),
      supabaseAdmin.from('languages').select('*'),
      supabaseAdmin.from('educations').select('*'),
      supabaseAdmin.from('core_skills').select('*'),
      supabaseAdmin.from('soft_skills').select('*'),
    ]);

    // Debug logging
    if (educationsRes.data) {
      devLog.log('Supabase educations data:', educationsRes.data);
    }
    if (educationsRes.error) {
      devLog.error('Supabase educations error:', educationsRes.error);
    }

    // Always return Supabase data (even if empty) - admin should manage data in Supabase
    return NextResponse.json({
      projects: projectsRes.data || [],
      achievements: achievementsRes.data || [],
      skills: skillsRes.data || [],
      languages: languagesRes.data || [],
      educations: educationsRes.data || [],
      coreSkills: coreSkillsRes.data || [],
      softSkills: softSkillsRes.data || [],
      source: 'supabase',
      errors: {
        projects: projectsRes.error ? projectsRes.error.message : null,
        achievements: achievementsRes.error ? achievementsRes.error.message : null,
        skills: skillsRes.error ? skillsRes.error.message : null,
        languages: languagesRes.error ? languagesRes.error.message : null,
        educations: educationsRes.error ? educationsRes.error.message : null,
        coreSkills: coreSkillsRes.error ? coreSkillsRes.error.message : null,
        softSkills: softSkillsRes.error ? softSkillsRes.error.message : null,
      },
    }, {
      headers: noCacheHeaders,
    });
  } catch (error) {
    devLog.error('Error fetching data:', error);
    // Return empty data on error - don't use fallback
    return NextResponse.json({
      projects: [],
      achievements: [],
      skills: [],
      languages: [],
      educations: [],
      coreSkills: [],
      softSkills: [],
      source: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, {
      headers: noCacheHeaders,
      status: 500,
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
    } else if (type === 'education') {
      result = await supabaseAdmin
        .from('educations')
        .insert([item])
        .select();
    } else if (type === 'core_skill') {
      result = await supabaseAdmin
        .from('core_skills')
        .insert([item])
        .select();
    } else if (type === 'soft_skill') {
      result = await supabaseAdmin
        .from('soft_skills')
        .insert([item])
        .select();
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    if (result?.error) {
      devLog.error('Supabase insert error:', result.error);
      return NextResponse.json(
        { error: `Database error: ${result.error.message}` },
        { status: 400 }
      );
    }

    // Fetch all data to return
    const [projectsRes, achievementsRes, skillsRes, languagesRes, educationsRes, coreSkillsRes, softSkillsRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('skills').select('*'),
      supabaseAdmin.from('languages').select('*'),
      supabaseAdmin.from('educations').select('*'),
      supabaseAdmin.from('core_skills').select('*'),
      supabaseAdmin.from('soft_skills').select('*'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsRes.data || [],
        achievements: achievementsRes.data || [],
        skills: skillsRes.data || [],
        languages: languagesRes.data || [],
        educations: educationsRes.data || [],
        coreSkills: coreSkillsRes.data || [],
        softSkills: softSkillsRes.data || [],
      },
    });
  } catch (error: any) {
    devLog.error('Error creating item:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create item' },
      { status: 500 }
    );
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
    } else if (type === 'education') {
      result = await supabaseAdmin
        .from('educations')
        .update(item)
        .eq('id', id)
        .select();
    } else if (type === 'core_skill') {
      result = await supabaseAdmin
        .from('core_skills')
        .update(item)
        .eq('id', id)
        .select();
    } else if (type === 'soft_skill') {
      result = await supabaseAdmin
        .from('soft_skills')
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
    const [projectsRes, achievementsRes, skillsRes, languagesRes, educationsRes, coreSkillsRes, softSkillsRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('skills').select('*'),
      supabaseAdmin.from('languages').select('*'),
      supabaseAdmin.from('educations').select('*'),
      supabaseAdmin.from('core_skills').select('*'),
      supabaseAdmin.from('soft_skills').select('*'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsRes.data || [],
        achievements: achievementsRes.data || [],
        skills: skillsRes.data || [],
        languages: languagesRes.data || [],
        educations: educationsRes.data || [],
        coreSkills: coreSkillsRes.data || [],
        softSkills: softSkillsRes.data || [],
      },
    });
  } catch (error) {
    devLog.error('Error:', error);
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
    } else if (type === 'education') {
      result = await supabaseAdmin.from('educations').delete().eq('id', id);
    } else if (type === 'core_skill') {
      result = await supabaseAdmin.from('core_skills').delete().eq('id', id);
    } else if (type === 'soft_skill') {
      result = await supabaseAdmin.from('soft_skills').delete().eq('id', id);
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
    const [projectsRes, achievementsRes, skillsRes, languagesRes, educationsRes, coreSkillsRes, softSkillsRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('skills').select('*'),
      supabaseAdmin.from('languages').select('*'),
      supabaseAdmin.from('educations').select('*'),
      supabaseAdmin.from('core_skills').select('*'),
      supabaseAdmin.from('soft_skills').select('*'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsRes.data || [],
        achievements: achievementsRes.data || [],
        skills: skillsRes.data || [],
        languages: languagesRes.data || [],
        educations: educationsRes.data || [],
        coreSkills: coreSkillsRes.data || [],
        softSkills: softSkillsRes.data || [],
      },
    }, {
      headers: noCacheHeaders,
    });
  } catch (error) {
    devLog.error('Error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500, headers: noCacheHeaders });
  }
}
