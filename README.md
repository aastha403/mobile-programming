# HealthChecker Application

A comprehensive health tracking application with Firebase integration, available for both web and mobile.

## Project Structure

```
health-checker/
├── app/                    # React Native/Expo Mobile App
│   ├── index.tsx          # Main app with Firebase authentication & CRUD
│   ├── _layout.tsx        # Navigation layout
│   ├── explore.tsx        # Explore screen
│   └── app.js             # Alternative app version
│
├── web/                   # Web-based Applications
│   ├── firebase.html      # Simple form-based interface
│   ├── final.html         # Professional multi-screen SPA
│   └── README.md          # Web app documentation
│
├── components/            # React components
├── constants/             # App constants
├── hooks/                 # Custom React hooks
└── package.json           # Dependencies
```

## Getting Started

### Web Apps (Easiest)

Simply open the HTML files in your browser - **NO BUILD NEEDED!**

1. **web/final.html** - Full-featured SPA with authentication
   - Sign Up / Sign In
   - Add health records
   - View/Edit/Delete records
   - Professional multi-screen UI

2. **web/firebase.html** - Simple form-based interface
   - Add health records
   - View records in table
   - Delete functionality

### Mobile App (React Native/Expo)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Follow the prompts to choose platform:
# - Press 'w' for web
# - Press 'a' for Android (requires emulator)
# - Press 'i' for iOS (macOS only)
```

## Features

✅ **Authentication**
- Firebase Email/Password Sign Up & Sign In
- Secure session management
- Auto logout

✅ **CRUD Operations**
- Create health records (name, age, email, heart rate, blood pressure)
- Read and display records in real-time
- Update record information
- Delete records with confirmation

✅ **Real-time Data**
- Real-time synchronization with Firebase
- Instant updates across all sessions
- User-scoped data (each user sees only their data)

✅ **Professional UI**
- Gradient backgrounds (#667eea → #764ba2)
- Smooth animations and transitions
- Responsive design (mobile & desktop)
- Glass morphism effects
- Clean, modern interface

## Firebase Setup

The app uses Firebase Realtime Database and Authentication:

- **Project**: mobile-programming-c6478
- **Database**: https://mobile-programming-c6478-default-rtdb.firebaseio.com
- **Auth**: Email/Password authentication

## Available Screens

### index.tsx (Mobile App)
- **Landing**: Sign Up / Sign In forms
- **Home**: Dashboard with record list and add form
- **Details**: View individual record with edit/delete options

### web/final.html (Web SPA)
- **Login**: Email/password authentication
- **Signup**: Create new account
- **Home**: Dashboard and CRUD interface
- **Details**: View record details
- **Success**: Confirmation screen

### web/firebase.html (Web Simple)
- **Form**: Add new health records
- **Table**: Display all records
- **Actions**: Delete records

## Development

### Running locally:

```bash
npm install
npm start
```

### Troubleshooting:

If you encounter port conflicts:
```
Port 8081 is being used by another process
→ Press 'y' to use port 8082 instead
```

If you have bundling errors:
```bash
npm cache clean --force
rm -r node_modules
npm install
npm start
```

## Deployment

**Web Apps**: Copy HTML files to any web server
**Mobile App**: Use Expo EAS Build for production deployment

```bash
eas build
eas submit
```

---

**Version**: 2.0.0 with Firebase Integration
**Last Updated**: December 10, 2025
**Created with**: Expo + React Native + Firebase
