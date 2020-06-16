// ToDo
// - Add References
// - Add Roads
// - Add more data (FrontEnd, BBox, Batteries, etc.)
// - Add UMDs
// - Make objects?
// - Github.io 


//Data
let table;
let tableObject;
let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3WkkXWxUp3TXEBsqGeeAtuMNKwVu3ZPASyzY8C43B5fWEyKqp2Xs0sEcM3_VXy_eoJNI_a8Mo8aiN/pub?gid=182439664&single=true&output=csv"
let data = [];
let tanks = [];

//Map settings
let AMIGA_Map;
let canvas;
const mappa = new Mappa('Leaflet');

//Colors

let colors = {
  ok : "limegreen",
  warning : "yellow",
  dead : "red",
  noData : "silver"
}

//GUI settings
// var strokeWidth = 1;
// var strokeColor = '#FFFFFF';
var item = ['ip',
  'cap_hs',
  'radio_uptime',
  'front_end',
  'amiga_box',
  'bbox',
  'terminado'
];
var showLabel = false;
var showName = false;
var showLSID = true;
var showUC = false;
var radius = 2;

// gui
var visible = true;
var gui;

// Lets put all our map options in a single object

const options = {
  lat: -35.11631067505913,
  lng: -69.53360985611256,
  // lat: -35.110417,
  // lng: -69.537750,
  zoom: 14,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}

// const malargue = {
//   // Malargue coords: -35.46667,-69.58333
//   lat: -35.46667,
//   lng: -69.58333,
// }

function preload() {
  table = loadTable(url, "csv", "header");
}

function setup() {
  textAlign(CENTER, CENTER);
  // canvas = createCanvas(640, 640);
  canvas = createCanvas(windowHeight, windowHeight);

  frameRate(10);

  console.log(table);
  // tableObject = table.getObject();
  // Create a tile map with the options declared
  AMIGA_Map = mappa.tileMap(options);
  AMIGA_Map.overlay(canvas);

  // Create Layout GUI
  gui = createGui();
  // gui.setPosition(650,100);
  gui.setPosition(windowHeight + 5, 0);

  // gui.setPosition(10,10);
  sliderRange(0.5, 4, 0.1);
  gui.addGlobals('item',
    'showLSID',
    'showName',
    'showLabel',
    'showUC',
    'radius');

  // Data loading
  for (let row of table.rows) {
    let name = row.get('SD');
    let lsid = row.get('LSID');
    let radio_mikrotik = row.get('Radio_Mikrotik');
    let ip = row.get('IP');
    let amiga_box = row.get('AMIGA_Box');
    let cap_hs = row.get('Cap_HS');
    let terminado = row.get('Terminado');
    let radio_uptime = row.get('Radio_Uptime');
    let front_end = row.get('Front_End');
    let bbox = row.get('BBox');

    //UMDs data
    let id1, id2, id3;
    id1 = row.get('ID_M101');
    id2 = row.get('ID_M102');
    id3 = row.get('ID_M103');
    let ra1, ra2, ra3;
    ra1 = Number(row.get('RA_M101'));
    ra2 = Number(row.get('RA_M102'));
    ra3 = Number(row.get('RA_M103'));
    let rd1, rd2, rd3;
    rd1 = parseFloat(row.get('RD_M101').replace(/\s/g, "").replace(",", "."));
    rd2 = parseFloat(row.get('RD_M102').replace(/\s/g, "").replace(",", "."));
    rd3 = parseFloat(row.get('RD_M103').replace(/\s/g, "").replace(",", "."));
    let pa1, pa2, pa3;
    pa1 = Number(row.get('PA_M101'));
    pa2 = Number(row.get('PA_M102'));
    pa3 = Number(row.get('PA_M103'));
    let ekit1, ekit2, ekit3;
    ekit1 = row.get('eKit_M101');
    ekit2 = row.get('eKit_M102');
    ekit3 = row.get('eKit_M103');
    
    let tx = row.get('TX');
    let dist = row.get('Distrib.');
    
    // Conversion from UTM to LatLng
    let utmz = 19;
    let easting = Number(row.get('LAT'));
    let northing = Number(row.get('LON')) - 10000000;
    var utm = new UTMConv.UTMCoords(utmz, easting, northing);
    var degd = utm.to_deg();
    var pos = {
      lat: degd.latd,
      lng: degd.lngd
    }

    let datos = {
      name,
      lsid,
      pos,
      id1,
      ra1,
      rd1,
      pa1,
      id2,
      ra2,
      rd2,
      pa2,
      id3,
      ra3,
      rd3,
      pa3,
      radio_mikrotik,
      ip,
      cap_hs,
      radio_uptime,
      front_end,
      ekit1, 
      ekit2, 
      ekit3,
      amiga_box,
      tx,
      dist,
      bbox,
      terminado
    }

    // Data pushing
    data.push(datos);
    let tank = new Tank(datos);
    tanks.push(tank);
  }
  console.log(data);
  console.log(tanks);
  // AMIGA_Map.onChange(drawMap);

}

function draw() {
  clear();

  // Zoom settings
  const zoom = AMIGA_Map.zoom();
  const scl = pow(2, zoom);
  const scl2 = 0.0002;
  const offset = radius * 1.5;
  // let escala = constrain(scl * scl2, 2, 6);
  let escala = scl * scl2;

  for (var elt of data) {
    let caseLabel = "_";

    switch (item) {

      case 'amiga_box':
        caseLabel = elt.amiga_box;
        if (caseLabel !== "" && caseLabel !== "-") {
          fill(colors.ok);
        } else if(caseLabel === "" ){
          fill(colors.warning);
        }
        else if(caseLabel === "-" ){
          fill(100, 20);
        }
        else{
          fill(colors.noData);
        }
        break;

      case 'cap_hs':
        caseLabel = elt.cap_hs;
        if (caseLabel === "OK") {
          fill(colors.ok);
        } else if (caseLabel === "CAP") {
          fill("blue");
        } else if (caseLabel === "" && elt.radio_mikrotik === "OK") {
          fill(colors.warning);
        } else {
          fill(colors.noData);
        }
        break;

      case 'terminado':
        caseLabel = elt.terminado;
        if (caseLabel === "Terminado") {
          fill(colors.ok);
        } else {
          fill(colors.noData);
        }
        break;

      case 'radio_uptime':
        caseLabel = elt.radio_uptime;
        if (caseLabel === "OK") {
          fill(colors.ok);
        } else if (caseLabel === "DEAD") {
          fill(colors.dead);
        } else if (caseLabel === "REBOOT") {
          fill(colors.warning);
        } else {
          fill(colors.noData);
        }
        break;

      case 'ip':
        caseLabel = elt.ip;
        if (caseLabel !== "" && caseLabel !== "-") {
          fill(colors.ok);
        } 
        else if(caseLabel === "-" ){
          fill(100, 20);
        }
        else {
          fill(colors.noData);
        }
        break;
    }

    // console.log(escala);
    const point = AMIGA_Map.latLngToPixel(elt.pos.lat,
      elt.pos.lng);

    stroke(255);
    strokeWeight(1);
    circle(point.x, point.y, radius * 2 * escala);

    var textID;

    if (showName == true && showLSID == true) {
      textID = elt.name + " (" + elt.lsid + ")";
    } else if (showName == true && showLSID == false) {
      textID = elt.name;
    } else if (showName == false && showLSID == true) {
      textID = "(" + elt.lsid + ")";
    } else {
      textID = "()";
    }

    let textsize = 3 * escala;
    textSize(textsize);
    fill(51);
    noStroke();
    text(textID, point.x, point.y - offset * escala);

    if (showLabel) {
      text(caseLabel, point.x, point.y + offset * escala);
    }
  }

  for (let i = 0; i < tanks.length; i++){
    tanks[i].update();
    tanks[i].showSD(escala);
    if (tanks[i].lsid === '1767' || tanks[i].lsid === '1765'){
      tanks[i].showUMD(escala);
    }
  }

  if (showUC) {
    drawUC();
  }
  // noLoop();

}

function tank(datos) {

//   this.lat = coordenadas.lat;
//   this.lng = coordenadas.lng;
//   this.nombre = datos.nombre;

//   this.show = function() {
//     ellipse(datos.x, datos.y, datos.d * 10);

//     textAlign(CENTER, BOTTOM);
//     text(this.nombre, datos.x, datos.y - 10)
//   }
return
}

function keyPressed() {
  switch (key) {
    // type [p] to hide / show the GUI
    case 'p':
      visible = !visible;
      if (visible) gui.show();
      else gui.hide();
      break;
  }
}

function drawUC() {
  let lista = ['93',
    '1574',
    '1570',
    '688',
    '1764',
    '1773',
    '93'
  ];
  let puntos = []
  for (var i of lista) {
    for (var j = 0; j < data.length; j++) {
      if (data[j].lsid == i) {
        puntos.push(data[j].pos);
      }
    }
  }
  strokeWeight(1);
  noFill();
  stroke(127);
  beginShape();
  for (var elt of puntos) {
    const point = AMIGA_Map.latLngToPixel(elt.lat, elt.lng);
    vertex(point.x, point.y);
    endShape();
  }
}

function addText() {
  const point = AMIGA_Map.latLngToPixel(elt.lat, elt.lng);
}

// function windowResized() {
//   resizeCanvas(windowHeight, windowHeight);
// }