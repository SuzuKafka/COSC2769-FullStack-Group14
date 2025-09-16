# COSC2769-FullStack-Group14

**Course:** COSC2769 – Full Stack Development

**Group 14 Members:**
- Member 1

## Quick Start
1. From the repository root, install dependencies separately in `server` and `client`:
   - `cd server && npm install`
   - `cd ../client && npm install`
2. Run the backend from the `server` folder with `node index.js` (or `npm start`).
3. Run the frontend from the `client` folder with `npm start`.

## Project Structure
- `server/` – Node.js + Express backend (`index.js` entry point).
- `client/` – React frontend bootstrapped with Vite.
- `.gitignore` – Shared ignore rules for both frontend and backend environments.

## Security Notes

- **Why bcrypt?** We rely on `bcrypt` for password hashing because it is a battle-tested, adaptive hashing algorithm with built-in salting and configurable work factors. This makes it far more resilient against brute-force or rainbow-table attacks compared to general-purpose hashing functions, helping the project meet the password security requirements in the 2025B specification.

## Branching Strategy
- `main` – stable, production-ready code.
- `dev` – active development integration branch.
- `feature/*` – short-lived branches per module (for example, `feature/auth`, `feature/cart`).

## Placeholders
- **Test Accounts:** _TBD_
- **Demo Video:** _TBD_
- **Contribution Table:** _TBD_
- **Report (PDF):** _TBD_
