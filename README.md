# 🏥 CareCell Network

> **AI-powered, offline-friendly, Hindi-first digital companion for cancer patients in India**

[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-green)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📖 Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Environment Variables](#environment-variables)
6. [API Documentation](#api-documentation)
7. [Frontend Pages](#frontend-pages)
8. [Deployment](#deployment)
9. [Scaling for 10,000 Users](#scaling)
10. [Tech Stack](#tech-stack)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🪪 **Patient Health Card** | Digital ID with QR code — blood group, allergies, emergency contacts |
| 🚨 **Emergency Mode** | One-tap nearest oncology hospital, blood bank, ambulance |
| 🩸 **Blood & Platelet Donors** | AI-matched donor search + Village Blood Circle |
| 🏥 **Hospital Finder** | Filter by distance, cost, government/private, OPD status |
| 🤖 **AI Medical Explainer** | Hindi explanations of medical terms & consent forms (Claude AI) |
| 📅 **Treatment Tracker** | Reminders for chemo, surgery, follow-ups — works offline |
| 🥗 **Nutrition Guide** | Cancer-type & phase specific Hindi diet plans |
| 💰 **Financial Schemes** | Government & NGO schemes filterable by state and cancer type |
| 😊 **Daily Check-in** | AI-monitored symptom check with emergency escalation |
| 🌐 **Hindi-first** | Full Hindi + English bilingual UI |

---

## 🏗️ Architecture

```
carecell/
├── backend/                    # Node.js + Express API
│   ├── server.js               # Main entry point
│   ├── config/db.js            # MongoDB connection
│   ├── middleware/auth.js      # JWT authentication
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js             # Patient/Donor/Caregiver   //  caregiver need to be remove 
│   │   ├── BloodRequest.js     # Blood requests
│   │   ├── Treatment.js        # Treatment tracker         // need to be remove 
│   │   └── Checkin.js          # Daily check-ins
│   └── routes/                 # REST API routes
│       ├── auth.js             # Register/Login
│       ├── patients.js       mujhe karna bau     # Health card + QR
│       ├── donors.js           # Donor profiles
│       ├── hospitals.js        # Hospital search
│       ├── bloodRequests.js    # Blood matching
│       ├── treatments.js    owais kar rha hai     # Treatment CRUD
│       ├── nutrition.js        # Diet plans           // need to be remove 
│       ├── schemes.js     owais kar raha hai        # Financial schemes
│       ├── checkin.js          # Daily check-in       // need to be remove 
│       ├── ai.js               # Claude AI integration
│       └── emergency.js        # Emergency data
│
├── frontend/                   # React 18 + Tailwind CSS
│   ├── src/
│   │   ├── App.js              # Router setup
│   │   ├── components/
│   │   │   ├── Layout.jsx      # Nav + header + drawer
│   │   │   └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   └── authStore.js    # Zustand auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HealthCard.jsx
│   │   │   ├── EmergencyMode.jsx
│   │   │   ├── DonorProfile.jsx
│   │   │   ├── BloodRequest.jsx
│   │   │   ├── HospitalFinder.jsx
│   │   │   ├── MedicalExplainer.jsx
│   │   │   ├── TreatmentTracker.jsx
│   │   │   ├── Nutrition.jsx
│   │   │   ├── Schemes.jsx
│   │   │   ├── DailyCheckin.jsx
│   │   │   └── Profile.jsx
│   │   └── utils/api.js        # Axios API layer
│   └── package.json
│
├── scripts/setup.js            # First-time setup
└── package.json                # Root scripts
```

---

## 📋 Prerequisites

- **Node.js** v20+ ([download](https://nodejs.org))
- **npm** v10+ (comes with Node.js)
- **MongoDB** v7+ ([download](https://mongodb.com/try/download/community)) *(optional — app runs in demo mode without it)*
- **Anthropic API Key** ([get one](https://console.anthropic.com)) *(optional — AI features use mock responses without it)*

---

## 🚀 Quick Start

### Step 1: Clone / Download

```bash
# If using git
git clone https://github.com/yourorg/carecell-network.git
cd carecell-network

# Or extract the downloaded zip and cd into the folder
cd carecell
```

### Step 2: Run Setup

```bash
node scripts/setup.js
```

This creates `backend/.env` and `frontend/.env` from examples.

### Step 3: Install Dependencies

```bash
npm run install:all
```

This installs all backend + frontend packages (~2-3 minutes).

### Step 4: Configure API Keys (Optional but Recommended)

Edit `backend/.env`:

```env
# For AI features (medical term explainer, buddy check-in):
ANTHROPIC_API_KEY=sk-ant-your-key-here

# For persistent data (app works without this — uses in-memory demo data):
MONGO_URI=mongodb://localhost:27017/carecell

# Change this in production!
JWT_SECRET=your-super-secret-key-min-32-chars
```

### Step 5: Start Development Servers

```bash
npm run dev
```

This starts:
- **Backend API** → http://localhost:5000
- **Frontend App** → http://localhost:3000

### Step 6: Open App

Navigate to **http://localhost:3000**

Click **"Try Demo / डेमो देखें"** to explore without registering.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | API port (default: 5000) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGO_URI` | No* | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Secret for JWT tokens (min 32 chars) |
| `JWT_EXPIRE` | No | Token expiry (default: 30d) |
| `ANTHROPIC_API_KEY` | No* | For AI medical explainer + check-in |
| `CLIENT_URL` | No | Frontend URL for CORS (default: http://localhost:3000) |
| `SMTP_HOST` | No | For email notifications |
| `SMTP_USER` | No | Email username |
| `SMTP_PASS` | No | Email app password |

*App works in demo mode without these but has limited persistence.

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | No | Backend URL (default: http://localhost:5000/api) |
| `REACT_APP_GOOGLE_MAPS_KEY` | No | For embedded maps directions |

---

## 📡 API Documentation

### Base URL
`http://localhost:5000/api`

### Authentication
All protected routes require: `Authorization: Bearer <token>`

### Endpoints

#### 🔐 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get current user |
| PUT | `/auth/profile` | Update profile |

**Register payload:**
```json
{
  "name": "Ramesh Kumar",
  "phone": "9876543210",
  "password": "securepass123",
  "role": "patient",
  "language": "hindi"
}
```

#### 🪪 Patient Health Card
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patients/health-card` | Get health card |
| POST | `/patients/health-card` | Create/update health card |
| GET | `/patients/qr/:patientId` | Public QR scan endpoint |

**Save Health Card payload:**
```json
{
  "bloodGroup": "A",
  "rhFactor": "+",
  "cancerType": "Breast Cancer",
  "cancerStage": "Stage II",
  "allergies": ["Penicillin", "Shellfish"],
  "emergencyContacts": [
    { "name": "Priya Kumar", "phone": "9876543211", "relation": "Wife" }
  ],
  "hospitalName": "Tata Memorial Hospital",
  "doctorName": "Dr. R. Badwe"
}
```

#### 🩸 Blood Donors
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/donors/register` | Register as donor |
| GET | `/donors/search` | Search donors (params: bloodGroup, radius, type) |
| PUT | `/donors/availability` | Update availability |

#### 🏥 Hospitals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hospitals` | List hospitals (params: search, type, costLevel, radius, opdToday) |
| GET | `/hospitals/:id` | Get hospital details |
| GET | `/hospitals/emergency/nearest` | Nearest for emergency |

#### 💊 Treatments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/treatments` | Add treatment |
| GET | `/treatments` | List treatments |
| PUT | `/treatments/:id` | Update treatment |
| DELETE | `/treatments/:id` | Delete treatment |

#### 😊 Daily Check-in
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/checkin` | Submit check-in |
| GET | `/checkin/history` | Get history |

**Check-in payload:**
```json
{
  "wellbeing": 3,
  "symptoms": {
    "fever": { "present": true, "severity": "high" },
    "vomiting": { "present": false },
    "bleeding": { "present": false }
  },
  "notes": "Feeling tired today"
}
```

#### 🤖 AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/explain-term` | Explain medical term in Hindi |
| POST | `/ai/explain-consent` | Simplify consent form text |
| POST | `/ai/buddy-assessment` | AI check-in assessment |

---

## 📱 Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Phone + password login |
| `/register` | Register | New user registration |
| `/dashboard` | Dashboard | Home with quick actions + upcoming treatments |
| `/health-card` | Health Card | Create/edit digital ID + QR code |
| `/emergency` | Emergency Mode | One-tap hospital/ambulance navigation |
| `/checkin` | Daily Check-in | 3-step symptom tracker with AI risk assessment |
| `/blood-request` | Blood Request | Create requests + search donors |
| `/donor` | Donor Profile | Register as blood/platelet donor |
| `/hospitals` | Hospital Finder | Search oncology hospitals with filters |
| `/explain` | AI Explainer | Hindi medical term & consent form explainer |
| `/treatments` | Treatment Tracker | Calendar + CRUD for treatments |
| `/nutrition` | Nutrition | Cancer-specific diet plans in Hindi |
| `/schemes` | Financial Help | Government scheme finder by state |
| `/profile` | Profile | Account settings + logout |

---

## 🚀 Deployment

### Backend (Node.js) — Railway / Render / Heroku

```bash
# Set environment variables in dashboard:
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/carecell
JWT_SECRET=your-production-secret-min-32-chars
ANTHROPIC_API_KEY=sk-ant-your-key
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend (React) — Vercel / Netlify

```bash
# Build command:
npm run build --prefix frontend

# Publish directory:
frontend/build

# Environment variables:
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### Docker (Full Stack)

```bash
# Add docker-compose.yml for containerized deployment
docker-compose up -d
```

### MongoDB Atlas (Cloud)

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user + get connection string
3. Set `MONGO_URI=mongodb+srv://...` in backend `.env`

---

## 📈 Scaling for 10,000 Users

The app is architected for production scale:

### Database
- **MongoDB Atlas M10+** cluster with auto-scaling
- **Indexes** on: `User.phone`, `User.donorProfile.bloodGroup`, `BloodRequest.status+location`
- **Connection pooling**: `maxPoolSize: 10` (increase to 50+ for production)

### API
- **Rate limiting**: 100 req/15 min per IP (configurable)
- **Helmet.js** security headers
- **Compression** middleware (gzip)
- **PM2** for process management:
  ```bash
  npm install -g pm2
  pm2 start backend/server.js --name carecell-api -i max
  ```

### Frontend
- **React lazy loading** — each page code-splits automatically
- **CDN deployment** on Vercel/Cloudflare
- **Service Worker** for offline support (add PWA manifest)

### Caching (Add for production)
```javascript
// Redis caching for hospital/scheme data
npm install ioredis
// Cache hospital list for 1 hour
// Cache scheme list for 24 hours
```

### Monitoring
- **Morgan** request logging (already included)
- Add **Sentry** for error tracking
- Add **MongoDB Atlas monitoring** for slow queries

---

## 🛠️ Tech Stack

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| express | 4.19 | Web framework |
| mongoose | 8.5 | MongoDB ODM |
| jsonwebtoken | 9.0 | JWT authentication |
| bcryptjs | 2.4 | Password hashing |
| qrcode | 1.5 | QR code generation |
| helmet | 7.1 | Security headers |
| express-rate-limit | 7.4 | Rate limiting |
| express-mongo-sanitize | 2.2 | NoSQL injection prevention |
| compression | 1.7 | Gzip responses |
| dotenv | 16.4 | Environment variables |

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3 | UI framework |
| react-router-dom | 6.26 | Routing |
| zustand | 4.5 | State management |
| framer-motion | 11.3 | Animations |
| axios | 1.7 | HTTP client |
| react-hot-toast | 2.4 | Notifications |
| qrcode.react | 3.1 | QR code display |
| react-icons | 5.3 | Icon library |
| date-fns | 3.6 | Date utilities |
| tailwindcss | 3.4 | Utility CSS |
| html2canvas | 1.4 | Health card download |

### AI
- **Anthropic Claude** (claude-sonnet-4-20250514) for:
  - Medical term explanation in Hindi
  - Consent form simplification
  - Daily check-in assessment

---

## 🔒 Security Features

- ✅ JWT authentication with 30-day expiry
- ✅ Bcrypt password hashing (salt rounds: 12)
- ✅ Rate limiting (100 req/15min, 20 for auth)
- ✅ MongoDB query sanitization (prevents NoSQL injection)
- ✅ Helmet.js security headers
- ✅ CORS restricted to frontend origin
- ✅ Input validation with express-validator
- ✅ Request body size limit (10MB)
- ✅ No full records shared without patient consent

---

## 🌐 Offline Support

These features work without internet:
- Patient health card (stored locally after first load)
- Treatment reminders (stored in device)
- Diet guidance (downloadable offline pages)
- Emergency phone numbers (hardcoded as fallback)
- Basic AI explanations (mock responses when API unavailable)

---

## 📞 Support

**Emergency (India):** 108 (Ambulance), 112 (National Emergency)  
**Cancer Helpline:** 1800-11-1234  

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

*Built with ❤️ for cancer patients across India*  
*कैंसर मरीजों के लिए प्यार से बनाया गया*
