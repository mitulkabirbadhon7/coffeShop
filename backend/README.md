# Chocobliss Coffee Backend API ☕

Standalone backend API service for Chocobliss Coffee Roastery.

## Features
- **Express & TypeScript**: Type-safe REST API endpoints.
- **Zod Schema Validation**: Server-side schema validation on all inputs.
- **Token-Bucket Rate Limiter**: Dedicated rate limits for public, authentication, and admin endpoints.
- **Security Middlewares**: CORS configuration, generic error responses, JWT auth check.

## Setup & Run

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

## API Endpoints
- `GET /api/health` - Service health status
- `GET /api/products` - List products (Public)
- `POST /api/products` - Create product (Admin only)
- `POST /api/orders` - Submit order
- `GET /api/orders` - View orders (Admin only)
- `POST /api/contact` - Submit table reservation / inquiry
- `POST /api/auth/login` - Login endpoint (5 requests/minute limit)
