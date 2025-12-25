# Quick Start Guide - JMS Shortage Counter

Get your JMS application running in production in under 10 minutes!

## 🚀 Fast Track to Production

### Step 1: Push to GitHub (2 minutes)

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Production-ready JMS app with MongoDB"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel (3 minutes)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Deploy" (Vercel auto-detects settings)

### Step 3: Add MongoDB Connection (2 minutes)

In Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add new variable:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://jms:jms22rms@jms.ykn1oes.mongodb.net/?appName=JMS`
   - **Environments**: Select all (Production, Preview, Development)
3. Click "Save"

### Step 4: Redeploy (1 minute)

1. Go to Deployments tab
2. Click on the latest deployment
3. Click "Redeploy" button

### Step 5: Test Your App (2 minutes)

Visit your Vercel URL (e.g., `https://your-app.vercel.app`)

Test these endpoints:
- `https://your-app.vercel.app` - Frontend
- `https://your-app.vercel.app/api/health` - Health check
- `https://your-app.vercel.app/api/tags` - API test

✅ **Done! Your app is live!**

---

## 📋 Pre-Deployment Checklist

Before deploying, verify:
- ✅ MongoDB connection string is in `.env` file
- ✅ All dependencies are installed (`npm install`)
- ✅ Build succeeds (`npm run build`)
- ✅ TypeScript compiles (`npm run typecheck`)

---

## 🔧 Local Development

### First Time Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: `http://localhost:8080`

### Common Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production build locally
npm run typecheck    # Check TypeScript
```

---

## 📁 Important Files

- **`.env`** - Your MongoDB connection (already configured)
- **`vercel.json`** - Vercel deployment config
- **`DEPLOYMENT.md`** - Full deployment guide
- **`CHANGES.md`** - Summary of all changes made
- **`.env.example`** - Template for environment variables

---

## 🆘 Troubleshooting

### Build Fails on Vercel
- Check environment variables are set
- Review build logs in Vercel dashboard
- Ensure `MONGODB_URI` is correct

### Can't Connect to MongoDB
1. Check MongoDB Atlas Network Access
2. Go to MongoDB Atlas → Network Access
3. Add IP: `0.0.0.0/0` (Allow from anywhere)

### API Not Working
- Verify `MONGODB_URI` is set in Vercel
- Check Vercel function logs
- Test with: `curl https://your-app.vercel.app/api/health`

---

## 🎯 Next Steps After Deployment

1. **Test all features** - Add products, create tags, update statuses
2. **Check MongoDB** - Log into Atlas and verify data is saving
3. **Monitor** - Check Vercel logs and MongoDB metrics
4. **Custom domain** (optional) - Add in Vercel settings
5. **Share** - Send the URL to your team!

---

## 📊 What You Get

- ✅ **Production-ready app** hosted on Vercel
- ✅ **MongoDB database** for persistent storage
- ✅ **HTTPS** enabled automatically
- ✅ **Auto-deployments** on every Git push
- ✅ **Free tier** - No credit card required

---

## 📚 More Information

- **Full Deployment Guide**: See `DEPLOYMENT.md`
- **Changes Made**: See `CHANGES.md`
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com/)

---

## 🎉 Success!

Your JMS Shortage Counter is now running in production with:
- ✅ Persistent MongoDB storage
- ✅ Scalable hosting on Vercel
- ✅ Automatic HTTPS
- ✅ Continuous deployment from Git

Share your production URL and start tracking shortages! 🚀
