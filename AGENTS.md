# AGENTS.md - plot_AMIGA

## Project Overview

- **Project name**: plot_AMIGA
- **Description**: Data visualization web app for AMIGA (Auger Muons and Infill for the Ground Array) deployment tracking
- **Tech stack**: Node.js + Express backend, p5.js + Mapbox frontend
- **Main files**:
  - `app.js` - Express server (backend)
  - `public/javascripts/sketch.js` - Main p5.js logic
  - `public/javascripts/tank.js` - SD (Surface Detector) entity class
  - `public/javascripts/umd.js` - UMD (Underground Muon Detector) entity class
  - `public/index.html` - Entry point

### Dependencies

- **Frontend**: p5.js 1.9.x, lil-gui, mappa.js (Mapbox wrapper)
- **Backend**: Express 4.22.x (native fetch in Node 22)

---

## Commands

### Development

```bash
# Install dependencies
npm ci

# Start development server
npm start

# Server runs at http://localhost:3003 by default
```

### Testing

```bash
# Run backend tests
npm test

# Run browser smoke tests
npm run test:e2e

# Full verification
npm run check

# Manual testing: open http://localhost:3003 in browser
# Check browser console (F12) for errors
```

### Code Quality

```bash
npm run check:syntax
npm run lint
```

---

## Code Style Guidelines

### General Principles

1. **Small, focused functions** - Functions should do one thing
2. **Meaningful names** - Variables and functions should describe their purpose
3. **Comments** - Only for complex logic or "why", not "what"
4. **Consistency** - Match existing code style in each file

### JavaScript Conventions

#### Variables and Functions

```javascript
// Good
let tanks = [];
let lastUpdateDate;
function downloadCSV(url, filePath) { }

// Bad
var t = [];
function download() { }
```

- Use `const` by default, `let` when mutation needed, avoid `var`
- Use camelCase for variables and functions
- Use PascalCase for classes (e.g., `class Tank`)
- Use UPPER_SNAKE_CASE for constants

#### Classes

```javascript
class Tank {
  constructor(datos) {
    this.name = datos.name;
    this.lsid = datos.lsid;
    this.pos = datos.pos;
  }

  update() { /* ... */ }
  showSD() { /* ... */ }
}
```

- One class per file (filename = class name, e.g., `Tank.js`)
- Constructor should handle all initialization
- Use `this.` for instance properties

#### Objects and Data

```javascript
// Good - structured data object
let datos = {
  name: row.get("SD"),
  lsid: row.get("LSID"),
  pos: { lat: degd.latd, lng: degd.lngd }
};

// Good - array of similar objects
tanks.push(new Tank(datos));
```

#### Arrays

```javascript
// Good
for (let row of table.rows) { }
for (let i = 0; i < tanks.length; i++) { }

// Use for-of for iteration, for classic loops when index needed
```

### Frontend (p5.js) Specific

```javascript
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
}

function draw() {
  clear();
  // Drawing logic
}

function mousePressed() {
  // Event handlers
}
```

- `setup()` runs once at start
- `draw()` runs every frame (use `noLoop()` to optimize)
- Use p5.js color functions: `color()`, `fill()`, `stroke()`

### Backend (Express) Specific

```javascript
app.get('/api/mapbox-key', (req, res) => {
  res.json({ apiKey: process.env.MAPBOX_API_KEY || '' });
});

async function download(url, filePath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const buffer = await response.buffer();
    fs.writeFileSync(filePath, buffer);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}
```

- Use async/await for asynchronous operations
- Always handle errors with try/catch
- Return proper HTTP status codes

### HTML/CSS

```html
<!-- Good -->
<script src="libraries/p5.min.js"></script>
<script src="javascripts/sketch.js"></script>

<!-- Bad -->
<script src="javascripts/sketch.js"></script>
<script src="libraries/p5.min.js"></script>
```

- Load libraries before application code
- Use semantic HTML when possible

### Git Commit Messages

Format:
```
type: short description

- detailed point 1
- detailed point 2
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`

Examples:
```
feat: update p5.js from 0.8.0 to 1.9.0

fix: canvas resize bug when window changes

refactor: extract UMD rendering to separate class
```

---

## Error Handling

### Frontend
- Check browser console (F12) for JavaScript errors
- Use try/catch in async operations
- Validate data before processing

### Backend
- Always wrap async code in try/catch
- Log errors with `console.error()`
- Never expose sensitive data in error messages

---

## Performance Guidelines

1. **Minimize redraws** - Use `noLoop()` and call `redraw()` only when needed
2. **Cache calculations** - Don't recalculate static data in draw()
3. **Limit DOM manipulation** - p5.js handles this well
4. **Optimize loops** - Move invariant code outside loops

---

## Known Issues / Bugs

- Canvas resizes to square on window resize (unfixed)
- Multiple map instances when switching from flat to satellite view (FIXED)
- Hexagon opacity needs adjustment

---

## Resources

- p5.js: https://p5js.org/reference/
- Mapbox GL JS: https://docs.mapbox.com/mapbox-gl-js/
- Express: https://expressjs.com/
- Google Sheets CSV export: https://support.google.com/docs/answer/3093339

---

## Branch Strategy

- `master` - Stable production code
- `update-tech` - Branch for major technology updates
- Feature branches from `update-tech` or `master`

---

Last updated: 2026-03-27
