# Vercel Deployment Guide
## eFootball Tournament Registration Website

### 🚀 Quick Start

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy to Vercel**
```bash
vercel --prod
```

### 📋 Prerequisites

- **Node.js** 18.x or higher
- **Vercel Account** (free)
- **GitHub Repository** (recommended for automatic deployments)

### 🗄️ Database Setup

#### Option 1: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to your project
3. Click "Storage" → "Create Database"
4. Choose "Postgres" and follow the setup
5. Copy the connection string to your environment variables

#### Option 2: In-Memory (Development)
- The API routes automatically fallback to in-memory storage if database fails

### 🔧 Environment Variables

Set these in your Vercel project settings:

```env
# Database (if using Vercel Postgres)
POSTGRES_URL=your_postgres_connection_string

# Optional: Custom configuration
NODE_ENV=production
```

### 📁 Project Structure

```
efootball-tournament-registration-website/
├── api/                    # Vercel API routes
│   ├── players.js         # Player management
│   ├── winner.js          # Winner management
│   └── countdown.js       # Countdown timer
├── database/
│   └── schema.sql         # Database schema
├── src/
│   ├── components/        # React components
│   ├── services/          # API services
│   └── store.ts          # State management
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

### 🌐 API Endpoints

Once deployed, your API endpoints will be available at:

- `https://your-domain.vercel.app/api/players`
- `https://your-domain.vercel.app/api/winner`
- `https://your-domain.vercel.app/api/countdown`

### 🔗 API Documentation

#### Players API
- **GET** `/api/players` - Get all registered players
- **POST** `/api/players` - Register a new player
- **PATCH** `/api/players` - Update player information
- **DELETE** `/api/players` - Remove a player

#### Winner API
- **GET** `/api/winner` - Get current winner
- **POST** `/api/winner` - Set new winner
- **DELETE** `/api/winner` - Clear winner

#### Countdown API
- **GET** `/api/countdown` - Get countdown state
- **POST** `/api/countdown` - Start countdown

### 🎯 Features

#### ✅ Server-Side Registration
- Ethiopian phone validation
- Duplicate prevention
- 32-player capacity limit
- Real-time updates

#### ✅ Global Countdown Timer
- Server-managed countdown
- UTC synchronization
- Real-time updates to all users
- Admin control

#### ✅ Winner Management
- Winner announcement system
- Prize tracking
- Achievement recording

### 🔄 Automatic Deployments

Set up GitHub integration for automatic deployments:

1. Connect your GitHub repository to Vercel
2. Configure build settings (auto-detected)
3. Enable automatic deployments on push

### 📊 Monitoring

Vercel provides built-in monitoring:
- **Analytics**: Track visitor statistics
- **Logs**: View API and application logs
- **Performance**: Monitor response times
- **Error Tracking**: Debug issues quickly

### 🛠️ Development

#### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test API routes locally (requires Vercel CLI)
vercel dev
```

#### Environment Variables (Local)
Create `.env.local`:
```env
POSTGRES_URL=postgresql://user:password@localhost:5432/efootball
NODE_ENV=development
```

### 🚨 Troubleshooting

#### Common Issues

1. **Database Connection Failed**
   - Check POSTGRES_URL environment variable
   - Verify database is running
   - API will fallback to in-memory storage

2. **Build Errors**
   - Ensure all dependencies are in package.json
   - Check TypeScript compilation
   - Verify API route syntax

3. **CORS Issues**
   - API routes include CORS headers
   - Check frontend API base URL
   - Verify Vercel rewrites configuration

4. **Performance Issues**
   - Check Vercel Analytics
   - Monitor database queries
   - Optimize API response times

### 📱 Mobile Support

The application is fully responsive and works on:
- ✅ Desktop browsers
- ✅ Tablets
- ✅ Mobile phones
- ✅ Progressive Web App (PWA)

### 🔒 Security Features

- ✅ Input validation and sanitization
- ✅ Rate limiting (Vercel built-in)
- ✅ HTTPS encryption
- ✅ CORS protection
- ✅ Environment variable protection

### 💡 Tips for Success

1. **Test Locally First**: Always test API routes locally
2. **Monitor Logs**: Keep an eye on Vercel logs
3. **Use Environment Variables**: Never hardcode sensitive data
4. **Regular Backups**: Export database regularly
5. **Performance Monitoring**: Use Vercel Analytics

### 🎉 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Database configured (optional)
- [ ] API routes tested
- [ ] Frontend functionality verified
- [ ] Domain configured (optional)
- [ ] Monitoring enabled

### 📞 Support

For issues:
1. Check Vercel documentation
2. Review application logs
3. Test API endpoints individually
4. Verify environment configuration

---

**Your eFootball tournament registration website is now ready for Vercel deployment!** 🏆
