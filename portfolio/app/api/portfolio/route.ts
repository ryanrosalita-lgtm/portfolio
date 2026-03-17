import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import portfolioData from '@/data/portfolio.json';
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth';

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
      console.log('Supabase educations data:', educationsRes.data);
    }
    if (educationsRes.error) {
      console.error('Supabase educations error:', educationsRes.error);
    }

    // If Supabase fails, fallback to local JSON data
    if (projectsRes.error || achievementsRes.error || skillsRes.error || languagesRes.error || educationsRes.error || coreSkillsRes.error || softSkillsRes.error) {
      console.warn('Supabase connection failed, using fallback data');
      console.error('Projects error:', projectsRes.error);
      console.error('Achievements error:', achievementsRes.error);
      console.error('Skills error:', skillsRes.error);
      console.error('Languages error:', languagesRes.error);
      console.error('Educations error:', educationsRes.error);
      console.error('Core skills error:', coreSkillsRes.error);
      console.error('Soft skills error:', softSkillsRes.error);
      
      return NextResponse.json({
        projects: portfolioData.projects || [],
        achievements: portfolioData.achievements || [],
        skills: portfolioData.skills || [],
        languages: [],
        educations: [],
        coreSkills: [],
        softSkills: [],
        source: 'fallback',
      });
    }

    return NextResponse.json({
      projects: projectsRes.data || [],
      achievements: achievementsRes.data || [],
      skills: skillsRes.data || [],
      languages: languagesRes.data || [],
      educations: educationsRes.data || [],
      coreSkills: coreSkillsRes.data || [],
      softSkills: softSkillsRes.data || [],
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
      console.error('Supabase insert error:', result.error);
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
    console.error('Error creating item:', error);
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
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
