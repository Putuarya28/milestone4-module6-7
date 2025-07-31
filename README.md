# RevoBank

## Overview

RevoBank is a secure, scalable banking API built with NestJS, Prisma, and PostgreSQL (TigerData/TimescaleDB). It provides user authentication, role-based access, and full CRUD for users, accounts, and transactions. The system is designed for modern cloud deployment and includes comprehensive automated tests.

## Features

- **User Registration & Login**: Secure JWT authentication for users.
- **Role-Based Access**: Admin and user roles for endpoint protection.
- **Account Management**: Create, read, update, delete accounts.
- **Transaction Operations**: Deposit, withdraw, transfer funds between accounts.
- **User Profile**: View and update user profile.
- **Comprehensive Testing**: Jest-based unit and integration tests.

## Technologies Used

- **NestJS**: Progressive Node.js framework for scalable server-side apps.
- **Prisma ORM**: Type-safe database access and migrations.
- **PostgreSQL (TigerData/TimescaleDB)**: Cloud database backend.
- **JWT**: Authentication and authorization.
- **Jest**: Testing framework.
- **pnpm**: Fast package manager.
- **Render**: Example deployment platform.

## How to Run Locally

### Prerequisites

- Node.js >= 18
- pnpm (recommended)
- PostgreSQL database (TigerData/TimescaleDB)

### Setup Instructions

1. **Clone the repository:**
   ```
   git clone <your-repo-url>
   cd revo-bank-api
   ```
2. **Install dependencies:**
   ```
   pnpm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your database credentials and JWT secret.
   - Example:
     ```
     DATABASE_URL="postgres://tsdbadmin:<password>@<host>:<port>/<db>?sslmode=require"
     JWT_SECRET="yourSuperSecretKey"
     ```
4. **Generate Prisma client:**
   ```
   pnpm prisma generate
   ```
5. **Run migrations:**
   ```
   pnpm prisma migrate dev --name init
   ```
6. **Start the server:**
   ```
   pnpm dev
   ```
7. **Run tests:**
   ```
   pnpm test
   ```

## API Endpoints

### Auth

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT

### Users

- `GET /user/profile` — Get user profile
- `PATCH /user/profile` — Update user profile

### Accounts

- `POST /accounts` — Create account
- `GET /accounts/:id` — Get account by ID
- `GET /accounts` — List all accounts
- `PATCH /accounts/:id` — Update account
- `DELETE /accounts/:id` — Delete account

### Transactions

- `POST /transactions/deposit` — Deposit funds
- `POST /transactions/withdraw` — Withdraw funds
- `POST /transactions/transfer` — Transfer funds
- `GET /transactions/:id` — Get transaction by ID
- `GET /transactions` — List all transactions

## Role-Based Access Control

- **Users** can only manage their own accounts and transactions.
- **Admins** can access and manage all users’ data.

## Business Logic Notes

- All transaction operations (deposit, withdraw, transfer) include:
  - Validation for positive amounts
  - Account existence checks
  - Sufficient balance checks for withdraw/transfer
  - Prevention of self-transfer
  - Atomic database transaction for transfers

## Prisma Schema

See `prisma/schema.prisma` for models: User, Account, Transaction.

## Deployment

- Database: TigerData/TimescaleDB (cloud)
- Backend: Deployable to Render, Vercel, or any Node.js host

## License

MIT
