# Experment: Image Verification

This project is set up with **Next.js**, **Prisma**, and an **SQLite** database.

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run migrations to set up the database**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
4. **Start the Next.js application**:
   ```bash
   npm run dev
   ```
