# ⚡ VAULT CRACKER // CYBER-HEIST PLATFORM

A full-stack cyber-heist web application engineered with modern React, Express, MySQL, and modular cyber architecture.

---

## 🎯 Architecture & Core Modules Overview

Vault Cracker is structured around 4 core modules:

1. **Virtual Identity Module** *(Current Implemented Stage)*
   - Agent Registration (`full_name`, `nick_name`, `email`, `password_hash`).
   - Secure Authentication & Session Management (Bcrypt 10-salt hashing & JWT session tokens).
   - MySQL persistence with relational database schema (`agents` and `agent_stats` tables).
   - Agent Dossier Dashboard with mission status and entry gate.
2. **Interoperability Module** *(Architectural Standby)*
   - Modular Banana REST API service layer (`server/src/services/bananaApiService.js`).
   - Prepared for cross-system telemetry and external agent state synchronization.
3. **Event-Driven Architecture Engine** *(Architectural Standby)*
   - Event emitter subsystem (`server/src/events/eventManager.js`).
   - Prepared for asynchronous Keypad inputs and high-intensity 40-second countdown timer events.
4. **Version Control & Branching Workflow**
   - Clean monorepo structure with automated Git branch management (`main`, `feature/virtual-identity`).

---

## 🗂️ Project Structure

```text
vault-cracker-heist/
├── client/                     # Frontend (React 18, Vite, Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Cyber UI Components
│   │   │   ├── AlertBanner.jsx # Neon Cyber Toast/Banner
│   │   │   ├── Dashboard.jsx   # Welcome Agent, Dossier & Mission Status
│   │   │   ├── LoginForm.jsx   # Agent Access Terminal
│   │   │   ├── Navbar.jsx      # System Status & Cyber Audio Controls
│   │   │   └── RegisterForm.jsx# Virtual Identity Minting Form
│   │   ├── context/
│   │   │   └── AuthContext.jsx # React Context for Session Management
│   │   ├── utils/
│   │   │   └── audio.js        # Web Audio API Cyber Synthesizer
│   │   ├── App.jsx             # Main Application Entrypoint
│   │   ├── index.css           # Tailwind + Cyber Scanlines & Grids
│   │   └── main.jsx
│   ├── tailwind.config.js      # Neon cyan accents & dark theme palette
│   └── vite.config.js          # API proxy configuration (port 3000 -> 5000)
│
├── server/                     # Backend (Node.js, Express, MySQL)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # MySQL2 connection pool & auto-migration
│   │   ├── controllers/
│   │   │   └── authController.js# Registration, Login, Session handlers
│   │   ├── events/
│   │   │   └── eventManager.js # Keypad & 40s countdown event engine
│   │   ├── middleware/
│   │   │   └── authMiddleware.js# JWT verification middleware
│   │   ├── routes/
│   │   │   └── authRoutes.js   # /api/auth endpoints
│   │   ├── services/
│   │   │   └── bananaApiService.js# Banana REST API service standby
│   │   └── server.js           # Express application core (Port 5000)
│   ├── .env.example            # Environment variables template
│   └── package.json
│
├── package.json                # Root monorepo scripts
└── README.md
```

---

## 🎨 UI/UX Cyberpunk Neon Styling

- **Theme**: Deep dark cyber background (`#080d1a`), panels (`#0f172a`), glowing neon cyan accents (`#00f0ff`), and glowing borders.
- **Card Switching**: Seamless animated tab toggle between **Agent Login** and **Register Identity**.
- **Validation**:
  - Full client and server validation for missing fields.
  - Comms email pattern verification.
  - Real-time password confirmation match indicator.
  - Minimum 6-character password constraint.
  - Cyberpunk alert banners with dismiss capability.
- **Sound Effects**: Synthesized Web Audio API sound effects for terminal clicks, access granted, and alert notifications.

---

## 🔌 Backend API Specifications

Base URL: `http://localhost:5000`

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new agent, hash password, create `agents` & `agent_stats` records, return token & session | No |
| `POST` | `/api/auth/login` | Verify credentials, update `last_login`, return token & session | No |
| `GET` | `/api/auth/me` | Fetch authenticated agent profile & stats using Bearer JWT | Yes |
| `POST` | `/api/auth/logout` | Terminate session | No |

### Health & Architecture Endpoint

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Returns server status, MySQL connection status, Banana REST API standby status, and 40s Countdown Event engine readiness | No |

---

## 💾 Database Schema (`MySQL`)

The database connection pool automatically verifies and initializes the schema on server boot:

### `agents` Table
```sql
CREATE TABLE IF NOT EXISTS `agents` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `nick_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### `agent_stats` Table
```sql
CREATE TABLE IF NOT EXISTS `agent_stats` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `agent_id` INT(11) NOT NULL,
  `score` INT(11) DEFAULT 0,
  `unlocked_badges` VARCHAR(50) DEFAULT 'NONE',
  `last_login` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_agent_id` (`agent_id`),
  CONSTRAINT `fk_agent_stats_agent` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
- Node.js (v18+)
- MySQL (Running on `localhost:3306`, e.g., via XAMPP or standalone service)

### 1. Database Configuration
In `server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=vault_cracker_db
JWT_SECRET=cyber_vault_agent_secret_key_2026
```

### 2. Install Dependencies
```bash
# Root monorepo install
npm run install:all
```

### 3. Run Development Servers
```bash
# Run backend server (Port 5000)
npm run server

# Run frontend client (Port 3000)
npm run client
```

Navigate to `http://localhost:3000` to launch the Vault Cracker Terminal.
