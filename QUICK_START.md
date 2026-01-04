# 🚀 Bharat EMR Frontend - Quick Start Guide

## Prerequisites
Before you start, ensure you have:
- **Node.js** 16+ installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** installed
- Backend running on `http://localhost:8080` (optional for UI testing)

---

## ⚡ 5-Minute Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/snamdeo17/bharat-emr-frontend.git
cd bharat-emr-frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File
```bash
cp .env.example .env
```

Edit `.env` and update if needed:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Bharat EMR
```

### Step 4: Start Development Server
```bash
npm run dev
```

✅ **Application opens at**: `http://localhost:3000`

---

## 🎯 Available Commands

```bash
# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

---

## 🔐 Login Credentials (Test)

After starting the application, you can test with:

### Doctor Login
- **Role**: Doctor
- **Mobile**: Any 10-digit number (e.g., 9999999999)
- **OTP**: 123456 (from backend mock)

### Patient Login
- **Role**: Patient  
- **Mobile**: Any 10-digit number
- **OTP**: 123456

### Admin Login
- **Role**: Admin
- **Mobile**: Any 10-digit number
- **OTP**: 123456

*Note*: Actual credentials depend on your backend implementation

---

## 📁 Project Structure

```
bharat-emr-frontend/
├── src/
│   ├── api/              # API service files
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── store/           # Zustand stores
│   ├── utils/           # Utility functions
│   ├── test/            # Test files
│   ├── App.jsx          # Main app
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── Dockerfile           # Docker config
├── docker-compose.yml   # Full stack setup
├── vitest.config.js     # Test config
├── vite.config.js       # Build config
└── package.json         # Dependencies
```

---

## 🔌 Backend Connection

The application expects a Spring Boot backend running on `http://localhost:8080`

### Required Backend Endpoints
```
POST   /api/otp/send              - Send OTP
POST   /api/otp/verify            - Verify OTP
POST   /api/doctors/login         - Doctor login
POST   /api/patients/login        - Patient login
GET    /api/doctors/profile       - Get doctor profile
GET    /api/patients/profile      - Get patient profile
```

For detailed backend setup, visit: [bharat-emr-backend-complete](https://github.com/snamdeo17/bharat-emr-backend-complete)

---

## 🐳 Using Docker

### Build & Run with Docker
```bash
# Build image
docker build -t bharat-emr-frontend:latest .

# Run container
docker run -p 3000:3000 \
  -e VITE_API_BASE_URL=http://host.docker.internal:8080/api \
  bharat-emr-frontend:latest
```

### Run Complete Stack with Docker Compose
```bash
# Start all services (frontend + backend + database)
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f frontend
```

---

## ✨ Features to Explore

### Doctor Dashboard
1. View patient statistics
2. Manage patient list
3. Create and track visits
4. Manage prescriptions
5. Schedule follow-ups
6. Update profile

### Patient Dashboard
1. View health statistics
2. Check visit history
3. Access prescriptions
4. Track follow-ups
5. Update profile

### Admin Dashboard
1. View system statistics
2. Manage doctors
3. Manage patients
4. View analytics

---

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Test Example (Toast Component)
```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Toast from '../components/Toast';

describe('Toast', () => {
  it('renders toast message', () => {
    render(<Toast message="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

---

## 🌙 Dark Mode

- **Toggle Dark Mode**: Click the theme toggle button in the header
- **Theme Persists**: Your preference is saved in localStorage
- **Material-UI Theme**: Uses MUI theming system

---

## 🔍 Troubleshooting

### Issue: Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Issue: CORS Error
- Ensure backend is running on `http://localhost:8080`
- Update `.env` with correct `VITE_API_BASE_URL`
- Backend must have CORS enabled

### Issue: Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 not opening automatically
- Manually navigate to: `http://localhost:3000`
- Check console for errors

---

## 📚 Documentation

- [README.md](README.md) - Project overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Development guide
- [PRODUCTION_READY_CHECKLIST.md](PRODUCTION_READY_CHECKLIST.md) - Verification

---

## 🆘 Need Help?

1. Check [GitHub Issues](https://github.com/snamdeo17/bharat-emr-frontend/issues)
2. Review documentation files
3. Check browser console for errors
4. Verify backend is running
5. Check environment variables in `.env`

---

## 🚀 Next Steps

1. ✅ Get application running locally
2. ✅ Explore all features
3. ✅ Run tests: `npm run test`
4. ✅ Build for production: `npm run build`
5. ✅ Deploy to cloud platform (Vercel, Netlify, AWS, etc.)

---

**Happy Coding! 🎉**

For production deployment, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
