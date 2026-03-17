# Shu Huan's Portfolio

A modern, interactive portfolio built with Next.js, Tailwind CSS, and Supabase. Features an admin panel for managing projects, achievements, and technical skills.

## Features

✨ **Dynamic Content Management**
- Admin panel to create/edit/delete portfolio items
- Projects with images, categories, and skills
- Achievements and awards management
- Technical skills with proficiency levels and logos

🗄️ **Database**
- Supabase backend for persistent data storage
- Perfect for GitHub and Vercel deployment
- Row-level security for data protection

🎨 **Design**
- Responsive design (mobile-friendly)
- Clean, modern UI with Tailwind CSS
- Current portfolio data for Shu Huan

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Authentication**: Simple email/password (admin)

## Quick Start

### 1. Clone & Setup
```bash
git clone <your-repo-url>
cd portfolio
npm install
```

### 2. Configure Supabase
See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions:
- Create Supabase account and project
- Create database tables
- Get API keys
- Update `.env.local`

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

### Public Portfolio
- View at `http://localhost:3000`
- Shows all projects, achievements, and technical skills
- Data updates instantly from database

### Admin Panel
- Access at `http://localhost:3000/admin`
- Login with credentials from `.env.local`
- **Add Projects**: Title, description, skills, images
- **Add Achievements**: Awards, certifications, dates
- **Add Skills**: Programming languages, databases, design tools

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Click "Deploy"

### Environment Variables for Vercel

Add these in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Project Structure

```
portfolio/
├── app/
│   ├── api/
│   │   ├── admin/login/        # Auth endpoint
│   │   └── portfolio/          # Data CRUD endpoints
│   ├── admin/
│   │   ├── page.tsx            # Login page
│   │   └── dashboard/          # Admin panel
│   ├── page.tsx                # Public portfolio
│   └── layout.tsx
├── lib/
│   └── supabase.ts             # Supabase client
├── data/
│   └── portfolio.json          # Initial data (optional)
├── .env.local                  # Local env variables (not in git)
├── .env.example                # Template for env variables
└── SUPABASE_SETUP.md           # Detailed setup guide
```

## Important Notes

⚠️ **Security**
- `.env.local` is in `.gitignore` - never commit credentials!
- Use `.env.example` to show what variables are needed
- Service role key (private) stays on server only
- Anon key (public) can be exposed in client

🔐 **Admin Credentials**
- Change default email/password from `.env.local`
- Store in Vercel environment variables only

## Troubleshooting

### Data not showing up?
- Check Supabase credentials in `.env.local`
- Verify tables exist in Supabase
- Check RLS policies allow SELECT for public

### Admin login not working?
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`
- Check browser console for errors

### Deployment issues?
- All env variables set in Vercel? 
- Supabase project accessible?
- Database tables created?

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for more help.

## Next Steps

- Add more projects with images
- Customize the color scheme
- Add a contact form
- Deploy to custom domain
- Add blog section

## License

MIT - Feel free to use this as a template for your own portfolio!

---

**Contact**: shuhuon23@gmail.com
**Location**: Petaling Jaya, Selangor, Malaysia
