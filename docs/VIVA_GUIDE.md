# 🎓 Viva Examination Guide // Vault Cracker

A simple reference guide with questions and clear answers for the final Viva examination.

---

## 📌 Module 1: Virtual Identity Module

### Q1: How is the agent's identity stored and secured?
- **Answer**: 
  - When an operative registers, their password is encrypted using **Bcrypt** with **10 salt rounds** in `server/src/controllers/authController.js`.
  - The plain text password is never stored in the database.
  - The agent data is saved in a local **MySQL** database (`vault_cracker_db`) inside two tables: `agents` (profile data) and `agent_stats` (score and badges).

### Q2: How does session management work?
- **Answer**:
  - Upon successful login, the server generates a **JSON Web Token (JWT)** signed with a secret key.
  - The client stores this token in `localStorage` and includes it in the `Authorization: Bearer <token>` header for protected requests.
  - The middleware `server/src/middleware/authMiddleware.js` verifies this token on incoming requests.

---

## 📌 Module 2: Interoperability Module

### Q1: What external API did you integrate with, and how?
- **Answer**:
  - We integrated with **Dr. Marc Conrad's Banana REST API** (`https://marcconrad.com/uob/banana/api.php?out=json`).
  - Our backend service `server/src/services/bananaApiService.js` sends an HTTP GET request to this endpoint to fetch dynamic visual math puzzle images and their numeric answers (0 to 9).

### Q2: Why is the API endpoint stored in `.env`?
- **Answer**:
  - Storing endpoints in `.env` is an industry best practice.
  - If the external API URL changes in the future, we can simply update the `.env` file without modifying any application code.

### Q3: What happens if the internet or external API goes down?
- **Answer**:
  - We implemented a **fail-safe fallback mechanism**. If the external server cannot be reached, the system automatically uses a fallback cipher puzzle so the game never freezes or crashes during a demonstration.

---

## 📌 Module 3: Event-Driven Game Engine

### Q1: How is the game engine event-driven?
- **Answer**:
  - The game is decoupled into **emitters** and **listeners** using Node.js `EventEmitter` in `server/src/events/eventManager.js`.
  - Events are triggered asynchronously based on player actions and time intervals:
    - `keypad:press`: Emitted when an operative presses an on-screen or physical keypad button.
    - `timer:start`: Emitted when the 60-second countdown timer begins for a layer.
    - `alert:trigger`: Emitted when an incorrect code or timeout occurs.
    - `vault:success`: Emitted when a layer or the entire vault is breached.
    - `agent:arrest`: Emitted when 3 security strikes are accumulated.

### Q2: How does the 3-Alert Security System work?
- **Answer**:
  - **Alert 1 (Strike 1)**: Warning issued, new puzzle loaded, 60s timer reset.
  - **Alert 2 (Strike 2 - Penalty)**: The player is demoted by 1 level (e.g., Level 2 demotes to Level 1), the timer is paused, and an alert modal warns: *"1 CHANCE REMAINING BEFORE ARREST"*.
  - **Alert 3 (Strike 3 - Arrest)**: Maximum security lockdown is triggered, and the operative is arrested (Game Over).

### Q3: How many puzzles are needed to crack the vault?
- **Answer**:
  - There are 3 levels. If the player solves the first puzzle of each level correctly on the first attempt, exactly **3 puzzles** are required to crack the vault.

---

## 📌 Module 4: Version Control & Git Workflow

### Q1: What branching strategy did you use?
- **Answer**:
  - We used a **Feature Branching Strategy**.
  - Instead of developing everything directly on `main`, each module was developed and tested on an independent feature branch:
    - `feature/virtual-identity` (Module 1)
    - `feature/interoperability-service` (Module 2)
    - `feature/event-driven-engine` (Module 3)
    - `feature/version-control-docs` (Module 4)
  - This keeps the codebase modular, prevents conflicting changes, and makes code reviews simple.

### Q2: Why are conventional commit messages important?
- **Answer**:
  - Using structured commit messages (e.g., `feat:`, `refactor:`, `docs:`) creates a clear history of what was added, changed, or fixed at each stage of the project lifecycle.

