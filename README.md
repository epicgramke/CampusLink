# Campus Connect Kenya — Full Project Starter

A mobile-friendly black-and-yellow student community web app with:
- Email/password signup and login using Supabase Auth
- Google OAuth button (requires provider setup)
- Password reset email flow
- Home page and responsive category navigation
- Marketplace, Food, Hostels, Jobs, Internships, Lost & Found
- Search, sort, listing creation, profile editing, logout
- Supabase database schema and row-level security policies
- Demo listing examples used if the listings table is not yet configured

## Project files
- `index.html` — app layout and dialogs
- `style.css` — responsive design
- `script.js` — routing, authentication, search, profile and listings
- `supabase_schema.sql` — create database tables, policies and signup profile trigger
- `README.md` — setup guide

## 1. Upload to GitHub
Create a repository, then upload these five files directly into the repository root (not only the ZIP).

## 2. Publish with Netlify
1. Netlify → Add new site → Import an existing project → select your GitHub repository.
2. Build command: leave blank.
3. Publish directory: `.` (root).
4. Deploy site.

## 3. Supabase database setup
1. Open your Supabase project.
2. Go to SQL Editor → New query.
3. Copy the full contents of `supabase_schema.sql`, paste it and click Run.
4. Check Table Editor for `profiles` and `listings`.

The project URL and browser publishable key are set in `script.js` based on the settings supplied earlier. Publishable/anon keys are designed for browser use; NEVER paste a Supabase service-role/secret key into frontend files.

## 4. Enable email/password
Supabase Dashboard → Authentication → Sign In / Providers → Email. Enable email signup. Decide whether to require email confirmation. If confirmation is enabled, test with the link sent to your inbox.

## 5. Enable Google sign-in
1. Supabase Dashboard → Authentication → Sign In / Providers → Google. Enable it and copy the callback URL shown by Supabase.
2. In Google Cloud Console, create/configure an OAuth client. Add the Supabase callback URL to Authorized redirect URIs.
3. Copy the Google Client ID and Client Secret into Supabase's Google provider settings and save.
4. Supabase Dashboard → Authentication → URL Configuration: add the exact deployed Netlify URL to Site URL and Redirect URLs.
5. Test the Google button after deployment.

Google sign-in cannot be completed until the external Google OAuth credentials are added by the project owner. This package does not contain or create Google credentials.

## 6. Supabase redirect URLs
Authentication → URL Configuration. Add your deployed site URL, for example `https://YOUR-SITE-NAME.netlify.app/`, to the redirect allow list. Replace the example with your actual Netlify URL. Include a localhost URL only if you use a local server.

## 7. Test checklist
- Open deployed URL on mobile and desktop.
- Create an account with an email you can access.
- Confirm email if required.
- Log in and log out.
- Test password reset.
- Configure and test Google OAuth.
- Create a listing in each category.
- Edit your profile.
- Test search and mobile navigation.

## Important production notes
- This is a complete front-end project scaffold, but a production service still requires the database SQL to be run and Google OAuth credentials configured.
- Public listings are currently readable by authenticated users according to the provided policies. If you want visitors to browse listings without logging in, add a carefully reviewed anonymous SELECT policy before doing so.
- The frontend includes listing creation and profile editing. Listing editing/deletion, image uploads, moderation/reporting, phone verification, payment handling and admin tools are not included yet.
- Do not collect unnecessary sensitive personal information. Review any public contact information before publishing.
