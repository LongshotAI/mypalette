# MyPalette Platform - Vercel Deployment Guide

This guide will walk you through deploying the MyPalette Platform to Vercel, setting up your Supabase database, and making future edits to your application.

## Prerequisites

1. A GitHub account
2. A Vercel account (free tier is sufficient)
3. A Supabase account (free tier is sufficient)

## Step 1: Set Up Supabase

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Choose a name for your project (e.g., "mypalette")
4. Set a secure database password (save this for later)
5. Choose the region closest to your target audience
6. Wait for your database to be created (this may take a few minutes)

Once your Supabase project is created:

1. Go to the "Settings" > "API" section
2. Note down the following credentials:
   - Project URL (labeled as "URL")
   - anon/public key (labeled as "anon key")
   - service_role key (keep this secure, it has full access to your database)

## Step 2: Set Up Database Schema

1. In your Supabase project, go to the "SQL Editor" section
2. Create a new query and paste the following SQL to set up your database schema:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  social_links JSONB DEFAULT '{}',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  config JSONB NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolios table
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  template_id UUID REFERENCES templates(id) NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create artworks table
CREATE TABLE artworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  year INTEGER,
  medium TEXT,
  tags TEXT[],
  blockchain TEXT,
  external_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create open_calls table
CREATE TABLE open_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  fee DECIMAL(10, 2),
  status TEXT DEFAULT 'pending', -- pending, active, closed
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  open_call_id UUID REFERENCES open_calls(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  artwork_id UUID REFERENCES artworks(id),
  media_url TEXT,
  bio TEXT NOT NULL,
  responses JSONB DEFAULT '{}',
  is_selected BOOLEAN DEFAULT FALSE,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create education_content table
CREATE TABLE education_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category TEXT,
  tags TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO users (email, username, password_hash, is_admin)
VALUES ('lshot.crypto@gmail.com', 'admin', '$2a$10$XQxBmQfXxLrXsxTH1xfUyOYMKdDPGJKGBQvXkGGrZ6VFBBCuZ7JXe', TRUE);

-- Insert default templates
INSERT INTO templates (name, description, thumbnail_url, config)
VALUES 
('Artfolio', 'A clean, minimal template for showcasing artwork', '/templates/artfolio-thumb.jpg', '{"layout": "grid", "primaryColor": "#000000", "secondaryColor": "#ffffff", "fontFamily": "Inter"}'),
('Rowan', 'A bold, contemporary template with large images', '/templates/rowan-thumb.jpg', '{"layout": "masonry", "primaryColor": "#2a2a2a", "secondaryColor": "#f5f5f5", "fontFamily": "Montserrat"}'),
('Crestline', 'An elegant template with a focus on typography', '/templates/crestline-thumb.jpg', '{"layout": "list", "primaryColor": "#1a1a1a", "secondaryColor": "#e0e0e0", "fontFamily": "Playfair Display"}'),
('Panorama', 'A full-width template for immersive viewing', '/templates/panorama-thumb.jpg', '{"layout": "fullwidth", "primaryColor": "#121212", "secondaryColor": "#f0f0f0", "fontFamily": "Roboto"}');
```

3. Run the query to create your database schema and initial data

## Step 3: Push Your Code to GitHub

1. Create a new GitHub repository
2. Push the MyPalette code to your repository:

```bash
cd mypalette
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mypalette.git
git push -u origin main
```

## Step 4: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and sign up or log in
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next
5. Add the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
6. Click "Deploy"

Vercel will now build and deploy your application. Once complete, you'll receive a URL where your application is hosted (e.g., https://mypalette.vercel.app).

## Making Future Edits

To make changes to your application:

1. Clone your GitHub repository to your local machine
2. Make your desired changes
3. Commit and push your changes to GitHub
4. Vercel will automatically detect the changes and redeploy your application

For more significant changes:

1. Create a new branch for your changes
2. Make and test your changes locally
3. Push the branch to GitHub
4. Create a pull request
5. Vercel will create a preview deployment for your pull request
6. Once satisfied, merge the pull request to trigger a production deployment

## Local Development

To run the application locally for testing:

1. Clone your GitHub repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
4. Run the development server: `npm run dev`
5. Open http://localhost:3000 in your browser

## Troubleshooting

If you encounter issues with your deployment:

1. Check the Vercel deployment logs for errors
2. Verify your environment variables are correctly set
3. Ensure your Supabase database is properly configured
4. Check that your GitHub repository contains all the necessary files

For database issues:

1. Go to the Supabase SQL Editor to run queries and check your data
2. Use the Supabase Table Editor to manually inspect and modify data
3. Check the Supabase logs for any API errors

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Documentation](https://docs.github.com/en)
