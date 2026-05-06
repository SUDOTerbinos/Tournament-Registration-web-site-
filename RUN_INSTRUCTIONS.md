# How to Run the eFootball Tournament Registration Website

## Quick Start

### Option 1: Using npm (Recommended)
```bash
npm run dev
```

### Option 2: Using npx vite directly
```bash
npx vite --port 3000 --host
```

### Option 3: Build and preview
```bash
npm run build
npm run preview
```

## What You'll See

Once running, open your browser to:
- **Local**: http://localhost:5173 (default Vite port)
- **Network**: http://localhost:3000 (if using --port 3000)

## Features Available

### 🔐 Admin Access
- Go to Admin page
- Password: `QWERTYUIOP123456`

### ⏰ Countdown Control
- Admin can start the 10 days 12 hours countdown timer
- Located in Admin Panel → Countdown Control

### 🏆 Winner Management
- Admin can declare tournament winners
- View winner dashboard with username display

### 📝 Registration
- Players can register for the tournament
- 32 total slots available

## Troubleshooting

If the server doesn't start:
1. Make sure Node.js is installed
2. Run `npm install` first
3. Check if port 5173 is available
4. Try `npm run dev -- --port 3001`

## Development Notes

- Built with React + TypeScript + Vite
- Styled with TailwindCSS
- Data stored in localStorage
- Responsive design for all devices
