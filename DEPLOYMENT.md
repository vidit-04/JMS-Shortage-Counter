# JMS Shortage Counter - Deployment Guide

This guide will help you deploy the JMS Shortage Counter application to Vercel with MongoDB Atlas.

## Prerequisites

1. **MongoDB Atlas Account**: Create a free account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Vercel Account**: Create a free account at [https://vercel.com](https://vercel.com)
3. **GitHub Account**: To push your code and connect with Vercel

## MongoDB Setup

### Connection String
Your MongoDB connection string should be configured in the `.env` file (locally) and in Vercel Environment Variables (for deployments):
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<db>?retryWrites=true&w=majority
```

### Database Structure
The application automatically creates:
- Database: `jms`
- Collections: `tags`, `products`
- Indexes are created automatically on first connection

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Ensure your `.env` file contains:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<db>?retryWrites=true&w=majority
```

### 3. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:8080`

### 4. Build for Production
```bash
npm run build
```

### 5. Test Production Build
```bash
npm start
```

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - JMS Shortage Counter"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Vercel will auto-detect the project settings

3. **Configure Environment Variables**
   - In the Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variable:
     - **Name**: `MONGODB_URI`
       - **Value**: `mongodb+srv://<username>:<password>@<cluster-host>/<db>?retryWrites=true&w=majority`
     - **Environments**: Select all (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a production URL like `https://your-app.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts to set up your project

4. **Add Environment Variable**
   ```bash
   vercel env add MONGODB_URI
   ```
   Paste your MongoDB URI when prompted

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment Configuration

### Custom Domain (Optional)
1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### MongoDB Network Access
Ensure MongoDB Atlas allows connections from Vercel:
1. Go to MongoDB Atlas Dashboard
2. Navigate to "Network Access"
3. Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - For production, you can restrict to Vercel's IP ranges

### MongoDB Database Access
Verify your database user has proper permissions:
1. Database Access → Edit User
2. Ensure user `jms` has "Read and write to any database" role

## Vercel Configuration

The project includes a `vercel.json` file with the following configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/node-build.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/spa"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/node-build.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/spa/$1"
    }
  ]
}
```

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/` |

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm install`
- Verify TypeScript compiles: `npm run typecheck`
- Check build output: `npm run build`

### Database Connection Issues
- Verify MongoDB URI is correct in environment variables
- Check MongoDB Atlas Network Access whitelist
- Ensure database user credentials are correct
- Check MongoDB Atlas cluster is running

### API Endpoints Not Working
- Verify the `/api/*` routes are properly configured in `vercel.json`
- Check Vercel function logs in the dashboard
- Ensure environment variables are set correctly

### Missing Environment Variables
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add `MONGODB_URI` for all environments
- Redeploy after adding variables

## Monitoring and Logs

### Vercel Logs
- Dashboard → Project → Deployments → Select deployment → Logs
- Real-time logs available for debugging

### MongoDB Monitoring
- Atlas Dashboard → Cluster → Metrics
- Monitor connection count, operations, and performance

## Continuous Deployment

Once connected to GitHub, Vercel automatically:
- Deploys on every push to `main` branch
- Creates preview deployments for pull requests
- Runs build checks before deployment

## Backup and Maintenance

### Database Backups
MongoDB Atlas provides automatic backups. To create manual backup:
1. Atlas Dashboard → Cluster → Backup
2. Configure backup schedule
3. Download backups as needed

### Update Dependencies
```bash
npm update
npm audit fix
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files to git
2. **MongoDB Access**: Use strong passwords and IP whitelisting
3. **HTTPS**: Vercel provides automatic HTTPS for all deployments
4. **CORS**: Configure CORS settings in `server/index.ts` if needed

## Cost Estimation

- **Vercel**: Free tier includes 100GB bandwidth/month
- **MongoDB Atlas**: Free tier (M0) includes 512MB storage
- Both are sufficient for small to medium deployments

## Support

For issues:
- Check Vercel documentation: [https://vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas docs: [https://docs.atlas.mongodb.com/](https://docs.atlas.mongodb.com/)
- Project issues: Create an issue in the GitHub repository

## Next Steps

After successful deployment:
1. Test all API endpoints
2. Verify data persistence in MongoDB
3. Set up monitoring and alerts
4. Configure custom domain (optional)
5. Share the production URL with your team
