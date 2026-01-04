# 🔧 Bharat EMR Frontend - Troubleshooting Guide

## Issue: npm run dev fails or localhost:3000 shows "Page not found"

This is the most common issue. Here's the step-by-step solution:

---

## ✅ Step 1: Clean Installation (Reset Everything)

Run these commands in order:

```bash
# Remove node_modules and lock files
rm -rf node_modules package-lock.json yarn.lock

# Clear npm cache
npm cache clean --force

# Reinstall everything fresh
npm install
```

---

## ✅ Step 2: Check Node.js Version

Ensure you have Node.js 16 or higher:

```bash
node --version
npm --version
```

**Expected output:**
- node: v16.0.0 or higher
- npm: 7.0.0 or higher

If your version is too old, [download Node.js 18 LTS](https://nodejs.org/)

---

## ✅ Step 3: Verify package.json Exists

Make sure you're in the correct directory:

```bash
# Check if package.json exists
ls -la package.json

# Or on Windows
dir package.json
```

**You should see a package.json file listed.**

---

## ✅ Step 4: Check for Errors During Installation

When you run `npm install`, watch for error messages like:
- "peer dep not met"
- "404 not found"
- "gyp ERR"

If you see errors, try:

```bash
# Install with legacy peer deps flag
npm install --legacy-peer-deps
```

---

## ✅ Step 5: Verify Vite Installation

Make sure Vite was installed:

```bash
# Check if Vite is in node_modules
ls node_modules/.bin/vite

# Or on Windows
dir node_modules\.bin\vite.cmd
```

If Vite is not there, reinstall it specifically:

```bash
npm install vite --save-dev
```

---

## ✅ Step 6: Try Running Dev Server

Now try starting the development server:

```bash
npm run dev
```

**Expected output should look like:**
```
> bharat-emr-frontend@1.0.0 dev
> vite

  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## ⚠️ If Dev Server Still Doesn't Start

Try these alternatives:

### Option 1: Use Port 5173 Instead

Vite defaults to port 5173, not 3000. Try:

```
http://localhost:5173
```

### Option 2: Specify Port 3000

```bash
npm run dev -- --port 3000
```

### Option 3: Check if Port is Already in Use

**Windows:**
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Kill process using that port (replace PID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :3000
lsof -i :5173

# Kill process
kill -9 <PID>
```

### Option 4: Run with Verbose Output

Get more detailed error messages:

```bash
npm run dev -- --debug
```

Scroll up in the terminal and look for error messages like:
- "Cannot find module"
- "SyntaxError"
- "port already in use"

---

## 🔍 Common Issues and Solutions

### Issue 1: "Cannot find module 'react'"

**Solution:**
```bash
npm install react react-dom
```

### Issue 2: "Cannot find module '@vite/plugin-react'"

**Solution:**
```bash
npm install @vitejs/plugin-react --save-dev
```

### Issue 3: "Cannot find module 'zustand'"

**Solution:**
```bash
npm install zustand axios react-router-dom
```

### Issue 4: "Cannot find module '@mui/material'"

**Solution:**
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

### Issue 5: Port 3000 is already in use

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID 1234 /F
npm run dev
```

**Mac/Linux:**
```bash
lsof -i :3000
kill -9 1234
npm run dev
```

### Issue 6: "EACCES: permission denied"

**Solution (not recommended but works):**
```bash
sudo npm install
sudo npm run dev
```

**Better solution:**
```bash
npm install -g npm
npm cache clean --force
npm install
```

---

## 🚀 Nuclear Option: Complete Reset

If nothing else works, completely reset your environment:

### Step 1: Delete Everything
```bash
# Navigate to your project folder
cd bharat-emr-frontend

# Delete all npm files
rm -rf node_modules package-lock.json yarn.lock .npm
```

### Step 2: Clear Caches
```bash
# Windows
rmdir /s %AppData%\npm
rmdir /s %AppData%\npm-cache

# Mac/Linux
rm -rf ~/.npm
rm -rf ~/.npm-global
```

### Step 3: Reinstall Node.js
1. Download Node.js 18 LTS from https://nodejs.org/
2. Uninstall old Node.js version
3. Install new version
4. Restart computer
5. Verify: `node --version` and `npm --version`

### Step 4: Fresh Install
```bash
npm install --legacy-peer-deps
npm run dev
```

---

## 📊 Manual Installation of All Dependencies

If `npm install` is having issues, install packages individually:

```bash
# Core
npm install react@18.3.1 react-dom@18.3.1

# Routing
npm install react-router-dom@6.23.0

# UI Framework
npm install @mui/material@5.15.15 @mui/icons-material@5.15.15 @emotion/react @emotion/styled

# State Management
npm install zustand@4.5.2

# HTTP Client
npm install axios@1.6.8

# Cookies
npm install js-cookie@3.0.5

# Date Utils
npm install date-fns@3.6.0

# Dev Dependencies
npm install --save-dev vite@5.2.10 @vitejs/plugin-react@4.2.1 vitest
```

---

## ✨ Verify Installation

After completing installation, run these checks:

```bash
# Check if all packages are installed
ls node_modules | grep -E 'react|vite|zustand|axios'

# Check package.json
cat package.json

# Dry run of dev command
npm run dev -- --help
```

---

## 🌐 Test Connection

Once dev server is running:

1. Open browser developer tools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check if http://localhost:3000 or http://localhost:5173 loads

---

## 💡 Quick Checklist

Before reaching out for help, verify:

- ✅ Node.js version is 16+
- ✅ You're in the correct project directory
- ✅ package.json exists in the directory
- ✅ No error messages during `npm install`
- ✅ `npm run dev` starts without errors
- ✅ Terminal shows "ready in xxx ms"
- ✅ You tried port 5173 if 3000 doesn't work
- ✅ No other app is using the port
- ✅ Firewall isn't blocking localhost access

---

## 🆘 If Still Not Working

Please provide these details:

1. **Node version:** `node --version`
2. **npm version:** `npm --version`
3. **OS:** Windows/Mac/Linux
4. **Current directory:** `pwd` or `cd`
5. **Error message:** Copy full error text
6. **Screenshot:** Of terminal during `npm run dev`

---

## ✅ Alternative: Use Docker

If localhost setup is not working, use Docker instead:

```bash
# Build Docker image
docker build -t bharat-emr-frontend:latest .

# Run container
docker run -p 3000:3000 bharat-emr-frontend:latest

# Visit http://localhost:3000
```

Docker eliminates environment-specific issues.

---

## 🎯 Success Indicators

You'll know it's working when you see:

✅ Terminal shows "ready in xxx ms"
✅ http://localhost:3000 (or 5173) loads in browser
✅ React app displays login page
✅ No red error messages in browser console
✅ Network requests showing in browser DevTools

---

**Last Updated:** January 4, 2026
**Status:** Complete Troubleshooting Guide
