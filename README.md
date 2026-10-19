# 🌿 Garbage Collection ("Spot it. Post it. Clean it together.")

> A community-powered clean-city platform where citizens photograph garbage spots, geotag them on an interactive live map, coordinate Sunday volunteer drives, and assist municipal authorities in keeping neighborhoods green.

---

## 🚀 Live Demo & Concept Highlights

- **Live URL**: `http://localhost:3000` (Production-ready Next.js App Router build)
- **Design System**: Forest Green (`#2E7D32`), Leaf Green (`#66BB6A`), Mint White (`#E8F5E9`), Sky Blue (`#4FC3F7`), Sand Cream (`#F5EBD7`), Alert Red (`#E53935`), and Warning Orange (`#FB8C00`).
- **Typography**: Poppins for headings & Nunito for body.
- **Languages**: English, Hindi (हिन्दी), and Telugu (తెలుగు) with dynamic switching.
- **PWA Ready**: Web App Manifest (`/manifest.json`), service worker (`/sw.js`), and offline fallback (`/offline`).

---

## 🏗️ Architecture & Single-Platform Firebase Stack

```
                              ┌───────────────────────────┐
                              │ Next.js 14 Frontend (PWA) │
                              │ React 18 / Tailwind CSS   │
                              │ Framer Motion / Recharts  │
                              └─────────────┬─────────────┘
                                            │
           ┌────────────────────────────────┼────────────────────────────────┐
           │                                │                                │
           ▼                                ▼                                ▼
┌─────────────────────┐          ┌─────────────────────┐          ┌─────────────────────┐
│    Firebase Auth    │          │   Cloud Firestore   │          │  Firebase Storage   │
│ - Phone 6-digit OTP │          │ - Reports + Geohash │          │ - Compressed photos │
│ - Email & Password  │          │ - Organizations     │          │ - Short videos (30s)│
│ - Google Sign-In    │          │ - Events & RSVPs    │          │ - 25 MB max limit   │
└─────────────────────┘          └──────────┬──────────┘          └─────────────────────┘
                                            │
                                            ▼
                               ┌───────────────────────────┐
                               │ Cloud Functions (Node 18) │
                               │ - OnReportCreated         │
                               │ - OnReportStatusUpdated   │
                               │ - OnEventCheckIn          │
                               │ - Auto-email Municipality │
                               │ - Optional AI Detection   │
                               └───────────────────────────┘
```

---

## 📂 Project Structure

```
garbage-collection/
├── .github/
│   └── workflows/firebase-deploy.yml   # Automatic GitHub Actions deploy
├── functions/                          # Cloud Functions for Firebase
│   ├── src/index.ts                   # Triggers for points, counters & alerts
│   ├── package.json
│   └── tsconfig.json
├── public/
│   ├── icons/                         # PWA app icons (192x192, 512x512)
│   ├── manifest.json                  # PWA install manifest
│   └── sw.js                          # Service worker with offline fallback
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Landing page (hero, live counters, 3-steps)
│   │   ├── start/page.tsx             # Location selector (Country/State/City) & Login
│   │   ├── map/[city]/page.tsx        # Interactive Leaflet garbage map
│   │   ├── report/page.tsx            # Garbage report flow with camera/GPS/blur tool
│   │   ├── communities/page.tsx       # Organizations directory & group creation
│   │   ├── communities/[id]/page.tsx  # Group stats, member roles, chat, invite QR
│   │   ├── events/page.tsx            # Cleanup events, RSVP, QR passes
│   │   ├── events/[id]/page.tsx       # Event detail & PDF Certificate generator
│   │   ├── events/[id]/scan/page.tsx  # Organiser QR scanner (html5-qrcode)
│   │   ├── awareness/page.tsx         # Waste segregation guide, quiz & challenges
│   │   ├── impact/page.tsx            # Profile, growing Community Tree & leaderboard
│   │   ├── authority/page.tsx         # Municipal Officer dashboard (Ward KPIs, resolve)
│   │   ├── admin/page.tsx             # Platform Admin & Content moderation
│   │   ├── about/page.tsx             # Mission & Swachh Bharat synergy
│   │   ├── privacy/page.tsx           # Privacy, facial blur & location protection
│   │   ├── safety/page.tsx            # Hazardous & medical waste safety rules
│   │   ├── terms/page.tsx             # Civic code of conduct
│   │   ├── offline/page.tsx           # PWA offline fallback
│   │   └── globals.css                # Tailwind, Leaflet & glassmorphism tokens
│   ├── components/
│   │   ├── common/                    # TreeVisualizer, QRCodeView, Counters
│   │   ├── layout/                    # Navbar, MobileTabBar
│   │   ├── map/                       # GarbageMap (Leaflet), PinDetailDrawer
│   │   ├── report/                    # DraggableLocationPicker
│   │   └── impact/                    # ImpactChart (Recharts)
│   ├── context/
│   │   ├── AuthContext.tsx            # User personas, login, points & roles
│   │   └── LocationContext.tsx        # Selected city, geocoordinates & area score
│   ├── lib/
│   │   ├── certificate.ts             # jsPDF Certificate of Appreciation generator
│   │   ├── firebase.ts                # Firebase client initialization
│   │   ├── utils.ts                   # Nominatim reverse geocoding, geohashes
│   │   ├── data/seedData.ts           # 60+ realistic reports, orgs, events, cities
│   │   ├── data/mockStore.ts          # Reactive in-browser state with localStorage
│   │   └── i18n/                      # Translations for en, hi, te
│   └── types/index.ts                 # Core TypeScript entities
├── firebase.json                      # Firebase Hosting, Firestore, Storage & Emulators
├── firestore.rules                    # Role-verified Firestore security rules
├── firestore.indexes.json             # Composite indexes for city queries
├── storage.rules                      # File type and 25 MB size limits
├── tailwind.config.ts                 # Design tokens and custom keyframes
└── package.json
```

---

## 🛠️ Getting Started (Local Development)

### 1. Prerequisites
- **Node.js**: v18 or v20+
- **npm**: v9+

### 2. Installation
```bash
git clone <repo-url>
cd garbage-collection
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🌐 Firebase Deployment Guide

### Step 1: Install Firebase CLI and Login
```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Initialize or Link Firebase Project
```bash
firebase use --add
# Select your project id (e.g. garbage-collection-clean-city)
```

### Step 3: Enable Firebase Services in the Firebase Console
1. **Authentication**: Enable `Phone` (add testing numbers like `+91 98765 43210`), `Email/Password`, and `Google`.
2. **Cloud Firestore**: Create database in production mode.
3. **Cloud Storage**: Create default storage bucket.
4. **Cloud Functions**: Ensure your Firebase project is upgraded to the **Blaze (Pay-as-you-go)** plan (required for Node.js 18 cloud functions).

### Step 4: Deploy Rules, Indexes, Functions and Hosting
```bash
# 1. Deploy Security Rules and Indexes
firebase deploy --only firestore:rules,firestore:indexes,storage

# 2. Deploy Cloud Functions
firebase deploy --only functions

# 3. Build & Deploy Hosting
npm run build
firebase deploy --only hosting
```

---

## 🧪 Built-in Demo Mode & Seed Data

The platform comes pre-configured with **Demo Mode** (`NEXT_PUBLIC_ENABLE_DEMO_MODE=true`):
- **3 Major Cities**: Hyderabad (Active Hub), Pune, Bengaluru.
- **60+ Realistic Reports**: Geotagged across Hyderabad localities (Kukatpally, Madhapur, Ameerpet, Hitec City, Gachibowli, Banjara Hills) spanning all statuses:
  - 🔴 **Reported** (Open hotspot)
  - 🟠 **In Progress** (Volunteers or Municipal Squad dispatched)
  - 🟢 **Resolved / Cleaned** (With sparkle animation)
- **4 Active Organizations**: Clean Kukatpally Group, Green Madhapur, Clean Ameerpet Team, Lake Savers Hitec City.
- **6 Upcoming Cleanup Drives**: Sunday Drives at Hussain Sagar, Gandhi Jayanti Drive, Lake Camp at Durgam Cheruvu.
- **Pre-configured Personas**:
  - **Citizen**: Ravi Kumar (`+91 98765 43210`)
  - **Municipal Officer**: Dr. K. Srinivas Rao (`srinivas.ghmc@hyderabad.gov.in`)
  - **Platform Admin**: Anita Sharma (`admin@garbagecollection.in`)
*(Use the persona switcher dropdown in the navbar for immediate role testing!)*

---

## 📖 Citizen & Officer User Guide

1. **Spot & Report**:
   - Navigate to `/report`.
   - Take a picture or video, or upload a photo.
   - Use the **privacy blur tool** to mask bystanders or vehicle number plates.
   - Draggable pin auto-populates exact street address via OpenStreetMap Nominatim.
   - Choose garbage types (Plastic, Debris, Medical, Drain block).
   - Click **Post Report** (+10 Karma points). The new pin appears instantly on `/map/[city]`.
2. **Join Cleanup Drives & Get Certified**:
   - Go to `/events`.
   - RSVP for upcoming Sunday drives.
   - Open your **Attendee QR Pass**.
   - Organiser scans the pass at `/events/[id]/scan` (+50 points).
   - Click **Download E-Certificate (PDF)** to save an official certificate of appreciation.
3. **Municipal Officer Workflow**:
   - Visit `/authority`.
   - Select your ward (e.g. `Ward 12 - Kukatpally`).
   - Review open hotspots, assign sanitation teams (Tipper Squads), and transition status to **In Progress** or **Cleaned** with resolution logs.
   - Export reports as CSV for official municipal filing.

---

## 📜 License
MIT License. Built for cleaner, greener Indian cities.
