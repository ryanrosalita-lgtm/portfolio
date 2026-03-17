# 📊 Portfolio Architecture Diagram & Quick Reference

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      PUBLIC PORTFOLIO SITE                       │
│                  (Next.js Page: /page.tsx)                       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Hero Section | Projects | Skills | Education | Contact │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │                                    │
│                             ▼                                    │
│                  GET /api/portfolio                             │
└─────────────────────────┬──────────────────────────────────────┘
                          │
┌─────────────────────────┴──────────────────────────────────────┐
│                      ADMIN DASHBOARD                            │
│              (Next.js Page: /admin/dashboard)                  │
│                                                                  │
│  ┌──────┬──────────┬──────────┬────────┬───────────┬──────┐    │
│  │Prof  │Projects  │Achieve   │Skills  │Languages  │Edu   │    │
│  │      │          │ments     │        │           │      │    │
│  └──────┴┬─────────┴┬─────────┴────────┴───────────┴──┬───┘    │
│           │         │  Edit/Delete Buttons            │         │
│           │         └────────────────┬────────────────┘         │
│           │                          │                          │
│           └──────────────┬───────────┘                          │
│                          ▼                                       │
│              POST/PUT/DELETE /api/portfolio                     │
│           (Requires JWT Token in Authorization)                 │
│                          ▼                                       │
│              POST /api/upload (Image Files)                     │
└──────────────────────┬───────────────────────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────────────────────┐
│                  SUPABASE BACKEND                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  PostgreSQL  │  │   Storage    │  │   Auth RLS   │           │
│  │  Tables (8)  │  │   Buckets    │  │   Policies   │           │
│  │              │  │  (2 buckets) │  │              │           │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤           │
│  │ profile      │  │ portfolio    │  │ SELECT: All  │           │
│  │ projects     │  │ -images      │  │ WRITE: Auth  │           │
│  │ achievements │  │ project      │  │             │           │
│  │ skills       │  │ -images      │  │             │           │
│  │ languages    │  │              │  │             │           │
│  │ educations   │  │              │  │             │           │
│  │ core_skills  │  │              │  │             │           │
│  │ soft_skills  │  │              │  │             │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1️⃣ **Authentication Flow**

```
User Input (Email + Password)
        ↓
    [Login Page]
        ↓
POST /api/admin/login
        ↓
    [Validate Credentials]
        ↓
    {✅ Valid}         {❌ Invalid}
        ↓                    ↓
Generate JWT Token    Show Error
    ↓
Save to localStorage
    ↓
Redirect to Dashboard
    ↓
Include in All Requests: Authorization: Bearer {token}
        ↓
[Server Validates Token]
    ↓
    {✅ Valid}  {❌ Invalid/Expired}
    ↓               ↓
Process    Show Error & Logout
```

### 2️⃣ **CRUD Operation Flow**

```
User Interface
    ↓
[Form Submission]
    ↓
{Add}  {Edit}  {Delete}
 ↓     ↓       ↓
POST  PUT    DELETE
    ↓
/api/portfolio
    ↓
[Authenticate Request]
    ↓
    {✅ Authorized}      {❌ Unauthorized}
    ↓                    ↓
[Process Operation]  [Return 401]
    ↓                    
Supabase Database
    ↓
[RLS Policy Check]
    ↓
    {✅ Allowed}        {❌ Denied}
    ↓                   ↓
[Execute Query]    [Return 403]
    ↓
[Fetch Updated Data]
    ↓
{Return All Items}
    ↓
Update UI
```

### 3️⃣ **Image Upload Flow**

```
User Selects File
    ↓
[onChange Event]
    ↓
Extract File & Validate
  ✓ Type: JPG/PNG/WebP/GIF
  ✓ Size: ≤ 5MB
    ↓
Create FormData
    ↓
POST /api/upload
    ↓
[Authenticate Request]
    ↓
[Upload to Supabase Storage]
    ↓
Generate Filename: {timestamp}-{name}
    ↓
Store in Bucket (portfolio-images or project-images)
    ↓
Return Public URL
    ↓
Save URL to Database
    ↓
Update UI with Image Preview
```

---

## Component Hierarchy

```
App
├── layout.tsx
│   └── globals.css
├── page.tsx (Public Portfolio)
│   ├── Profile Card
│   ├── Projects Section
│   │   └── Project Card (multiple)
│   ├── Achievements Section
│   ├── Skills Section
│   │   └── Skill Grid (by category)
│   ├── Languages Section
│   ├── Education Section
│   └── Fallback UI (when data missing)
└── admin/
    ├── page.tsx (Login)
    │   └── Login Form
    └── dashboard/
        page.tsx (Dashboard)
        ├── Header with Logout
        ├── Tab Navigation (8 tabs)
        ├── Form Section (dynamic by tab)
        │   ├── Profile Form
        │   ├── Project Form (with image upload)
        │   ├── Achievement Form
        │   ├── Skill Form
        │   ├── Language Form
        │   ├── Education Form
        │   ├── Core Skill Form
        │   └── Soft Skill Form
        └── List Section (dynamic by tab)
            ├── Project Items
            ├── Achievement Items
            ├── Skill Grid
            ├── Language Items
            ├── Education Items
            ├── Core Skill Items
            └── Soft Skill Items
```

---

## API Endpoint Map

| Endpoint | Method | Auth | Request | Response | Notes |
|----------|--------|------|---------|----------|-------|
| `/api/admin/login` | POST | ❌ | `{email, password}` | `{token}` | 24h expiry |
| `/api/admin/profile` | GET | ❌ | - | `Profile` | Fallback data |
| `/api/admin/profile` | PUT | ❌ | `Profile` | `{success, data}` | Updates DB |
| `/api/portfolio` | GET | ❌ | - | `{projects, achievements, ...}` | Returns all + source |
| `/api/portfolio` | POST | ✅ | `{type, item}` | `{success, data}` | Creates item |
| `/api/portfolio` | PUT | ✅ | `{type, id, item}` | `{success, data}` | Updates item |
| `/api/portfolio` | DELETE | ✅ | `?type=X&id=Y` | `{success, data}` | Deletes item |
| `/api/upload` | POST | ✅ | FormData `{file, bucket}` | `{url, fileName}` | Image upload |

---

## Database Schema Quick Reference

### Table: `profile`
```
id (1)              → Singleton profile
name, title, bio    → Display info
email, phone        → Contact
location            → Location
image               → Avatar URL
created_at, updated_at → Timestamps
```

### Tables: `projects`, `achievements`, `languages`, `educations`
```
id                  → BIGINT PK (auto-increment)
field1, field2, ... → Content fields
created_at, updated_at → Timestamps
```

### Tables: `core_skills`, `soft_skills`
```
id                  → BIGINT PK (auto-increment)
skill               → TEXT (skill name)
created_at, updated_at → Timestamps
```

### Table: `skills`
```
id                  → BIGINT PK (auto-increment)
name                → Skill name
category            → Programming, Database, Design, Other
level               → 0-100 (proficiency)
logo                → URL to logo image
created_at, updated_at → Timestamps
```

---

## State Management (Dashboard)

```
Form States (per item type):
├── profileForm {name, title, bio, email, phone, location, image}
├── projectForm {title, description, category, date, image, skills}
├── achievementForm {title, description, date, type, issuer}
├── skillForm {name, category, level, logo}
├── languageForm {name, proficiency}
├── educationForm {institution, degree, specialization, startYear, endYear}
├── coreSkillForm {skill}
└── softSkillForm {skill}

UI States:
├── activeTab ('profile'|'projects'|...'soft_skills')
├── editingId (null | number)
├── editingType ('project'|'achievement'|...)
└── uploading (boolean)

Data States:
├── projects: Project[]
├── achievements: Achievement[]
├── skills: Skill[]
├── languages: Language[]
├── educations: Education[]
├── coreSkills: CoreSkill[]
└── softSkills: SoftSkill[]
```

---

## Environment Variables

```env
# Required for Frontend (public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Required for Backend (secret)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
JWT_SECRET=your-jwt-secret-key

# Optional
NODE_ENV=production
```

---

## Common Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Build
npm run build        # Production build
npm start           # Start production server

# Linting
npm run lint        # Check code quality

# Database
# Login to Supabase Dashboard → SQL Editor
# Create/update tables
# Test RLS policies
```

---

## Troubleshooting Quick Guide

| Issue | Cause | Solution |
|-------|-------|----------|
| "Failed to create item" | RLS policy issue | Check Supabase RLS "Allow write" policy |
| Education years show "-" | Missing SELECT policy | Run: `CREATE POLICY "Allow read for all" ON educations FOR SELECT USING (true);` |
| Image upload fails | File too large | Max 5MB, try compressing |
| Login fails | Wrong credentials | Check ADMIN_EMAIL, ADMIN_PASSWORD env vars |
| 401 Unauthorized | Token missing/expired | Re-login, refresh token |
| Images not showing | URL broken | Check Supabase Storage bucket permissions |
| Empty dashboard | Supabase down | Falls back to portfolio.json, check fallback data |

---

## File Organization Tips

When adding new features:

1. **Keep API routes simple** - Use helper functions in `lib/`
2. **Create separate type file** - Don't scatter interfaces
3. **Centralize constants** - Use `lib/constants.ts`
4. **Use meaningful names** - `handleAddProject` vs `handleSubmit`
5. **Comment complex logic** - JWT, RLS, API auth
6. **Test locally first** - Use `npm run dev`
7. **Commit incrementally** - Small, focused commits

---

**Last Updated**: March 17, 2026
