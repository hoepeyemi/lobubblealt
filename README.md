# Druid - Simple Authentication API

A streamlined authentication system built with Next.js, tRPC, Prisma, and Twilio SMS verification.

## Features

- **User Authentication**: Secure login and registration
- **OTP Verification**: SMS-based one-time password verification
- **Modern Stack**: Next.js, tRPC, Prisma, PostgreSQL
- **Type Safety**: End-to-end TypeScript integration

## Tech Stack

### Frontend
- **Next.js**: React framework with server-side rendering
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components

### Backend
- **tRPC**: End-to-end typesafe API
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Relational database

### Authentication
- **Twilio SMS**: For OTP delivery
- **Server-side sessions**: Using secure HTTP-only cookies

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js Client App] --> B[React Components]
        B --> C1[Authentication]
        B --> C2[Dashboard]
        B --> C3[User Profile]
    end
    
    subgraph "API Layer"
        D[tRPC API Routes] --> E1[User Router]
        D --> E2[Post Router for OTP]
    end
    
    subgraph "Service Layer"
        F1[Auth Service] --> G1[OTP Verification]
        F1 --> G2[User Management]
    end
    
    subgraph "Data Layer"
        H1[Prisma ORM]
        H2[PostgreSQL Database]
        H1 --> H2
    end
    
    subgraph "External Integrations"
        I[Twilio SMS]
    end
    
    A <--> D
    E1 <--> F1
    E2 <--> F1
    F1 <--> H1
    F1 <--> I
```

## Database Schema

```prisma
model User {
  id              Int              @id @default(autoincrement())
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  email           String?          @unique
  firstName       String?
  middleName      String?
  lastName        String?
  phone           String?          @unique
  OTPVerification OTPVerification?
}

model OTPVerification {
  id        Int      @id @default(autoincrement())
  userId    Int      @unique
  otpCode   String
  expiresAt DateTime
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
}

model Waitlist {
  id        Int      @id @default(autoincrement())
  contact   String
  name      String
  isEmail   Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Twilio account for SMS

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/druid.git
cd druid
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Set up your environment variables by copying the .env-sample file:
```bash
cp .env-sample .env
```

4. Update the .env file with your own values:
```
DATABASE_URL="postgresql://username:password@localhost:5432/druid_db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENABLE_SMS="true"
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"
SALT_ROUNDS="10"
```

5. Set up your database:
```bash
npx prisma db push
# or
yarn prisma db push
```

6. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Authentication Flow

1. **Registration**: Users register with email or phone
2. **OTP Request**: Login initiates an OTP request via SMS
3. **OTP Verification**: User inputs the received OTP code
4. **Authentication**: User is authenticated upon successful verification

## Development

```bash
# Run development server
npm run dev

# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Format code
npm run format:write
```

## Security Considerations

- **OTP Expiration**: OTPs expire after 10 minutes
- **Rate Limiting**: Prevent brute force attempts
- **Secure Storage**: OTP codes are stored securely in the database
- **Development Mode**: Special "000000" code is allowed in development environment only

## License

This project is licensed under the MIT License - see the LICENSE file for details.
