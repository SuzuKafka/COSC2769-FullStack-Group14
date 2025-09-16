# COSC2769-FullStack-Group14

**Course:** COSC2769 – Full Stack Development

**Group 14 Members:**
- Member 1

## Quick Start
1. Install dependencies in both workspaces:
   - `cd server && npm install`
   - `cd ../client && npm install`
2. Run the backend from the `server` folder with `node index.js` (or `npm start`).
3. Run the frontend from the `client` folder with `npm start`.

### Marker Instructions (verbatim)
From a clean clone:
1. `cd server`
2. `npm install`
3. `node index.js`

### Building for Production
1. `cd client && npm run build`
2. Copy the build output into the Express static directory: `mkdir -p ../server/public/client && cp -R dist/* ../server/public/client/`
3. Start the server from the `server` folder with `node index.js`

### Seed Data
Run the seed script **before** packaging your submission (do not ship the populated database with the zip). The script clears existing hubs/users/products and inserts clean demo data.

```
cd server
node scripts/seed.js
```

Accounts created by the seed:
- Vendor: `vendor_demo` / `Password123`
- Shipper: `shipper_demo` / `Password123`
- Customer: `customer_demo` / `Password123`

The script also creates three distribution hubs (Ho Chi Minh City, Da Nang, Hanoi) and two sample products.

### External Environment Test (required)
Before testing, ensure your MongoDB Atlas cluster accepts connections from all marking locations (temporarily whitelist `0.0.0.0/0`).

1. On a different laptop and Wi-Fi network, unzip the submission archive.
2. Open a terminal and `cd` into the extracted folder.
3. `cd server && npm install`
4. `cd ../client && npm install`
5. `cd ../server && node index.js`
6. In a browser, visit the server URL:
   - Register or log in as a vendor.
   - Add a product (respect name/price/description/image rules).
   - Log out (if applicable) and sign in as a customer.
   - Use filters/search on the browse page to confirm server-side query handling.
   - Add items to the cart and proceed through checkout (cart should clear, confirmation should show hub name).
   - Log in as a shipper and open `/shipper/orders`; set an order to delivered/canceled and confirm it disappears.

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
