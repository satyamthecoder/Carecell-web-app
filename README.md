<div align="center">

# 🎗️ CareCell

### *A Hindi-First Digital Companion for Cancer Patients in India*

[![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge)](https://github.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

<br/>

> *कैंसर मरीजों के लिए प्यार से बनाया गया*
> *Built with ❤️ for cancer patients across India*

<br/>

**CareCell** combines patient support workflows, donor coordination, emergency access, treatment tracking, and AI-assisted medical explanation — all in a single full-stack web application designed for real Indian healthcare journeys.

</div>

---

## 🌟 Overview

CareCell is built around the practical, day-to-day needs of Indian cancer patients and their caregivers:

- 🪪 **Digital health card** with public QR access for emergency sharing
- 🚨 **Emergency mode** with helpline shortcuts and nearby hospital discovery
- 🩸 **Blood request & donor network** for community-powered care
- 🤖 **AI medical explainer** for consent forms, reports, and medical terms — in Hindi
- 📋 **Daily symptom check-in** with risk scoring
- 💊 **Treatment tracker** for upcoming and completed care events
- 🏛️ **Government & NGO scheme discovery** for financial support
- 💰 **Patient help/donation request flow** with admin approval UI

---

## ✨ Key Features

| 🏥 Area | 💡 Capability |
|---|---|
| **Patient Support** | Health card, treatment tracking, daily check-in, hospital finder |
| **Emergency Care** | One-tap helpline access and nearest-hospital lookup |
| **Donor Network** | Donor registration, donor search, blood request response flow |
| **AI Support** | Hindi-first explanation of medical terms and consent/report text |
| **Financial Access** | Scheme discovery and help request submission |
| **Indian Context** | Hindi-first UI, Indian emergency numbers, cancer-care use cases |

---

## 🛠️ Tech Stack

### 🎨 Frontend

| Technology | Purpose |
|---|---|
| ⚛️ React 18 | Core UI framework |
| 🗺️ React Router | Client-side routing |
| 🐻 Zustand | Global state management |
| 📡 Axios | HTTP client |
| 🎨 Tailwind CSS | Utility-first styling |
| 🎬 Framer Motion | Animations |
| 🔲 `qrcode.react` | QR code generation |
| 📄 `html2canvas` + `jspdf` | PDF export |

### ⚙️ Backend

| Technology | Purpose |
|---|---|
| 🟢 Node.js + Express | API server |
| 🍃 MongoDB + Mongoose | Database & ODM |
| 🔐 JWT + `bcryptjs` | Authentication & hashing |
| 🛡️ `helmet` | Security headers |
| 🚦 `express-rate-limit` | API rate limiting |
| 🧹 `express-mongo-sanitize` | Query sanitization |
| 🤖 `groq-sdk` | AI explainer integration |
| 📧 `nodemailer` | Email utilities |

---

## 🗂️ Repository Architecture

```text
Carecell-web-app/
├── 🖥️  backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   └── auth.js                # JWT auth & role checks
│   ├── models/
│   │   ├── BloodRequest.js
│   │   ├── Checkin.js
│   │   ├── Donation.js
│   │   ├── HealthCard.js
│   │   ├── Hospital.js
│   │   ├── Patient.js
│   │   ├── Scheme.js
│   │   ├── Treatment.js
│   │   └── User.js
│   ├── routes/
│   │   ├── ai.js
│   │   ├── auth.js
│   │   ├── bloodRequests.js
│   │   ├── donations.js
│   │   ├── donors.js
│   │   ├── emergency.js
│   │   ├── healthcard.js
│   │   ├── hospitals.js
│   │   ├── patient.js
│   │   ├── schemes.js
│   │   └── treatments.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── otp.js
│   │   └── sendEmail.js
│   └── server.js
│
├── 🎨  frontend/
│   ├── public/
│   │   |── index.html
|   |   └──logo.png
│   └── src/
│       ├── components/
│       │   ├── Layout.jsx
│       │   └── LoadingSpinner.jsx
|       |   └── TermsModal.jsx
│       ├── context/
│       │   └── authStore.js
│       ├── pages/
│       │   ├── AdminDonations.jsx
│       │   ├── BloodRequest.jsx
│       │   ├── DailyCheckin.jsx   // not in use 
│       │   ├── Dashboard.jsx
│       │   ├── DonorProfile.jsx
│       │   ├── EmergencyMode.jsx
│       │   ├── HealthCard.jsx
│       │   ├── HospitalFinder.jsx
│       │   ├── Login.jsx
│       │   ├── MedicalExplainer.jsx
│       │   ├── Nutrition.jsx         // not in use 
│       │   ├── Profile.jsx
│       │   ├── PublicHealthCard.jsx
│       │   ├── Register.jsx
│       │   ├── RequestHelp.jsx
│       │   ├── Schemes.jsx
|       |   |── Terms.jsx
│       │   └── TreatmentTracker.jsx
│       ├── utils/
│       │   └── api.js
│       ├── App.js
│       └── index.css
│
├── 📜  scripts/
│   └── setup.js
└── package.json
```

---

## 🏛️ Application Architecture

### 🎨 Frontend Architecture

The frontend is a React single-page application with route-based feature modules:

- **`App.js`** — defines public and protected routes
- **`authStore.js`** — stores authenticated user and token in local storage via Zustand
- **`utils/api.js`** — centralizes all backend API calls through Axios
- **`components/Layout.jsx`** — shared navigation with role-aware UI
- **`pages/`** — feature pages implementing full user flows (health card, donor profile, treatment tracking, AI explainer, and more)

### ⚙️ Backend Architecture

The backend is an Express API server organized by route modules and Mongoose models:

- **`server.js`** — boots the app, connects MongoDB, applies middleware, mounts routes
- **`config/db.js`** — handles MongoDB connection gracefully (app stays alive even if DB fails)
- **`middleware/auth.js`** — JWT-based auth protection and role checks
- **`routes/*.js`** — REST endpoints organized by feature area
- **`models/*.js`** — Mongoose persistence schemas for users, patients, requests, treatments, schemes, hospitals, and donations

### 🔄 Runtime Flow

```
① User authenticates via /api/auth/*
        ↓
② JWT stored client-side, attached automatically by Axios
        ↓
③ Feature pages call backend via utils/api.js
        ↓
④ Backend routes persist data through Mongoose
        ↓
⑤ Demo/mock fallback when MongoDB is unavailable
```

### 🖥️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│              React Web App  /  Flutter Mobile App               │
│      [Patient Flow]  [Donor Flow]  [QR Scan]  [AI Chat]  [Schemes] │
└─────────────────────────────┬───────────────────────────────────┘
                              │  HTTPS / REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION SERVER                         │
│  Auth & RBAC  │  Health Card API  │  Donor Match API            │
│  SOS/Location API  │  Scheme API  │  Consent & Log API          │
└──────────┬──────────────────┬─────────────────────┬────────────┘
           │                  │                      │
           ▼                  ▼                      ▼
┌──────────────────┐ ┌────────────────┐ ┌───────────────────────┐
│    DATABASE      │ │   AI SERVICE   │ │   COMPLIANCE LAYER    │
│  User / Health   │ │     LAYER      │ │   Consent Records     │
│  Donor Reg.      │ │  LLM API       │ │   Access Logs (180d)  │
│  Requests        │ │  (abstracted)  │ │   Breach Response     │
│  Scheme Data     │ │  Prompt Guard  │ │   Role-Based Access   │
└──────────────────┘ └────────────────┘ └───────────────────────┘
```

---

## 👥 User Roles

| Role | Description |
|---|---|
| 🧑‍⚕️ `patient` | Core app user — health card, treatments, check-ins, scheme discovery |
| 🩸 `donor` | Blood donor — registration, activation, blood request responses |

> **Note:** There is no complete server-side admin authorization model implemented across all routes yet.

---

## 📄 Frontend Pages

| 🔗 Route | 📄 Page | 📝 Purpose |
|---|---|---|
| `/login` | Login | User login with phone and password |
| `/register` | Register | New user registration |
| `/public-healthcard/:userId` | Public Health Card | Public QR-linked emergency card |
| `/dashboard` | Dashboard | Main patient home and quick actions |
| `/health-card` | Health Card | Card display and PDF export |
| `/emergency` | Emergency Mode | Emergency numbers and nearby hospitals |
| `/donor` | Donor Profile | Donor registration and status actions |
| `/blood-request` | Blood Request | Request blood and search donors |
| `/hospitals` | Hospital Finder | Nearby hospital lookup |
| `/AI_explain` | Medical Explainer | AI explanation of terms and reports |
| `/treatments` | Treatment Tracker | Create and manage treatments |
| `/schemes` | Schemes | Search support schemes |
| `/profile` | Profile | Account/profile settings |
| `/request-help` | Request Help | Submit a financial help/donation request |
| `/admin-donations` | Admin Donations | Approve submitted help requests |

---

## 🔌 Backend API Reference

**Base URL:**
```
http://localhost:5000/api
```

**Protected routes require:**
```
Authorization: Bearer <token>
```

### 🟢 Health
| Method | Route | Purpose |
|---|---|---|
| `GET` | `/health` | API health check |

### 🔐 Auth
| Method | Route | Purpose |
|---|---|---|
| `POST` | `/auth/register` | Register patient or donor |
| `POST` | `/auth/login` | Login and receive JWT |
| `GET` | `/auth/me` | Get current authenticated user |
| `PUT` | `/auth/profile` | Update user profile |
| `PUT` | `/auth/donor-profile` | Update donor profile |

### 🧑‍⚕️ Patient
| Method | Route | Purpose |
|---|---|---|
| `POST` | `/patient` | Create or update patient profile |
| `GET` | `/patient/:userId` | Get patient profile by user ID |

### 🪪 Health Card
| Method | Route | Purpose |
|---|---|---|
| `GET` | `/healthcard/:userId` | Get health card data |
| `GET` | `/healthcard/public/:userId` | Public emergency-safe card payload |

### 🩸 Donors
| Method | Route | Purpose |
|---|---|---|
| `POST` | `/donors/register` | Register or update donor profile |
| `POST` | `/donors/toggle-active` | Enable or disable active donor status |
| `GET` | `/donors/search` | Search donors by blood group, city, or location |
| `PUT` | `/donors/availability` | Update donor availability |

### 🏥 Hospitals
| Method | Route | Purpose |
|---|---|---|
| `GET` | `/hospitals/nearby` | Find nearby hospitals using `lat` and `lng` |

### 🆘 Blood Requests
| Method | Route | Purpose |
|---|---|---|
| `POST` | `/blood-requests` | Create a blood request |
| `GET` | `/blood-requests` | Get current user's requests |
| `GET` | `/blood-requests/active` | List active requests for donors |
| `POST` | `/blood-requests/:id/respond` | Respond to a blood request |

### 💊 Treatments
| Method | Route | Purpose |
|---|---|---|
| `POST` | `/treatments` | Create treatment |
| `GET` | `/treatments` | Get treatments |
| `PUT` | `/treatments/:id` | Update treatment |
| `DELETE` | `/treatments/:id` | Delete treatment |

### 🤖 AI
| Method | Route | Purpose |
|---|---|---|
| `POST` | `/ai/explain-term` | Explain a medical term |
| `POST` | `/ai/explain-consent` | Explain consent/report text |

### 🚨 Emergency
| Method | Route | Purpose |
|---|---|---|
| `GET` | `/emergency/nearest` | Return emergency guidance payload |
| `GET` | `/emergency/helplines` | Return emergency helpline list |

### 🏛️ Schemes
| Method | Route | Purpose |
|---|---|---|
| `GET` | `/schemes` | Search schemes using filters |
| `POST` | `/schemes/check-eligibility` | Evaluate eligibility and ranking |

### 💰 Donations / Help Requests
| Method | Route | Purpose |
|---|---|---|
| `POST` | `/donations` | Submit a help request |
| `GET` | `/donations` | Get approved requests (or all with `?all=true`) |
| `PATCH` | `/donations/:id/approve` | Approve a help request |

---

## ⚙️ Environment Variables

### 🖥️ Backend

| Variable | Purpose |
|---|---|
| `PORT` | Backend port |
| `NODE_ENV` | Runtime environment |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRE` | JWT lifetime |
| `GROQ_API_KEY` | AI explainer integration |
| `CLIENT_URL` | Preferred CORS origin |
| `SMTP_HOST` | Email utility host |
| `SMTP_PORT` | Email utility port |
| `SMTP_USER` | Email username |
| `SMTP_PASS` | Email password |
| `GOOGLE_MAPS_API_KEY` | Present in `.env`, not actively used by current backend |
| `RATE_LIMIT_WINDOW_MS` | API rate-limit window |
| `RATE_LIMIT_MAX` | API rate-limit max requests |

### 🎨 Frontend

| Variable | Purpose |
|---|---|
| `REACT_APP_API_URL` | Frontend backend base URL |

---

## 🚀 Quick Start

### 📋 Prerequisites

- Node.js
- npm
- MongoDB *(optional — some flows work without it)*

### 📦 Install Dependencies

```bash
npm run install:all
```

### 🔧 Create Environment Files

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/carecell
JWT_SECRET=change_this_secret
JWT_EXPIRE=30d
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### ▶️ Start Development

```bash
npm run dev
```

This starts:
- 🎨 **Frontend** at `http://localhost:3000`
- ⚙️ **Backend** at `http://localhost:5000`

---

## 🎭 Demo-Friendly Behavior

CareCell includes partial demo support out of the box:

- ✅ MongoDB connection failure does **not** crash the backend
- ✅ Some routes fall back to in-memory/demo responses
- ✅ Login UI includes a demo path
- ✅ Emergency helplines remain usable regardless of backend state

> This is demo-friendly but not a full offline-first PWA implementation.

---

## 🔒 Security

### ✅ Implemented
- JWT authentication
- Password hashing with `bcryptjs`
- API rate limiting
- `helmet` security headers
- MongoDB query sanitization
- Request logging with `morgan`

### ⚠️ Production Caveats
- Donation approval endpoints are **not** protected by role-based server authorization
- CORS includes a permissive fallback in `backend/server.js`

---

## 🚢 Deployment

### ⚙️ Backend
```bash
npm --prefix backend start
```

### 🎨 Frontend
```bash
npm --prefix frontend build
```
Deploy `frontend/build` to any static host and point `REACT_APP_API_URL` to the backend base URL.

---

## 📈 Scaling Notes

For production growth toward larger traffic:

- 📊 Add proper MongoDB indexes for donor, request, and scheme queries
- 🗺️ Move distance filtering to geospatial DB queries
- 🔐 Tighten authorization around admin-style actions
- 📡 Add monitoring and structured error tracking
- ⚡ Add caching for AI-heavy and search-heavy flows

---

## ⚠️ Known Gaps

| Gap | Details |
|---|---|
| 🥗 Nutrition routes | Frontend has a Nutrition page; backend does not mount nutrition routes |
| 🤖 AI buddy assessment | Frontend references `POST /api/ai/buddy-assessment`; backend doesn't implement it |
| 📄 `.env.example` | `scripts/setup.js` expects a backend env example file that is not present |

---

## 🆘 Emergency Numbers

```
🚑  Ambulance            →  108
🆘  National Emergency   →  112
🎗️  Cancer Helpline      →  1800-11-1234
```

---

<div align="center">

## 🤝 Support

For repository support, open an [issue](https://github.com).

<br/>

---

*Built with ❤️ for cancer patients across India*

**🎗️ कैंसर मरीजों के लिए प्यार से बनाया गया 🎗️**

</div>
