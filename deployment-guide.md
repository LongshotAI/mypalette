# MyPalette Deployment Guide

This guide provides instructions for deploying the MyPalette platform to Vercel with Supabase as the backend.

## Prerequisites

- A Vercel account
- A Supabase project
- A Stripe account (for payment processing)
- The MyPalette codebase

## Environment Variables

The following environment variables need to be configured in your Vercel project:

```
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Site configuration
NEXT_PUBLIC_SITE_URL=https://your-vercel-deployment-url.vercel.app
```

## Supabase Setup

1. Create the required tables in your Supabase project:
   - users
   - portfolios
   - artworks
   - open_calls
   - submissions
   - education_content
   - templates

2. Configure Supabase Authentication:
   - Enable Email/Password sign-in
   - Set up password reset email templates
   - Configure redirect URLs for authentication

3. Set up Supabase Storage:
   - Create buckets for:
     - profile-images
     - artwork-images
     - open-call-banners
     - education-thumbnails

4. Configure Storage Policies:
   - Public read access for all buckets
   - Authenticated write access for users to their own content

## Stripe Setup

1. Create a Stripe account if you don't have one
2. Set up a webhook endpoint in your Stripe dashboard pointing to:
   `https://your-vercel-deployment-url.vercel.app/api/webhooks/stripe`
3. Add the webhook secret to your environment variables

## Deployment Steps

1. Push your code to a GitHub repository
2. Connect your GitHub repository to Vercel
3. Configure the environment variables in your Vercel project settings
4. Deploy the project

## Post-Deployment

1. Test the authentication flow
2. Verify Supabase connections
3. Test Stripe payment processing
4. Check media uploads and storage
5. Verify all features are working as expected

## Troubleshooting

- If authentication fails, check your Supabase URL and anon key
- If media uploads fail, verify storage bucket permissions
- If payments don't process, check Stripe configuration and webhook setup

## Maintenance

- Monitor Vercel logs for any errors
- Keep dependencies updated
- Regularly backup your Supabase database
