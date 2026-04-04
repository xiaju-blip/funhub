# ReelRWA - Blockchain Drama IP Investment Platform

ReelRWA is the world's first blockchain-based drama IP tokenization investment and trading platform, deeply integrating Web3 and streaming media ecosystems.

## Features

- **Asset Side**: Drama IP copyright tokenization (IPT), users subscribe to shares and enjoy box office/play dividends
- **Trading Side**: C2C order book + AMM mixed liquidity engine, supports price circuit breaker
- **Incentive Side**: PoE (Proof of Engagement) mechanism, allocates REEL tokens based on "effective viewing weight"
- **Growth Side**: Invite fission system + advertising monetization (non-VIP limit + ad exchange for points)
- **Globalization**: Full link Chinese/English switching, supports multiple time zones and multi-regional compliance operations

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + i18next + Tailwind CSS
- **State Management**: Zustand
- **Charts**: Lightweight Charts, Recharts
- **Web3**: Wagmi, Viem, Web3-react
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd reelrwa
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── api/              # API interface definitions
├── components/       # Common components
├── hooks/            # Custom hooks
├── i18n/             # Internationalization config & language packs
├── pages/            # Page components
├── store/            # State management
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── App.tsx           # Root component
```

## Internationalization

The project supports full bilingual (Chinese/English) internationalization:

- Language packs are located at `src/i18n/locales/`
- Switching is done via the language switcher in the navbar
- User preferences are persisted in localStorage

## Design Style

This project follows the **Western blockchain project style**:
- Dark theme with gradient accents
- Glass morphism effects
- Clear information hierarchy
- Smooth animations and transitions
- Mobile responsive

## License

MIT
