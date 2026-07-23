const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  localStorage: 'readonly',
  XMLHttpRequest: 'readonly',
  Blob: 'readonly',
  URL: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  setTimeout: 'readonly',
  console: 'readonly',
  fetch: 'readonly',
  caches: 'readonly',
  self: 'readonly',
  Response: 'readonly',
  Event: 'readonly',
  Promise: 'readonly',
  Map: 'readonly',
  Set: 'readonly',
  Number: 'readonly',
  String: 'readonly',
  Date: 'readonly',
  Math: 'readonly',
  JSON: 'readonly',
  Error: 'readonly',
  parseFloat: 'readonly',
  isNaN: 'readonly',
  alert: 'readonly',
  Mappa: 'readonly',
  gui: 'readonly',
  UTMConv: 'readonly',
  lil: 'readonly',
  propiedades: 'writable',
  createCanvas: 'readonly',
  resizeCanvas: 'readonly',
  windowWidth: 'readonly',
  windowHeight: 'readonly',
  width: 'readonly',
  height: 'readonly',
  loadStrings: 'readonly',
  loadTable: 'readonly',
  color: 'readonly',
  clear: 'readonly',
  fill: 'readonly',
  stroke: 'readonly',
  strokeWeight: 'readonly',
  noStroke: 'readonly',
  noFill: 'readonly',
  circle: 'readonly',
  ellipse: 'readonly',
  rect: 'readonly',
  line: 'readonly',
  beginShape: 'readonly',
  vertex: 'readonly',
  endShape: 'readonly',
  text: 'readonly',
  textSize: 'readonly',
  textAlign: 'readonly',
  CENTER: 'readonly',
  CLOSE: 'readonly',
  LEFT: 'readonly',
  RIGHT: 'readonly',
  mouseX: 'readonly',
  mouseY: 'readonly',
  dist: 'readonly',
  min: 'readonly',
  max: 'readonly',
  map: 'readonly',
  cos: 'readonly',
  sin: 'readonly',
  radians: 'readonly',
  atan2: 'readonly',
  degrees: 'readonly',
  push: 'readonly',
  pop: 'readonly',
  translate: 'readonly',
  rotate: 'readonly',
  drawingContext: 'readonly',
  pow: 'readonly',
  constrain: 'readonly',
  imageMode: 'readonly',
  rectMode: 'readonly',
  angleMode: 'readonly',
  requestAnimationFrame: 'readonly',
  cancelAnimationFrame: 'readonly',
  performance: 'readonly',
  pmouseX: 'readonly',
  pmouseY: 'readonly',
  save: 'readonly',
  TOP: 'readonly',
  BOTTOM: 'readonly',
  DEGREES: 'readonly'
};

const nodeGlobals = {
  require: 'readonly',
  module: 'readonly',
  process: 'readonly',
  console: 'readonly',
  fetch: 'readonly',
  window: 'readonly',
  globalThis: 'readonly',
  Response: 'readonly',
  URL: 'readonly',
  AbortSignal: 'readonly',
  TextDecoder: 'readonly',
  Buffer: 'readonly',
  Number: 'readonly',
  Promise: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly'
};

module.exports = [
  {
    ignores: ['public/libraries/**']
  },
  {
    files: ['app.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: nodeGlobals
    },
    rules: {
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-unreachable': 'error'
    }
  },
  {
    files: ['public/sw.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'script',
      globals: browserGlobals
    },
    rules: {
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-unreachable': 'error'
    }
  },
  {
    files: ['public/javascripts/sketch.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'script',
      globals: {
        ...browserGlobals,
        Tank: 'readonly',
        UMD: 'readonly'
      }
    },
    rules: {
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-unreachable': 'error'
    }
  },
  {
    files: ['public/javascripts/tank.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'script',
      globals: {
        ...browserGlobals,
        AMIGA_Map: 'writable',
        colors: 'writable',
        showPower: 'writable',
        UMD: 'readonly'
      }
    },
    rules: {
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-unreachable': 'error'
    }
  },
  {
    files: ['public/javascripts/umd.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'script',
      globals: browserGlobals
    },
    rules: {
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-unreachable': 'error'
    }
  },
  {
    files: ['test/**/*.js', 'playwright.config.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: nodeGlobals
    },
    rules: {
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-unreachable': 'error'
    }
  }
];
