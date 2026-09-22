# ShopPilot — MERN Retail Management System

Production-style MERN starter for a real shop: authentication, products, ImageKit product images, POS, inventory ledger, purchases, customers, expenses, reports, invoices and UPI payment QR.

## Requirements
- Node.js 20+
- MongoDB local or Atlas
- Optional ImageKit account for product image uploads

## Run
```bash
npm install
npm run install-all
```

Copy `server/.env` to `server/.env` and configure MongoDB/JWT. For ImageKit uploads configure the three ImageKit values. For UPI QR set `UPI_ID`.

Then:
```bash
npm run dev
```
Frontend: http://localhost:5173
API: http://localhost:5000/api/health

## Important
The application starts with an empty database. No demo products, sales, customers or fake analytics are seeded.

## Print
POS creates a dedicated receipt print window, so the browser print preview contains the receipt rather than the application page.
