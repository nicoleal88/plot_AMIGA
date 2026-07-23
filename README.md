# plot_AMIGA

Data visualization web app for AMIGA (Auger Muons and Infill for the Ground Array) deployment tracking.

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: p5.js + Mapbox (via mappa.js) + lil-gui
- **Data Source**: Google Sheets (CSV export)

## Features

- Interactive map with SD (Surface Detector) and UMD (Underground Muon Detector) visualization
- Real-time status monitoring of detectors
- Multiple visualization modes (status, power, electronics, etc.)
- Search and filter by detector type
- Selected SDs panel with zoom controls
- Offline mode with localStorage caching
- Mobile responsive

## Getting Started

### Requirements

- Node.js 22.x
- npm

### Install dependencies
```bash
npm ci
```

### Run development server
```bash
npm start
```

Server runs at http://localhost:3003 by default. Override it with `PORT`.

### Verify changes

```bash
npm run check
```

This runs syntax checks, ESLint, backend smoke tests and Playwright smoke tests.

### Environment Variables

Create a `.env` file with:
```
MAPBOX_API_KEY=your_mapbox_key
CSV_URL=your_google_sheets_csv_url
PORT=3003
CSV_REFRESH_MS=300000
CSV_TIMEOUT_MS=30000
CSV_MAX_BYTES=2097152
```

Use `.env.example` as the template. Do not commit real tokens or private URLs.

The server publishes validated snapshots to `public/csv/data.csv`,
`public/csv/lastUpdate.txt` and `public/csv/snapshot.json`. The `/healthz`
endpoint returns readiness without exposing secrets.

## License

ISC
