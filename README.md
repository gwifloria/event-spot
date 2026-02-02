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

## Build

Using [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Set API key as secret
eas secret:create --name EXPO_PUBLIC_TICKETMASTER_API_KEY --value "your_key"

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

Build profiles:

- `development` - Development client with simulator support
- `preview` - Internal testing (ad-hoc/APK)
- `production` - App Store / Play Store release

## Development Approach

| Phase           | Focus         | Highlights                               |
| --------------- | ------------- | ---------------------------------------- |
| 1. Init         | Project setup | Expo + TypeScript, ESLint/Prettier/Husky |
| 2. Architecture | Tech stack    | Expo Router, TanStack Query, Zustand     |
| 3. Core         | Features      | Event list, detail page, search, filters |
| 4. Polish       | UX & Quality  | Date picker interaction, unit tests      |
| 5. Deploy       | Release       | EAS Build config, bug fixes              |

**Key decisions:**

- **TanStack Query + Zustand**: Server state (API cache) vs client state (favorites) separation
- **Native RN components**: Removed Tamagui to reduce complexity for this scope
