/**
 * Shared TypeScript interfaces and types for the portfolio application
 * Single source of truth for data models across public and admin views
 */

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  image?: string;
  skills: string[];
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
  issuer: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  logo: string;
}

export interface Language {
  id: number;
  name: string;
  proficiency: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  specialization: string;
  startYear: string;
  endYear: string;
}

export interface CoreSkill {
  id: number;
  skill: string;
  created_at?: string;
  updated_at?: string;
}

export interface SoftSkill {
  id: number;
  skill: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  image?: string;
}

export interface PortfolioData {
  projects: Project[];
  achievements: Achievement[];
  skills: Skill[];
  languages: Language[];
  educations: Education[];
  coreSkills: CoreSkill[];
  softSkills: SoftSkill[];
}
