# 🏨 HotelPro - Complete Hotel Booking and Management Solution

> **A full-stack, enterprise-grade Hospitality Management System (MERN Stack) featuring Role-Based Access Control (Guest, Staff, Admin), Real-Time Room Availability, Interactive Booking & Payment Processing, Digital RFID Key Issuance, Housekeeping Operations, and Executive Analytics.**

---

## 🌟 Project Highlights & Architecture

HotelPro bridges the gap between luxury guest experiences and efficient hotel operations. Built using the **MERN Stack** (MongoDB, Express.js, React, Node.js), HotelPro offers:

- **Multi-Role RBAC Architecture:** Dedicated, tailor-made portals for **Guests**, **Hotel Staff**, and **Administrators**.
- **Role Switcher Demo Bar:** 1-Click instant test login buttons for mentor and peer evaluation (no password typing required!).
- **High-Availability Zero-Setup Engine:** Out-of-the-box MongoDB Mongoose integration with automated memory-state fallback so the entire project runs effortlessly even before local MongoDB is started!
- **Digital Key Issuance & Check-In Desk:** Front Desk staff can assign encoded RFID digital keys and manage check-ins and check-outs in real time.
- **Folio & Tax Invoice Generator:** Printable, professional booking invoices with 12% hospitality tax breakdown and transaction reference.
- **Executive Analytics:** Live occupancy rate percentage, gross revenue calculations, room status tracking, and audit logs.

---

## 👥 Demo Accounts (Pre-configured for Instant Testing)

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hotelpro.com` | `admin123` | Executive Analytics, Revenue, Room Inventory CRUD, Staff Management |
| **Staff** | `staff@hotelpro.com` | `staff123` | Check-in / Check-out Desk, Room Status Manager, Housekeeping Queue |
| **Guest** | `guest@hotelpro.com` | `guest123` | Room Search, Booking, Secure Payment Simulation, Invoices, Service Requests |

*Note: You can also use the **top Evaluator Demo Bar** in the UI to switch between these roles with a single click!*

---

## 🏗️ Technology Stack

- **Frontend:**
  - React 18 + Vite (Lightning-fast HMR)
  - React Router DOM v6
  - Bootstrap 5 + Bootstrap Icons
  - Axios (with JWT interceptors)
  - Custom Luxury Glassmorphism CSS & Google Fonts (*Playfair Display*, *Cinzel*, *Plus Jakarta Sans*)
- **Backend:**
  - Node.js & Express.js REST API
  - MongoDB & Mongoose ODM
  - JSON Web Tokens (JWT) & bcryptjs Password Hashing
  - CORS, Dotenv, and Centralized Error Handling
  - Seeder Engine with 8 Realistic Luxury Rooms & Suites

---

## 📂 Project Structure

```
Hotel Project/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & memory fallback state
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Profile, Users
│   │   ├── roomController.js     # Room Catalog, CRUD & Search Filters
│   │   ├── bookingController.js  # Reservations, Cancellations & Key issuance
│   │   ├── serviceController.js  # Housekeeping & Concierge dispatch
│   │   ├── reviewController.js   # Guest reviews & ratings
│   │   ├── notificationController.js # Real-time alerts
│   │   └── analyticsController.js # Revenue, Occupancy % & KPI metrics
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & RBAC authorization
│   ├── models/
│   │   ├── User.js, Room.js, Booking.js, Payment.js, Review.js, ServiceRequest.js, Notification.js
│   ├── routes/                   # Express REST API routes
│   ├── seeder/
│   │   ├── seedData.js           # Curated demo data (Users, Rooms, Bookings)
│   │   └── seeder.js             # Standalone seed script
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DemoCredentialsBar.jsx # 1-Click Role Switcher for Mentors
│   │   │   ├── Navbar.jsx             # Luxury Header with Notification Center
│   │   │   ├── Footer.jsx             # Informative hospitality footer
│   │   │   ├── RoomCard.jsx           # Suite preview card with amenities & badges
│   │   │   ├── SearchFilter.jsx       # Real-time search & filter bar
│   │   │   ├── InvoiceModal.jsx       # Printable & downloadable tax invoice
│   │   │   └── ProtectedRoute.jsx     # Role-based route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # JWT Authentication state
│   │   ├── pages/
│   │   │   ├── HomePage.jsx           # Hero, quick search, featured suites, testimonials
│   │   │   ├── RoomsPage.jsx          # Room catalog with interactive filters
│   │   │   ├── RoomDetailsPage.jsx    # Photo gallery, specs, amenities & reviews
│   │   │   ├── BookingCheckoutPage.jsx # Secure payment portal & discount codes
│   │   │   ├── GuestDashboard.jsx     # Active bookings, digital key & service desk
│   │   │   ├── StaffDashboard.jsx     # Check-In/Out desk & room inventory status
│   │   │   ├── AdminDashboard.jsx     # Executive KPI metrics, room CRUD & staff management
│   │   │   ├── LoginPage.jsx          # Login with fast demo shortcuts
│   │   │   ├── RegisterPage.jsx       # User registration
│   │   │   └── NotFoundPage.jsx       # 404 handler
│   │   ├── services/
│   │   │   └── api.js                 # Axios API client with token injector
│   │   ├── App.jsx
│   │   ├── index.css                  # Custom styling
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json                       # Root package.json
├── .gitignore
└── README.md
```

---

## ⚡ Step-by-Step Instructions to Run on Windows Command Prompt (CMD)

Open **Command Prompt (cmd.exe)** on Windows:

### Method 1: Running in Two CMD Windows (Recommended)

#### Window 1: Start Backend Server
```cmd
cd "c:\Users\pc\OneDrive\Documents\Hotel Project\backend"
node server.js
```
*The backend will boot up on `http://localhost:5000`.*

#### Window 2: Start Frontend Client
```cmd
cd "c:\Users\pc\OneDrive\Documents\Hotel Project\frontend"
npm run dev
```
*The frontend will launch at `http://localhost:5173`.*

---

### Method 2: Single Command from Root Directory
From the root directory (`c:\Users\pc\OneDrive\Documents\Hotel Project`):
```cmd
npm run server
```
And in another terminal:
```cmd
npm run client
```

Now open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 🚀 How to Submit on Your GitHub Repository

Follow these step-by-step commands in your Command Prompt (`cmd.exe`):

### Step 1: Install Git (If not already installed)
If Git is not installed on your machine yet, install it quickly via Windows Package Manager:
```cmd
winget install Git.Git
```
*(After installation finishes, close and reopen CMD).*

### Step 2: Initialize Git in the Project Root
```cmd
cd "c:\Users\pc\OneDrive\Documents\Hotel Project"
git init
```

### Step 3: Stage and Commit the Code
```cmd
git add .
git commit -m "feat: complete HotelPro hotel booking and management solution with MERN stack"
```

### Step 4: Create a New Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new).
2. Set the repository name to: **`hotelpro`** (or your preferred name).
3. Choose **Public** (so your mentor can review and evaluate your project).
4. Do **not** initialize with README or .gitignore (we already created them).
5. Click **Create repository**.

### Step 5: Link and Push to Your GitHub Repository
Run the following commands in CMD (replace `YOUR_GITHUB_USERNAME` with your actual GitHub username):
```cmd
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/hotelpro.git
git push -u origin main
```

---

## 📋 Updating Demo and GitHub Links for Mentor Evaluation

Once your code is pushed to GitHub:
1. **GitHub Link:** Copy your repository URL (e.g., `https://github.com/YOUR_GITHUB_USERNAME/hotelpro`).
2. **Live Demo Link (Optional Deployment):**
   - You can deploy the frontend on [Vercel](https://vercel.com) or [Netlify](https://netlify.com) in 1-click.
   - You can deploy the backend on [Render](https://render.com) or [Railway](https://railway.app).
3. **Submit:** Paste both links into your project portal or workspace submission form so your mentor can review and award your grade!

---

## 📜 License
This project is developed for educational and portfolio demonstration under the **MIT License**.
