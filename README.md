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

### Install dependencies
```bash
npm install
```

### Run development server
```bash
node app.js
```

Server runs at http://localhost:3000

### Environment Variables

Create a `.env` file with:
```
MAPBOX_API_KEY=your_mapbox_key
CSV_URL=your_google_sheets_csv_url
```

## License

ISC
