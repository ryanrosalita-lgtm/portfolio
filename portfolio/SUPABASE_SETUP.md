# Supabase Setup Guide

## Step 1: Create Database Tables in Supabase

Go to your Supabase dashboard and create these tables with the SQL below:

### 1. Projects Table
```sql
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  date TIMESTAMP,
  image TEXT,
  skills TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Achievements Table
```sql
CREATE TABLE achievements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT,
  issuer TEXT,
  date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Skills Table
```sql
CREATE TABLE skills (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER,
  logo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Step 2: Get Your Supabase Credentials

1. Go to Supabase Dashboard
2. Click on your project
3. Go to **Settings > API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 3: Update .env.local

Edit `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiI...

ADMIN_EMAIL=shuhuon23@gmail.com
ADMIN_PASSWORD=your_secure_password_here
```

## Step 4: Set Row Level Security (RLS) - IMPORTANT

In Supabase:

1. Go to **Authentication > Policies**
2. For each table (projects, achievements, skills):
   - Enable RLS
   - Create policy: Allow SELECT for anonymous users
   - Create policy: Allow INSERT/UPDATE/DELETE only with service_role key

```sql
-- Allow anyone to read
CREATE POLICY "Enable read access for all users" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON skills
  FOR SELECT USING (true);
```

## Step 5: Seed Initial Data (Optional)

Go to Supabase SQL Editor and run:

```sql
INSERT INTO skills (name, category, level, logo) VALUES
('React', 'Programming', 85, 'https://cdn.simpleicons.org/react/61DAFB'),
('JavaScript', 'Programming', 90, 'https://cdn.simpleicons.org/javascript/F7DF1E'),
('Java', 'Programming', 80, 'https://cdn.simpleicons.org/java/007396'),
('Python', 'Programming', 85, 'https://cdn.simpleicons.org/python/3776AB'),
('PHP', 'Programming', 75, 'https://cdn.simpleicons.org/php/777BB4'),
('SQL', 'Database', 88, 'https://cdn.simpleicons.org/mysql/4479A3'),
('SQLite', 'Database', 82, 'https://cdn.simpleicons.org/sqlite/003B57'),
('PostgreSQL', 'Database', 85, 'https://cdn.simpleicons.org/postgresql/336791'),
('Prisma', 'Database', 80, 'https://cdn.simpleicons.org/prisma/2D3748'),
('Adobe Photoshop', 'Design', 90, 'https://cdn.simpleicons.org/adobephotoshop/31A8FF');
```

## Step 6: Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Supabase integration"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to vercel.com
   - Import your GitHub repo
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `ADMIN_EMAIL`
     - `ADMIN_PASSWORD`
   - Deploy!

## Testing

1. Start dev server: `npm run dev`
2. Visit `http://localhost:3000` to see public portfolio
3. Visit `http://localhost:3000/admin` to login and manage content
4. Admin panel will now use Supabase!

## Troubleshooting

- **"Missing Supabase environment variables"**: Check `.env.local` is created with correct values
- **"Failed to read data"**: Check RLS policies allow SELECT for anonymous
- **Inserts not working**: Check service role key in `.env.local`
- **CORS errors**: Verify Supabase project URL is correct

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to GitHub (added to .gitignore)
- Service role key should only be used server-side (in API routes)
- Client only uses anon key (safe to expose)
- Change default admin credentials after setup!

## What's Using Supabase?

✅ Projects management (admin panel)
✅ Achievements management (admin panel)  
✅ Technical skills management (admin panel)
✅ Public portfolio display (reads from Supabase)
