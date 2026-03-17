'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

interface Language {
  id: number;
  name: string;
  proficiency: string;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  specialization: string;
  startYear: string;
  endYear: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'achievements' | 'skills' | 'languages' | 'educations'>('profile');
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();

  const [profileForm, setProfileForm] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    image: '',
  });

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    skills: '',
  });

  const [achievementForm, setAchievementForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: '',
    issuer: '',
  });

  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Programming',
    level: 80,
    logo: '',
  });

  const [languageForm, setLanguageForm] = useState({
    name: '',
    proficiency: 'Native',
  });

  const [educationForm, setEducationForm] = useState({
    institution: '',
    degree: '',
    specialization: '',
    startYear: new Date().getFullYear().toString(),
    endYear: new Date().getFullYear().toString(),
  });

  const [uploading, setUploading] = useState(false);

  // Check auth and load data
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/admin');
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [portfolioRes, profileRes] = await Promise.all([
        fetch('/api/portfolio'),
        fetch('/api/admin/profile'),
      ]);

      const portfolioData = await portfolioRes.json();
      const profileData = await profileRes.json();

      setProjects(portfolioData.projects);
      setAchievements(portfolioData.achievements);
      setSkills(portfolioData.skills || []);
      setLanguages(portfolioData.languages || []);
      setEducations(portfolioData.educations || []);
      setProfileForm(profileData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'portfolio-images');

      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        setProfileForm({ ...profileForm, image: data.url });
        alert('Image uploaded successfully!');
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        router.push('/admin');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name) {
      alert('Please enter your name');
      return;
    }

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        loadData();
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating profile');
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'project',
          item: {
            title: projectForm.title,
            description: projectForm.description,
            category: projectForm.category,
            date: projectForm.date,
            image: projectForm.image,
            skills: projectForm.skills.split(',').map((s) => s.trim()),
          },
        }),
      });

      if (response.ok) {
        loadData();
        setProjectForm({
          title: '',
          description: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
          image: '',
          skills: '',
        });
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        router.push('/admin');
      } else {
        alert('Failed to add project');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add project');
    }
  };

  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementForm.title || !achievementForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'achievement',
          item: {
            title: achievementForm.title,
            description: achievementForm.description,
            date: achievementForm.date,
            type: achievementForm.type,
            issuer: achievementForm.issuer,
          },
        }),
      });

      if (response.ok) {
        loadData();
        setAchievementForm({
          title: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          type: '',
          issuer: '',
        });
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        router.push('/admin');
      } else {
        alert('Failed to add achievement');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add achievement');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/portfolio?type=project&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadData();
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        router.push('/admin');
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete project');
    }
  };

  const handleDeleteAchievement = async (id: number) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/portfolio?type=achievement&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadData();
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        router.push('/admin');
      } else {
        alert('Failed to delete achievement');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete achievement');
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name || !skillForm.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'skill',
          item: {
            name: skillForm.name,
            category: skillForm.category,
            level: skillForm.level,
            logo: skillForm.logo,
          },
        }),
      });

      if (response.ok) {
        loadData();
        setSkillForm({
          name: '',
          category: 'Programming',
          level: 80,
          logo: '',
        });
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        router.push('/admin');
      } else {
        alert('Failed to add skill');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/portfolio?type=skill&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadData();
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        router.push('/admin');
      } else {
        alert('Failed to delete skill');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete skill');
    }
  };

  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!languageForm.name || !languageForm.proficiency) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'language',
          item: {
            name: languageForm.name,
            proficiency: languageForm.proficiency,
          },
        }),
      });

      if (response.ok) {
        loadData();
        setLanguageForm({
          name: '',
          proficiency: 'Native',
        });
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        router.push('/admin');
      } else {
        alert('Failed to add language');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add language');
    }
  };

  const handleDeleteLanguage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this language?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/portfolio?type=language&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadData();
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        router.push('/admin');
      } else {
        alert('Failed to delete language');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete language');
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!educationForm.institution || !educationForm.degree) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'education',
          item: {
            institution: educationForm.institution,
            degree: educationForm.degree,
            specialization: educationForm.specialization,
            startYear: educationForm.startYear,
            endYear: educationForm.endYear,
          },
        }),
      });

      if (response.ok) {
        loadData();
        setEducationForm({
          institution: '',
          degree: '',
          specialization: '',
          startYear: new Date().getFullYear().toString(),
          endYear: new Date().getFullYear().toString(),
        });
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        router.push('/admin');
      } else {
        alert('Failed to add education');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add education');
    }
  };

  const handleDeleteEducation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this education?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/portfolio?type=education&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadData();
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        router.push('/admin');
      } else {
        alert('Failed to delete education');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete education');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'profile'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'projects'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Portfolio Projects
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'achievements'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'skills'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Technical Skills
          </button>
          <button
            onClick={() => setActiveTab('languages')}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'languages'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Languages
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                {activeTab === 'profile'
                  ? 'Edit Profile'
                  : activeTab === 'projects'
                  ? 'Add New Project'
                  : activeTab === 'achievements'
                  ? 'Add New Achievement'
                  : activeTab === 'skills'
                  ? 'Add New Skill'
                  : 'Add New Language'}
              </h2>

              {activeTab === 'profile' ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Graphic Designer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, bio: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 h-24 text-gray-900 placeholder-gray-500"
                      placeholder="Tell about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Profile Picture
                    </label>
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          disabled={uploading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload JPG, PNG, or WebP (Max 5MB)</p>
                      </div>
                      <button
                        type="button"
                        disabled={uploading}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400"
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                    {profileForm.image && (
                      <div className="mt-3">
                        <img
                          src={profileForm.image}
                          alt="Profile preview"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <p className="text-xs text-gray-600 mt-1">URL: {profileForm.image.substring(0, 50)}...</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="+60 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, location: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="City, Country"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700"
                  >
                    Save Profile
                  </button>
                </form>
              ) : activeTab === 'projects' ? (
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Logo Design for Brand X"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 h-24 text-gray-900 placeholder-gray-500"
                      placeholder="Describe your project..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={projectForm.category}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Branding, Packaging"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={projectForm.date}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={projectForm.skills}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, skills: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Adobe Illustrator, Branding"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={projectForm.image}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, image: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="/images/project.jpg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700"
                  >
                    Add Project
                  </button>
                </form>
              ) : activeTab === 'achievements' ? (
                <form onSubmit={handleAddAchievement} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Achievement Title *
                    </label>
                    <input
                      type="text"
                      value={achievementForm.title}
                      onChange={(e) =>
                        setAchievementForm({
                          ...achievementForm,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Best Design Award"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={achievementForm.description}
                      onChange={(e) =>
                        setAchievementForm({
                          ...achievementForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 h-24 text-gray-900 placeholder-gray-500"
                      placeholder="Describe your achievement..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Type
                    </label>
                    <input
                      type="text"
                      value={achievementForm.type}
                      onChange={(e) =>
                        setAchievementForm({
                          ...achievementForm,
                          type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Award, Certification"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Issuer
                    </label>
                    <input
                      type="text"
                      value={achievementForm.issuer}
                      onChange={(e) =>
                        setAchievementForm({
                          ...achievementForm,
                          issuer: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Taylor's University"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={achievementForm.date}
                      onChange={(e) =>
                        setAchievementForm({
                          ...achievementForm,
                          date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700"
                  >
                    Add Achievement
                  </button>
                </form>
              ) : activeTab === 'skills' ? (
                <form onSubmit={handleAddSkill} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      value={skillForm.name}
                      onChange={(e) =>
                        setSkillForm({
                          ...skillForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., React, Python, PostgreSQL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Category *
                    </label>
                    <select
                      value={skillForm.category}
                      onChange={(e) =>
                        setSkillForm({
                          ...skillForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
                    >
                      <option>Programming</option>
                      <option>Database</option>
                      <option>Design</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Proficiency Level: {skillForm.level}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={skillForm.level}
                      onChange={(e) =>
                        setSkillForm({
                          ...skillForm,
                          level: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Logo URL
                    </label>
                    <input
                      type="text"
                      value={skillForm.logo}
                      onChange={(e) =>
                        setSkillForm({
                          ...skillForm,
                          logo: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="https://cdn.simpleicons.org/react/61DAFB"
                    />
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
                    <p className="font-medium mb-2">Logo suggestions:</p>
                    <p>React: https://cdn.simpleicons.org/react/61DAFB</p>
                    <p>JavaScript: https://cdn.simpleicons.org/javascript/F7DF1E</p>
                    <p>PostgreSQL: https://cdn.simpleicons.org/postgresql/336791</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700"
                  >
                    Add Skill
                  </button>
                </form>
              ) : activeTab === 'languages' ? (
                <form onSubmit={handleAddLanguage} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Language Name *
                    </label>
                    <input
                      type="text"
                      value={languageForm.name}
                      onChange={(e) =>
                        setLanguageForm({ ...languageForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., English, Spanish, Tagalog"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Proficiency Level *
                    </label>
                    <select
                      value={languageForm.proficiency}
                      onChange={(e) =>
                        setLanguageForm({ ...languageForm, proficiency: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
                    >
                      <option>Native</option>
                      <option>Fluent</option>
                      <option>Intermediate</option>
                      <option>Basic</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700"
                  >
                    Add Language
                  </button>
                </form>
              ) : null}
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {activeTab === 'projects' ? (
                projects.length > 0 ? (
                  projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{project.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {project.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {project.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(project.date).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                    No projects yet. Add one using the form!
                  </div>
                )
              ) : activeTab === 'achievements' ? (
                achievements.length > 0 ? (
                  achievements.map((achievement) => (
                    <div key={achievement.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-teal-600 mt-2">
                            {achievement.type} • {achievement.issuer}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteAchievement(achievement.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                    No achievements yet. Add one using the form!
                  </div>
                )
              ) : activeTab === 'languages' ? (
                languages.length > 0 ? (
                  <div className="space-y-4">
                    {languages.map((language) => (
                      <div key={language.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{language.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {language.proficiency}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteLanguage(language.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                    No languages yet. Add one using the form!
                  </div>
                )
              ) : (
                skills.length > 0 ? (
                  <div className="space-y-4">
                    {['Programming', 'Database', 'Design', 'Other'].map((category) => {
                      const categorySkills = skills.filter(
                        (s) => s.category === category
                      );
                      if (categorySkills.length === 0) return null;

                      return (
                        <div key={category}>
                          <h3 className="font-bold text-lg text-gray-900 mb-3 text-teal-600">
                            {category}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 pb-6 border-b">
                            {categorySkills.map((skill) => (
                              <div
                                key={skill.id}
                                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition"
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  {skill.logo && (
                                    <img
                                      src={skill.logo}
                                      alt={skill.name}
                                      className="w-6 h-6 object-contain"
                                    />
                                  )}
                                  <span className="font-medium text-gray-900 text-sm">
                                    {skill.name}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-300 rounded-full h-2 mb-3">
                                  <div
                                    className="bg-teal-600 h-2 rounded-full"
                                    style={{ width: `${skill.level}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-600">
                                    {skill.level}%
                                  </span>
                                  <button
                                    onClick={() => handleDeleteSkill(skill.id)}
                                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                    No skills yet. Add one using the form!
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
