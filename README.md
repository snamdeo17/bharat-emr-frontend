# Bharat EMR - Web Application

A modern, production-ready web application for electronic medical records management, built with React and Vite.

## 🚀 Features

### For Doctors
- ✅ Secure OTP-based authentication
- ✅ Patient management dashboard
- ✅ Digital prescription creation
- ✅ Visit history tracking
- ✅ Follow-up scheduling
- ✅ Real-time statistics

### For Patients
- ✅ Access medical records anytime
- ✅ View prescription history
- ✅ Download prescriptions
- ✅ Track upcoming appointments
- ✅ Secure data access

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Modern CSS with custom design system
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Forms:** Formik + Yup
- **Date Utilities:** date-fns

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your API URL:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🌐 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## 📱 Features Overview

### Authentication
- OTP-based secure login
- Role-based access control (Doctor/Patient)
- Session management with JWT

### Doctor Dashboard
- Patient statistics
- Recent patient list
- Quick actions for common tasks
- Responsive design

### Patient Dashboard
- Visit history
- Upcoming follow-ups
- Prescription downloads
- Medical record access

## 🎨 Design System

The application uses a custom design system with:
- Modern color palette optimized for healthcare
- Responsive grid system
- Reusable component classes
- Smooth animations and transitions
- Accessibility-first approach

## 🔒 Security

- JWT-based authentication
- Secure HTTP-only cookies
- CORS protection
- Input validation
- XSS protection

## 📄 License

MIT License - see LICENSE file for details

## 👥 Support

For support: support@bharatemr.com

---

**Built with ❤️ for Indian Healthcare**
