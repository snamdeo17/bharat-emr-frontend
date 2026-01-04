# 🏥 Bharat EMR - Complete React Frontend

## Overview
A **production-ready** React 18 frontend application for Bharat EMR that integrates with the Spring Boot backend. Features comprehensive Electronic Medical Records management with role-based access control (Doctor, Patient, Admin).

## ✨ Features

### Doctor Features
- 📊 Comprehensive Dashboard with statistics
- 👥 Patient Management (onboard, search, manage)
- 📝 Create and manage visits with prescriptions
- 💊 Digital prescription management
- 📅 Follow-up scheduling and tracking
- 👤 Profile management

### Patient Features
- 📱 Mobile-first dashboard
- 📋 View visit history
- 💊 Access prescriptions
- 📅 Track follow-ups
- 👤 Profile management

### Admin Features
- 📊 System dashboard with analytics
- 👨‍⚕️ Doctor management (view, block/unblock)
- 👥 Patient management (view, block/unblock)
- 📈 System statistics

## 🛠 Tech Stack

- **React 18.3**: Latest React with hooks
- **Vite 5.2**: Lightning-fast build tool
- **Material-UI 5.15**: Professional UI components
- **React Router 6**: Client-side routing
- **Zustand 4.5**: Lightweight state management
- **Axios 1.6**: HTTP client
- **Cookies (js-cookie)**: JWT authentication
- **Date-fns 3.6**: Date formatting

## 📦 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend running on http://localhost:8080

### Installation

```bash
# Clone the repository
git clone https://github.com/snamdeo17/bharat-emr-frontend.git
cd bharat-emr-frontend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Update API endpoint if needed (default: http://localhost:8080/api)
# Edit .env file:
# VITE_API_BASE_URL=http://localhost:8080/api
```

### Running the Application

```bash
# Development server (opens http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
bharat-emr-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── api.js                 # Axios instance with interceptors
│   │   ├── authService.js         # Auth API calls
│   │   ├── doctorService.js       # Doctor API calls
│   │   ├── patientService.js      # Patient API calls
│   │   └── adminService.js        # Admin API calls
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   ├── LoadingSpinner.jsx # Loading indicator
│   │   │   └── Toast.jsx          # Notification system
│   │   ├── doctor/                # Doctor-specific components
│   │   ├── patient/               # Patient-specific components
│   │   └── admin/                 # Admin-specific components
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── DoctorRegister.jsx
│   │   │   └── OTPVerification.jsx
│   │   ├── doctor/
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── PatientManagement.jsx
│   │   │   ├── CreateVisit.jsx
│   │   │   ├── VisitDetails.jsx
│   │   │   └── DoctorProfile.jsx
│   │   ├── patient/
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── MyVisits.jsx
│   │   │   ├── MyPrescriptions.jsx
│   │   │   └── PatientProfile.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── ManageDoctors.jsx
│   │       └── ManagePatients.jsx
│   ├── store/
│   │   ├── authStore.js           # Auth state management
│   │   └── toastStore.js          # Toast state management
│   ├── utils/
│   │   ├── constants.js           # App constants
│   │   └── helpers.js             # Utility functions
│   ├── App.jsx                    # Main app component
│   ├── index.jsx                  # Entry point
│   └── index.css                  # Global styles
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore file
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

## 🔐 Authentication

The application uses JWT token-based authentication with OTP verification:

1. **OTP Generation**: User requests OTP via mobile number
2. **OTP Verification**: User verifies OTP
3. **Token Generation**: Server returns JWT token
4. **Token Storage**: Token stored in secure HTTP-only cookies
5. **Auto-Logout**: Automatic logout on 401 response

## 📡 API Integration

All API calls are made through service files in `/src/api/`:

```javascript
// Example: Doctor Login
import { authService } from '../api/authService';

const { user, token } = await authService.loginDoctor(mobileNumber, otp);
```

## 🎨 UI/UX Features

- ✅ Material Design principles
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/Light theme support
- ✅ Toast notifications
- ✅ Loading spinners
- ✅ Form validation
- ✅ Error handling
- ✅ Smooth animations

## 🔄 State Management

The app uses **Zustand** for lightweight state management:

```javascript
// Auth Store
const { user, token, setAuth, logout } = useAuthStore();

// Toast Store  
const { showToast } = useToastStore();
```

## 📝 Environment Variables

Create `.env` file based on `.env.example`:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Bharat EMR
VITE_JWT_COOKIE_NAME=bharatemr_token
VITE_USER_COOKIE_NAME=bharatemr_user
```

## 🚀 Deployment

### Build
```bash
npm run build
```

This generates optimized files in the `build/` directory.

### Hosting Options
- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop `build/` folder
- **GitHub Pages**: Configure in settings
- **Traditional Server**: Deploy `build/` files

## 🤝 Integration with Backend

Make sure your Spring Boot backend is running on `http://localhost:8080` with these endpoints:

- `POST /api/otp/send` - Send OTP
- `POST /api/otp/verify` - Verify OTP
- `POST /api/doctors/register` - Doctor registration
- `POST /api/doctors/login` - Doctor login
- `POST /api/patients/login` - Patient login
- `GET /api/doctors/profile` - Get doctor profile
- `POST /api/doctors/patients` - Onboard patient
- `GET /api/doctors/patients` - Get doctor's patients
- And more... (see backend documentation)

## 🐛 Troubleshooting

### CORS Errors
Ensure backend has CORS enabled and API base URL is correct in `.env`

### 401 Unauthorized
Token may have expired. App will auto-logout and redirect to login

### Build Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Material-UI Documentation](https://mui.com)
- [React Router Docs](https://reactrouter.com)

## 📄 License

This project is part of Bharat EMR healthcare system.

## 👨‍💻 Developer

Created for efficient Electronic Medical Records management in India.

---

**Need Help?** Check the issues tab or contact the development team.
