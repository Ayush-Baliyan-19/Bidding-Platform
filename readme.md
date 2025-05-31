# 🚛 Bidding & Transporter Management Platform

<p align="center">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Badge"/>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js Badge"/>
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js Badge"/>
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase Badge"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS Badge"/>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge"/>
</p>

> 🔐 A secure internal platform designed for **logistics companies** to manage freight bidding, transporters, and performance analytics. Supports **role-based access**, **bid lifecycle management**, and **transporter history tracking**.

---

## 📖 Table of Contents

- [🚛 Bidding \& Transporter Management Platform](#-bidding--transporter-management-platform)
  - [📖 Table of Contents](#-table-of-contents)
  - [📌 Overview](#-overview)
  - [🚀 Features](#-features)
    - [🔑 Authentication (Firebase)](#-authentication-firebase)
    - [🛠 User Roles](#-user-roles)
    - [📦 Bid Creation \& Management](#-bid-creation--management)
    - [🚚 Transporter Management (Admin Only)](#-transporter-management-admin-only)
  - [🛠 Tech Stack](#-tech-stack)
  - [⚙ Getting Started](#-getting-started)
    - [📁 Backend Setup](#-backend-setup)
      - [`.env` sample](#env-sample)
    - [💻 Frontend Setup](#-frontend-setup)
      - [`firebaseConfig.js` (frontend):](#firebaseconfigjs-frontend)
  - [🗂 Folder Structure](#-folder-structure)
    - [📦 Frontend (Next)](#-frontend-next)
    - [📦 Backend (Express.js)](#-backend-expressjs)
  - [🔐 Access Control (Admin vs Management)](#-access-control-admin-vs-management)
    - [👑 Admin](#-admin)
    - [👨‍💼 Management](#-management)
  - [📡 Backend API Overview](#-backend-api-overview)
  - [📈 Extensibility Ideas](#-extensibility-ideas)
  - [👨‍💻 Author](#-author)
  - [📄 License](#-license)

---

## 📌 Overview

The platform enables internal **Admin** and **Management Staff** to handle end-to-end freight bidding and transporter workflows. It aims to:

- Streamline **freight bidding**
- Log **manual/offline deals**
- Maintain an active **transporter database**

---

## 🚀 Features

### 🔑 Authentication (Firebase)

- Firebase email/password login (no public signup)
- Admin can create/remove users and reset passwords
- Firebase Admin SDK integration for secure token verification

### 🛠 User Roles

| Role          | Permissions                                                                 |
|---------------|------------------------------------------------------------------------------|
| **Admin**     | Full access: manage users, transporters, analytics                          |
| **Staff**| Create bids, accept bids, log manual deals only                             |

---

### 📦 Bid Creation & Management

- **Create Bids**  
  - Fields: material, quantity, pickup/delivery, deadline, transporter criteria
  - Auto-price suggestion

- **Bid Offers & Acceptance**  
  - View active bids + transporter offers (mock)
  - Mark bid as “accepted” or “closed”

- **Manual Deal Logging**  
  - Form or CSV upload
  - Fields: transporter, material, deal amount, date, etc.

---

### 🚚 Transporter Management (Admin Only)

- CRUD operations: name, vehicle type, contact, capacity
- View each transporter's historical deals and bids

---

## 🛠 Tech Stack

| Layer        | Technology                      |
|--------------|----------------------------------|
| Frontend     | React.js + MUI / Ant Design      |
| Backend      | Node.js + Express.js             |
| Database     | PostgreSQL              |
| Auth         | Firebase Authentication + Admin SDK |

---

## ⚙ Getting Started

### 📁 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
node index.js
```

#### `.env` sample

```env
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
DB_URL=postgres://user:password@localhost:5432/database
```

---

### 💻 Frontend Setup

```bash
cd client
npm install
npm run dev
```

#### `firebaseConfig.js` (frontend):

```js
export const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
};
```

---

## 🗂 Folder Structure

### 📦 Frontend (Next)
```
client/
├── app
|     ├── (auth)
|       └── login
|     ├── dashboard
|       ├── bids
|       ├── deals
|       ├── transporters
|       └── users
├── components
|     ├── dashboard
|           └── sidebar
|     ├── shared
|     ├── ui
├── context
├── lib
├── public
├── types
```

---

### 📦 Backend (Express.js)

```
server/
├── routes/
│   ├── auth.js
│   ├── bids.js
│   ├── deals.js
│   └── transporters.js
├── middleware/
│   └── auth.js
├── config/
│   ├── firebase.js
│   └── db.js
└── firebaseServiceAccountKey.json
```

---

## 🔐 Access Control (Admin vs Management)

### 👑 Admin

* ✅ User Management (add/remove staff)
* ✅ Transporter CRUD
* ✅ View analytics
* ✅ Create bids / log deals

### 👨‍💼 Management

* ✅ Create bids
* ✅ Accept/close bids
* ✅ Log manual deals
* 🚫 No access to user/transporter management

---

## 📡 Backend API Overview

| Endpoint        | Method | Description                     | Role       |
| --------------- | ------ | ------------------------------- | ---------- |
| `/auth/login`   | POST   | Firebase login (frontend only)  | All        |
| `/users`        | GET    | List all users                  | Admin      |
| `/bids`         | POST   | Create a new bid                | Management |
| `/bids/active`  | GET    | List active bids                | All        |
| `/deals/upload` | POST   | Upload manual deals (CSV)       | Management |
| `/transporters` | CRUD   | Manage transporters             | Admin      |

> 🔐 All routes are secured with Firebase ID token middleware.

---

## 📈 Extensibility Ideas

* 📱 Transporter Mobile App (bid offers)
* 📊 Dashboard Analytics with charts (recharts, chart.js)
* ⏱ Bid deadlines & email notifications

---

## 👨‍💻 Author

**Ayush Baliyan**
Fullstack Dev | UI/UX Fan

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
