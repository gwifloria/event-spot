# Event Spot

A mobile app for discovering events powered by Ticketmaster API.

## Tech Stack

- **Framework**: React Native + Expo (SDK 54)
- **Routing**: Expo Router
- **State**: Zustand + TanStack Query
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Environment Variables

Create `.env` file in root:

```
EXPO_PUBLIC_TICKETMASTER_API_KEY=your_api_key
```

Get API key from [Ticketmaster Developer Portal](https://developer.ticketmaster.com/).

## Project Structure

```
app/                    # Expo Router pages
├── (tabs)/             # Tab navigation
│   ├── index.tsx       # Home (Explore)
│   └── favorites.tsx   # Favorites
├── event/[id].tsx      # Event detail
└── _layout.tsx         # Root layout

src/
├── components/         # UI components
├── hooks/              # Custom hooks
├── constants/          # App constants
├── services/           # API services
├── stores/             # Zustand stores
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## Features

- Browse events by category, date, and region
- Search events
- Filter by date (Today, Weekend, Week, Month, Custom)
- 23 supported countries
- Favorites (local storage)
- Dark mode support

## Scripts

```bash
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run lint        # Run ESLint
npm run lint:fix    # Fix lint issues
npm run format      # Format with Prettier
npm run typecheck   # TypeScript check
```

## Testing

Tests are located in `src/__tests__/`. Run with:

```bash
npm test
```
