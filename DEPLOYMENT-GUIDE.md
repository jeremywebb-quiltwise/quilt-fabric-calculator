# Deploy Your Quilt Calculator to Your Domain

## Step 1: Create GitHub Repository

1. Go to **github.com** and sign in
2. Click the **"+"** in top right, select **"New repository"**
3. Name it: `quilt-fabric-calculator`
4. Make it **Public**
5. Click **"Create repository"**

## Step 2: Upload Your Code

After creating the repository, GitHub will show you commands. Copy all your project files to the repository:

1. Download/copy all files from your Replit project
2. Follow GitHub's instructions to upload them

**OR** use these commands in your local terminal:
```bash
git init
git add .
git commit -m "Initial quilt calculator app"
git remote add origin https://github.com/YOURUSERNAME/quilt-fabric-calculator.git
git push -u origin main
```

## Step 3: Set Up Database (Choose One)

### Option A: Neon (Recommended - Free)
1. Go to **neon.tech**
2. Sign up with GitHub
3. Create new project: "Quilt Calculator"
4. Copy the connection string (starts with `postgresql://`)

### Option B: Supabase (Alternative - Free)
1. Go to **supabase.com**
2. Create new project
3. Go to Settings → Database
4. Copy the connection string

## Step 4: Deploy to Vercel

1. Go to **vercel.com**
2. Sign up with GitHub
3. Click **"New Project"**
4. Import your `quilt-fabric-calculator` repository
5. Configure:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Step 5: Add Environment Variables

In Vercel project settings:
1. Go to **Settings** → **Environment Variables**
2. Add: `DATABASE_URL` = your database connection string
3. Redeploy the project

## Step 6: Connect Your Domain

1. In Vercel, go to **Settings** → **Domains**
2. Add your domain: `yourdomain.com`
3. Vercel will show DNS records

## Step 7: Update GoDaddy DNS

1. Login to GoDaddy
2. Go to **My Products** → **DNS**
3. Add the records Vercel provided
4. Wait 24-48 hours for DNS propagation

## That's It!

Your quilt calculator will be live at your custom domain with:
- Real-time yard tracking
- Fabric calculator
- PostgreSQL database
- Professional design

Need help with any step? The hardest part is usually the initial GitHub setup.