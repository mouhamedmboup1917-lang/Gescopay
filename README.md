# GescoPay

> **One App. One QR. Every Wallet.**

GescoPay is an investor-ready African fintech super-app that unifies mobile wallet payments across West Africa. Built with React Native Expo for iOS, Android and Web from a single codebase.

## Features

- 🏦 **Wallet Aggregation** – Connect Wave, Orange Money, Free Money, QMoney, MTN MoMo, Airtel Money, Africell Money
- 💳 **Virtual Visa Card** – Create and manage virtual Visa cards
- 📱 **Universal QR Code** – One QR accepts all wallets
- 💸 **Money Transfer** – Wallet-to-wallet, bank, and merchant transfers
- 📊 **Analytics** – Spending insights and financial analytics
- 🏪 **Merchant Platform** – Dashboard, invoicing, settlements
- 🔐 **Security** – PIN, biometrics, 2FA, device management
- 🌍 **Multi-language** – English & French

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React Native Expo + React Native Web |
| Routing | Expo Router v3 |
| Styling | NativeWind v4 |
| State | Zustand |
| Data Fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Animations | Reanimated 3 + Moti |
| Backend | NestJS + Prisma + PostgreSQL |
| Auth | JWT + OTP |
| Infra | AWS + Vercel + Docker |

## Getting Started

```bash
# Install dependencies
npm install

# Start mobile app
npm run mobile

# Start web app
npm run mobile:web

# Start backend
npm run backend
```

## Project Structure

```
gescopay/
├── apps/
│   └── mobile/          # React Native Expo app (iOS + Android + Web)
└── packages/
    └── backend/         # NestJS API server
```

## License

Proprietary – GescoPay © 2024
