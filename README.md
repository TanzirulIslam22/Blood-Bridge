# 🩸 BloodBridge — Digital Blood Bank System

A full-stack **MERN (MongoDB + Express + React + Node.js)** blood donation platform designed to make blood discovery, donation management, and donor engagement **faster, smarter, and more accessible**.

🌐 **Full English ↔ বাংলা bilingual support** with automatic Bengali font switching.

---

## 🌐 Live Demo

- **Frontend (live site):** https://blood-bridge-orcin.vercel.app
- **Backend API:** https://bloodbridge-server-pi.vercel.app

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Public Features](#-public-features)
- [Authentication & Security](#-authentication--security)
- [Donor Dashboard](#-donor-dashboard)
- [Blood Donation Camp Management](#-blood-donation-camp-management)
- [Admin Panel](#-admin-panel)
- [Gamification System](#-gamification-system)
- [Smart Blood Compatibility](#-smart-blood-compatibility)
- [Donation Workflow](#-donation-workflow)
- [Bilingual Experience](#-bilingual-experience)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Backend & API](#-backend--api)
- [Seed Data](#-seed-data)
- [Dependencies](#-dependencies)
- [Authors](#-authors)
- [License](#-license)

---

## ✨ Features

### 🛠️ Tech Stack

- ⚛️ **Frontend:** React 18, Vite 5, Tailwind CSS 4, React Router 7
- 🔐 **Authentication:** Firebase Auth + JWT
- 🖥️ **Backend:** Node.js, Express 4, Mongoose 8
- 🗄️ **Database:** MongoDB Atlas
- 🧰 **Tools:** Axios, React Hot Toast, SweetAlert2, React Quill, QRCode
- 👥 **Roles:** Admin, Volunteer, Donor

### 🌍 Public Features

- 🏠 Interactive landing page with blood-type ticker, statistics, features & urgent requests
- 🩸 Browse and filter blood donation requests by blood group, district & status
- 📄 Detailed blood request pages with **Donate Now** functionality
- 🔍 **Smart Donor Search** with blood group, district & upazila filters
- 🧬 Exact vs. compatible blood matching with match scores & reasons
- ⭐ Universal donor **O−** identification
- ⏳ Donor availability based on the **90-day donation cooldown**
- 🏕️ Browse upcoming and ongoing **Blood Donation Camps**
- 📝 Camp details with live registration counts
- ❤️ Interactive **Health Eligibility Check**
- 📰 Blood donation awareness **Blog**
- 📜 Publicly verifiable **Donation Certificates**
- 🔳 Certificate verification through **QR Code**
- 🚫 Custom 404 page

### 🔐 Authentication & Security

- 🔑 Firebase Google Login
- 📧 Email & Password Registration
- 🎫 Custom **JWT authentication** with 7-day tokens
- 🛡️ Protected routes with PrivateRoute
- 🚫 Blocked-user enforcement
- 👮 Role-Based Access Control across API endpoints

### 👤 Donor Dashboard

- 📊 Role-based dashboard
- 🏆 Donor rank, points & leaderboard position
- 🩸 Donation count & history
- 🏅 Badges and achievements
- 👤 Complete profile management
- 📸 Profile photo upload
- 📍 Blood group, district & upazila information
- ⚖️ Height, weight, age & institution details
- ⏳ 90-day cooldown progress with next eligible date
- 📋 Create, edit, delete & track blood requests
- 🏕️ View organized and registered camps

### 🏕️ Blood Donation Camp Management

- ➕ Create donation camps
- 🖼️ Camp thumbnail, location, date/time & blood target
- 📝 Camp registration
- 👥 View camp registrations
- ✅ Mark attendance
- ❌ Cancel registrations
- ✏️ Update & delete camps
- 🔐 Organizer/Admin-only management

### 👑 Admin Panel

- 👥 Paginated user management
- 🚫 Block/Unblock users
- 🔄 Change user roles
- 🗑️ Delete users
- 🩸 Monitor all blood requests
- 🔄 Manage request statuses
- 📰 Blog & content management
- ✏️ Create and edit blogs with rich-text editor
- 📢 Publish/Unpublish articles
- 🗑️ Delete content

### 🏆 Gamification System

- ⭐ **Points System**

  - 👤 Profile completion: +10
  - 📢 Blood request: +5
  - 🏕️ Camp registration: +5
  - ✅ Camp attendance: +15
  - 🩸 Donation: +30
  - 🚨 Urgent donation: +20

- 🏅 **Donor Badges**

  - 🩸 First Blood
  - 🥉 Bronze
  - 🥈 Silver
  - 🥇 Gold
  - 💎 Platinum

- 🏆 Donor **Leaderboard** based on points & donation count

### 🧬 Smart Blood Compatibility

- 🩸 ABO + Rh compatibility engine
- 🔄 Exact & compatible donor matching
- ⭐ Universal donor/recipient detection
- 📊 Match scoring
- 📍 Location-based matching
- 💡 Match reason chips such as *Same Upazila* and *Experienced Donor*

### 🔄 Donation Workflow

**Pending → Donor Accepts → In Progress → Completed** ✅

After completion:

- 📝 Donation record is automatically created
- 📜 Certificate ID is generated
- 🔳 QR-verifiable certificate is created
- ⭐ Donor points are updated
- 🏅 Badges are updated
- ⏳ 90-day cooldown is activated

### 🌐 Bilingual Experience

- 🇬🇧 English
- 🇧🇩 বাংলা
- 🔄 Language toggle in navbar
- 💾 Language preference saved in localStorage
- 🔤 Automatic Bengali font switching
- 🌍 Translation across **all pages and components**

---

## 📁 Project Structure

```
BloodBridge/
├── BloodBridge-client/            # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/            # Navbar, Footer, PrivateRoute, DashboardLayout...
│   │   ├── context/               # AuthContext, LanguageContext
│   │   ├── data/                  # Bangladesh districts & upazilas
│   │   ├── firebase/              # Firebase configuration
│   │   ├── hooks/                 # useAxios (JWT interceptor)
│   │   ├── i18n/                  # en.js, bn.js translation files
│   │   ├── pages/                 # Home, Login, Register, AllRequests...
│   │   │   └── dashboard/         # Profile, Leaderboard, Admin pages...
│   │   ├── utils/                 # imgbbUpload, bloodCompatibility
│   │   ├── main.jsx               # App entry & routing
│   │   └── style.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── BloodBridge-server/            # Node.js / Express backend
│   ├── api/index.js
│   ├── middleware/                # verifyToken (JWT)
│   ├── models/                    # User, DonationRequest, DonationCamp...
│   ├── routes/                    # auth, users, donationRequests, blogs...
│   ├── utils/                     # gamification, bloodCompatibility
│   ├── server.js                  # Express server
│   ├── seed.js                    # Dummy data seed script
│   └── .env.example
│
└── LICENSE
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **npm**
- A **MongoDB Atlas** cluster (or local MongoDB)
- A **Firebase** project (for Authentication)
- An **imgbb** API key (for profile photo uploads)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/bloodbridge.git
cd BloodBridge
```

### 2. Install dependencies

```bash
# Backend
cd BloodBridge-server
npm install

# Frontend
cd ../BloodBridge-client
npm install
```

### 3. Configure environment variables

Copy the `.env.example` files and fill in your credentials.

**Server** (`BloodBridge-server/.env`):

```env
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your-super-secret-key
PORT=5000
```

**Client** (`BloodBridge-client/.env`):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_IMGBB_API_KEY=
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Run the application

```bash
# Start the backend server (on http://localhost:5000)
cd BloodBridge-server
npm run dev

# Start the frontend (in a new terminal, on http://localhost:5173)
cd BloodBridge-client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. 🎉

### 5. (Optional) Load dummy data

```bash
cd BloodBridge-server
node seed.js --force
```

---

## 📋 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Server |
| `JWT_SECRET` | Secret key for signing JWT tokens | ✅ Server |
| `PORT` | Backend server port (default `5000`) | ❌ Server |
| `VITE_FIREBASE_API_KEY` | Firebase API key | ✅ Client |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ Client |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ Client |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ Client |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | ✅ Client |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | ✅ Client |
| `VITE_IMGBB_API_KEY` | imgbb API key for photo uploads | ✅ Client |
| `VITE_API_BASE_URL` | Backend API base URL | ✅ Client |

---

## ⚙️ Backend & API

- 🔗 REST APIs for:

  - `/api/auth`
  - `/api/users`
  - `/api/donationRequests`
  - `/api/donationCamps`
  - `/api/donationRecords`
  - `/api/blogs`
  - `/api/stats`
  - `/api/health`

- 🔐 JWT middleware
- 👮 Role authorization
- 🗄️ MongoDB Atlas integration
- 🌱 Database seed script with realistic Bangladeshi sample data

---

## 🌱 Seed Data

The project includes:

- 👥 **17 users** — 15 donors, 1 volunteer & 1 admin
- 🩸 **12 blood requests**
- 📋 **4 donation records**
- 🏕️ **6 donation camps**
- 👥 **13 camp registrations**
- 📰 **5 blog posts**
- 🏆 Realistic donor rankings and activity data

---

## 📦 Dependencies

### Client (`BloodBridge-client/package.json`)

| Package | Purpose |
|---|---|
| `react` / `react-dom` | UI library |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP requests |
| `firebase` | Authentication |
| `react-hot-toast` | Toast notifications |
| `sweetalert2` | Alert dialogs |
| `react-quill` | Rich-text blog editor |
| `qrcode.react` | QR code generation |
| `react-icons` | Icons |
| `vite` | Build tool & dev server |
| `tailwindcss` | Styling |

### Server (`BloodBridge-server/package.json`)

| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT signing/verification |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variables |

---

## 🧑‍💻 Authors

- **Tanzirul Islam** — ID: `2203054` — Author & Lead Developer — Department of CSE, RUET
- **Yeanur Hossain** — ID: `2203027` — Co-Author & Contributor — Department of CSE, RUET
- **Md. Emon Islam** — ID: `2203020` — Co-Author & Contributor — Department of CSE, RUET

### 🎓 Supervised By

- **Dr. Md. Rabiul Islam** — Professor, Department of CSE, RUET

> BloodBridge is a course project developed for **CSE 3100 — Web Based Application Project** at **RUET**.

---

## 🚨 Live Deployment — Google Sign-in Fix

If Google login fails on the deployed site with `auth/unauthorized-domain`, the Vercel domain is not whitelisted in Firebase. Add every public domain the app runs on (e.g. `blood-bridge-orcin.vercel.app`) to:

**Firebase Console → your project → Authentication → Settings → Authorized domains**

The list is currently `localhost`, `blood-bridge-4e78d.firebaseapp.com`, `blood-bridge-4e78d.web.app`, and `bloodbridge-client-ten.vercel.app`. The production domain must be added for Google login to work.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

💻 **BloodBridge brings together donor discovery, emergency blood requests, donation camps, health checks, gamification, certificates, and bilingual accessibility into one platform.**

🚀 **Still improving. More features and refinements are coming soon!**

#BloodBridge #BloodDonation #DigitalBloodBank #MERN #MERNStack #ReactJS #NodeJS #MongoDB #ExpressJS #JavaScript #WebDevelopment #FullStackDevelopment #RUET #CSE3100 #Bangladesh #OpenSource #SoftwareEngineering
