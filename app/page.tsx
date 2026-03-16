'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  image?: string;
  skills: string[];
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
  issuer: string;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  logo: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        setProjects(data.projects);
        setAchievements(data.achievements);
        setSkills(data.skills || []);
      } catch (error) {
        console.error('Failed to load portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 sm:p-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Hello, I am{" "}
                <span className="text-teal-600 italic font-light">Lynard</span>
              </h1>
              <p className="text-gray-700 mb-4 leading-relaxed">
                I'm a recent graduate with a Bachelor's (Honours) in Design in Creative Media, specializing in Graphic Design.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                I'm passionate about merchandise design and branding, and I enjoy solving problems with creative solutions. Eager to learn and grow, I thrive in every step of the design process, from brainstorming fresh ideas to delivering impactful and engaging designs.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Feel free to check out my portfolio. If you're interested in collaborating with me or have any inquiries, I would be delighted to hear from you. Your visit to my portfolio is greatly appreciated!
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-64 h-80">
                <div className="absolute inset-0 bg-teal-600 rounded-3xl transform -rotate-12"></div>
                <div className="relative w-full h-full bg-gray-300 rounded-3xl overflow-hidden flex items-center justify-center">
                  <svg
                    className="w-32 h-32 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-12 border-t pt-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Contact</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✉</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 font-medium">shuhuon23@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-800 text-sm">B</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-gray-900 font-medium">Shu Huan Loh</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">☎</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-900 font-medium">+60168988080</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📍</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="text-gray-900 font-medium">Petaling Jaya, Selangor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-12 border-t pt-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Education</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Taylor's University, Malaysia
                </h3>
                <span className="text-gray-600 text-sm">2021 - 2024</span>
              </div>
              <p className="text-teal-600">
                Bachelor of Design (Honours) in Creative Media, Graphic Design Specialisation
              </p>
            </div>
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Nanyang Academy of Fine Arts, Singapore
                </h3>
                <span className="text-gray-600 text-sm">2019 - 2020</span>
              </div>
              <p className="text-teal-600">Diploma in Graphic Communication</p>
            </div>
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chinese High School, Malaysia
                </h3>
                <span className="text-gray-600 text-sm">2013 - 2018</span>
              </div>
              <p className="text-teal-600">Majored in Commerce</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 border-t pt-8">
          {/* Languages Section */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Languages</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-full">
                <span className="font-medium text-gray-900">Mandarin</span>
                <span className="text-teal-600 text-sm">Native</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-full">
                <span className="font-medium text-gray-900">English</span>
                <span className="text-teal-600 text-sm">IELTS Band 8.0</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-full">
                <span className="font-medium text-gray-900">Malay</span>
                <span className="text-teal-600 text-sm">Basic</span>
              </div>
            </div>
          </div>

          {/* Technical Skills Section - Dynamically loaded */}
          {!loading && (
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Technical Skills</h2>
              <div className="space-y-6">
                {['Programming', 'Database', 'Design'].map((category) => {
                  const categorySkills = skills.filter(
                    (s) => s.category === category
                  );
                  if (categorySkills.length === 0) return null;

                  return (
                    <div key={category}>
                      <h3 className="font-semibold text-teal-600 mb-3">
                        {category}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {categorySkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center gap-2"
                          >
                            {skill.logo && (
                              <img
                                src={skill.logo}
                                alt={skill.name}
                                className="w-5 h-5 object-contain"
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {skill.name}
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-teal-600 h-1.5 rounded-full"
                                  style={{ width: `${skill.level}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="grid md:grid-cols-2 gap-12 border-t pt-8 mt-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Core Skills</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Packaging & Merchandise Design</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Campaign Design</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Marketing Design</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Brand Identity Design</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Publishing Design</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Social Media Design</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Soft Skills</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Responsible</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Well-organized</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Teamwork</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Time management</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Creative</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Initiative and autonomy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Portfolio Projects Section */}
        {!loading && projects.length > 0 && (
          <div className="border-t pt-8 mt-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Portfolio Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition"
                >
                  {project.image && (
                    <div className="w-full h-40 bg-gray-300 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-xs text-gray-500">
                      {new Date(project.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {project.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {!loading && achievements.length > 0 && (
          <div className="border-t pt-8 mt-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Achievements</h2>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
                          {achievement.type}
                        </span>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {achievement.issuer}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {new Date(achievement.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Link */}
        <div className="border-t pt-8 mt-8">
          <Link
            href="/admin"
            className="inline-block px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-sm font-medium"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
}
