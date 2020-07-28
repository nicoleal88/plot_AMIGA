// ToDo
// - Add more data (FrontEnd, BBox, Batteries, etc.)
// - Add trip button
// - Add table with selected SDs properties

// Done
// - Add References 
// - Add Roads
// - Add UMDs
// - Make objects?
// - Github.io
// - Add classification of SDs (Araya, 433, AERALet, etc.) 
// - Divide GUI into categories
// - Add title of the things being plotted
// - Add SD png image
// - Add selection on click
// - Add button to export
// - Add date to title
// - Add UMDs from UC
// - Fix 5m2 UMDs (UC)
// - Draw UMD only if its data exists (to remove UMDs on 0,0 coordinates)
// - Change zoom() to getZoom() to smoother animations

// Bugs
// - Canvas resizes to square on window's resize

//Data
let table;
let tableObject;
// URL withouth proxy for CORS
// let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3WkkXWxUp3TXEBsqGeeAtuMNKwVu3ZPASyzY8C43B5fWEyKqp2Xs0sEcM3_VXy_eoJNI_a8Mo8aiN/pub?gid=182439664&single=true&output=csv"
// URL with heroku proxy for CORS access
let url = "https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vS3WkkXWxUp3TXEBsqGeeAtuMNKwVu3ZPASyzY8C43B5fWEyKqp2Xs0sEcM3_VXy_eoJNI_a8Mo8aiN/pub?gid=182439664&single=true&output=csv"
let data = [];
let tanks = [];
let roads = [];
let tracks = [];
// let roadsFile;
let tracksFile;
// let sd_img;

//Map settings
let AMIGA_Map;
let canvas;
// Mapbox API key
var key = 'pk.eyJ1Ijoibmljb2xlYWw4OCIsImEiOiJjazA3NWRmaHYzdjM5M2xwMHhoeGEwcnNhIn0.U9_rp4dKVkuTWEHODTHdgg';
var mappa = new Mappa('MapboxGL', key);
// const mappa = new Mappa('Leaflet');

//Colors
let colors;
let roadsColor;

// New gui
let newGUI;
let items;
let showInfo;
let showHexagons;
let showSDs;
let showPower;
let mult;

// Lets put all our map options in a single object

// Leaflet options
// const options = {
//   lat: -35.11631067505913,
//   lng: -69.53360985611256,
//   // lat: -35.110417,
//   // lng: -69.537750,
//   zoom: 14,
//   style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   scl : 0.00001
// }

// Mapbox options
var options = {
  lat: -35.11631067505913,
  lng: -69.53360985611256,
  zoom: 13.2,
  // style: "mapbox://styles/mapbox/satellite-streets-v9",
  style: "mapbox://styles/mapbox/dark-v9",
  pitch: 0,
  bearing: 0,
  minZoom: 1,
  maxZoom: 20,
  renderWorldCopies: false,
  scl : 0.00002
}

// Hexagons
let UC = ['93', '1574', '1570', '688', '1764', '1773', '93'];
let MARTA = ['1764', '688', '1760', '1767', '669', '1765', '1764'];
let h433_1 = ['30', '12', '97', '47', '99', '11', '30'];
let h433_2 = ['27', '29', '28', '54', '50', '42', '27'];

// const malargue = {
//   // Malargue coords: -35.46667,-69.58333
//   lat: -35.46667,
//   lng: -69.58333,
// }

let draww = true;
let count;
let n = 30;

function preload() {
  table = loadTable(url, "csv", "header");
  // roadsFile = loadStrings("files/Rutas.dat");
  tracksFile = loadStrings("files/Tracks-AERA-PM.dat");
  // sd_img = loadImage("files/SD.png");
}

function setup() {
  // canvas = createCanvas(640, 640);
  // let minSize = min(windowHeight, windowWidth);
  // canvas = createCanvas(minSize, minSize);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-div');
  canvas.mouseWheel(makeDraw);
  count = n;
  // frameRate(10);
  
  colors = {
    ok: "#2ECC40", // green
    warning: "#FFDC00", // yellow
    dead: "#FF4136", // red
    noData: "silver",
    roads : color(255, 204, 0, 50),
    selected : "#FF851B" // Orange
  }
  
  // console.log(table);
  // console.log(roadsFile);
  // roads = loadRoads(roadsFile);
  tracks = loadRoads(tracksFile);
  // tableObject = table.getObject();
  // Create a tile map with the options declared
  AMIGA_Map = mappa.tileMap(options);
  AMIGA_Map.overlay(canvas);

  // New gui config
  newGUI = new dat.GUI();

  propiedades = {
    item: "status",
    mult: 25,
    screenshot: takeScreenshot
  };

  newGUI.add(propiedades, 'item', [ 'status',
                                    'cap_disipador',
                                    'ip',
                                    'radio_uptime',
                                    'front_end',
                                    'surf_electronics',
                                    'under_electronics',
                                    'power_system',
                                    'to_do'
                                  ])
  newGUI.add(propiedades, 'mult', 1, 50);

  newGUI.add(propiedades, 'screenshot');

  let infoFolder = newGUI.addFolder("Show info");
  showInfo = {
    showLabel: true,
    showName: false,
    showLSID: true,
    showUMDs: false,
    showRoads: false
  };
  infoFolder.add(showInfo, 'showName');
  infoFolder.add(showInfo, 'showLSID');
  infoFolder.add(showInfo, 'showLabel');
  infoFolder.add(showInfo, 'showUMDs');
  infoFolder.add(showInfo, 'showRoads');

  let hexagonsFolder = newGUI.addFolder("Show hexagons");
  showHexagons = {
    showUC: false,
    showMARTA: false,
    show433_1: false,
    show433_2: false
  }
  hexagonsFolder.add(showHexagons, 'showUC');
  hexagonsFolder.add(showHexagons, 'showMARTA');
  hexagonsFolder.add(showHexagons, 'show433_1');
  hexagonsFolder.add(showHexagons, 'show433_2');

  let sdFolder = newGUI.addFolder("Show SDs");
  showSDs = {
    show433: true,
    showTwins_KT: false,
    showCampoIbarra: true,
    showCampoAraya: true
  }
  sdFolder.add(showSDs, 'show433');
  sdFolder.add(showSDs, 'showTwins_KT');
  sdFolder.add(showSDs, 'showCampoIbarra');
  sdFolder.add(showSDs, 'showCampoAraya');

  let powerFolder = newGUI.addFolder("Show Power");
  showPower = {
    showTubing: false,
    showSupport: false,
    showSolarPanel: false,
    showBatteryBox: false,
  }
  powerFolder.add(showPower, 'showTubing');
  powerFolder.add(showPower, 'showSupport');
  powerFolder.add(showPower, 'showSolarPanel');
  powerFolder.add(showPower, 'showBatteryBox');

  infoFolder.open();

  // Data loading
  for (let row of table.rows) {
    let name = row.get('SD');
    let lsid = row.get('LSID');
    let radio_mikrotik = row.get('Radio_Mikrotik');
    let ip = row.get('IP');
    let amiga_box = row.get('AMIGA_Box');
    let cap_disipador = row.get('Cap_HS');
    let status = row.get('Status');
    let radio_uptime = row.get('Radio_Uptime');
    let front_end = row.get('Front_End');
    let tubing = row.get('Tubing_PS');
    let soporte = row.get('Soporte_PS');
    let solar_panel = row.get('PS_AMIGA');
    let bat_1 = row.get('Bateria_1');
    let bat_2 = row.get('Bateria_2');
    let regulator = row.get('Regulador');
    let bbox = row.get('BBox');
    let tipo = row.get('Tipo');
    let to_do = row.get('To_Do');

    //UMDs data
    let cableado;
    cableado = row.get('Cableado_UMDs');
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

    //UMDs UC data
    let id1_cu, id2_cu, id3_cu, id4_cu, id5_cu, id6_cu, id7_cu, id8_cu, id9_cu;
    id1_cu = row.get('ID_M101_CU');
    id2_cu = row.get('ID_M102_CU');
    id3_cu = row.get('ID_M103_CU');
    id4_cu = row.get('ID_M104_CU');
    id5_cu = row.get('ID_M105_CU');
    id6_cu = row.get('ID_M106_CU');
    id7_cu = row.get('ID_M107_CU');
    id8_cu = row.get('ID_M108_CU');
    id9_cu = row.get('ID_M109_CU');
    let ra1_cu, ra2_cu, ra3_cu, ra4_cu, ra5_cu, ra6_cu, ra7_cu, ra8_cu, ra9_cu;
    ra1_cu = parseFloat(row.get('RA_M101_CU').replace(/\s/g, "").replace(",", "."));
    ra2_cu = parseFloat(row.get('RA_M102_CU').replace(/\s/g, "").replace(",", "."));
    ra3_cu = parseFloat(row.get('RA_M103_CU').replace(/\s/g, "").replace(",", "."));
    ra4_cu = parseFloat(row.get('RA_M104_CU').replace(/\s/g, "").replace(",", "."));
    ra5_cu = parseFloat(row.get('RA_M105_CU').replace(/\s/g, "").replace(",", "."));
    ra6_cu = parseFloat(row.get('RA_M106_CU').replace(/\s/g, "").replace(",", "."));
    ra7_cu = parseFloat(row.get('RA_M107_CU').replace(/\s/g, "").replace(",", "."));
    ra8_cu = parseFloat(row.get('RA_M108_CU').replace(/\s/g, "").replace(",", "."));
    ra9_cu = parseFloat(row.get('RA_M109_CU').replace(/\s/g, "").replace(",", "."));
    let rd1_cu, rd2_cu, rd3_cu, rd4_cu, rd5_cu, rd6_cu, rd7_cu, rd8_cu, rd9_cu;
    rd1_cu = parseFloat(row.get('RD_M101_CU').replace(/\s/g, "").replace(",", "."));
    rd2_cu = parseFloat(row.get('RD_M102_CU').replace(/\s/g, "").replace(",", "."));
    rd3_cu = parseFloat(row.get('RD_M103_CU').replace(/\s/g, "").replace(",", "."));
    rd4_cu = parseFloat(row.get('RD_M104_CU').replace(/\s/g, "").replace(",", "."));
    rd5_cu = parseFloat(row.get('RD_M105_CU').replace(/\s/g, "").replace(",", "."));
    rd6_cu = parseFloat(row.get('RD_M106_CU').replace(/\s/g, "").replace(",", "."));
    rd7_cu = parseFloat(row.get('RD_M107_CU').replace(/\s/g, "").replace(",", "."));
    rd8_cu = parseFloat(row.get('RD_M108_CU').replace(/\s/g, "").replace(",", "."));
    rd9_cu = parseFloat(row.get('RD_M109_CU').replace(/\s/g, "").replace(",", "."));
    let pa1_cu, pa2_cu, pa3_cu, pa4_cu, pa5_cu, pa6_cu, pa7_cu, pa8_cu, pa9_cu;
    pa1_cu = parseFloat(row.get('PA_M101_CU').replace(/\s/g, "").replace(",", "."));
    pa2_cu = parseFloat(row.get('PA_M102_CU').replace(/\s/g, "").replace(",", "."));
    pa3_cu = parseFloat(row.get('PA_M103_CU').replace(/\s/g, "").replace(",", "."));
    pa4_cu = parseFloat(row.get('PA_M104_CU').replace(/\s/g, "").replace(",", "."));
    pa5_cu = parseFloat(row.get('PA_M105_CU').replace(/\s/g, "").replace(",", "."));
    pa6_cu = parseFloat(row.get('PA_M106_CU').replace(/\s/g, "").replace(",", "."));
    pa7_cu = parseFloat(row.get('PA_M107_CU').replace(/\s/g, "").replace(",", "."));
    pa8_cu = parseFloat(row.get('PA_M108_CU').replace(/\s/g, "").replace(",", "."));
    pa9_cu = parseFloat(row.get('PA_M109_CU').replace(/\s/g, "").replace(",", "."));
    let ekit1_cu, ekit2_cu, ekit3_cu, ekit4_cu, ekit5_cu, ekit6_cu, ekit7_cu, ekit8_cu, ekit9_cu;
    ekit1_cu = row.get('eKit_M101_CU');
    ekit2_cu = row.get('eKit_M102_CU');
    ekit3_cu = row.get('eKit_M103_CU');
    ekit4_cu = row.get('eKit_M104_CU');
    ekit5_cu = row.get('eKit_M105_CU');
    ekit6_cu = row.get('eKit_M106_CU');
    ekit7_cu = row.get('eKit_M107_CU');
    ekit8_cu = row.get('eKit_M108_CU');
    ekit9_cu = row.get('eKit_M109_CU');
    let a1_cu, a2_cu, a3_cu, a4_cu, a5_cu, a6_cu, a7_cu, a8_cu, a9_cu;
    a1_cu = Number(row.get('a_M101_CU'));
    a2_cu = Number(row.get('a_M102_CU'));
    a3_cu = Number(row.get('a_M103_CU'));
    a4_cu = Number(row.get('a_M104_CU'));
    a5_cu = Number(row.get('a_M105_CU'));
    a6_cu = Number(row.get('a_M106_CU'));
    a7_cu = Number(row.get('a_M107_CU'));
    a8_cu = Number(row.get('a_M108_CU'));
    a9_cu = Number(row.get('a_M109_CU'));

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
      cap_disipador,
      radio_uptime,
      front_end,
      ekit1,
      ekit2,
      ekit3,
      amiga_box,
      tx,
      dist,
      tubing,
      soporte,
      solar_panel,
      bat_1,
      bat_2,
      regulator,
      bbox,
      tipo,
      to_do,
      status,
      cableado,
      id1_cu,
      id2_cu,
      id3_cu,
      id4_cu,
      id5_cu,
      id6_cu,
      id7_cu,
      id8_cu,
      id9_cu,
      ra1_cu,
      ra2_cu,
      ra3_cu,
      ra4_cu,
      ra5_cu,
      ra6_cu,
      ra7_cu,
      ra8_cu,
      ra9_cu,
      rd1_cu,
      rd2_cu,
      rd3_cu,
      rd4_cu,
      rd5_cu,
      rd6_cu,
      rd7_cu,
      rd8_cu,
      rd9_cu,
      pa1_cu,
      pa2_cu,
      pa3_cu,
      pa4_cu,
      pa5_cu,
      pa6_cu,
      pa7_cu,
      pa8_cu,
      pa9_cu,
      ekit1_cu,
      ekit2_cu,
      ekit3_cu,
      ekit4_cu,
      ekit5_cu,
      ekit6_cu,
      ekit7_cu,
      ekit8_cu,
      ekit9_cu,
      a1_cu,
      a2_cu,
      a3_cu,
      a4_cu,
      a5_cu,
      a6_cu,
      a7_cu,
      a8_cu,
      a9_cu
    }

    // Data pushing
    data.push(datos);
    let tank = new Tank(datos);
    tanks.push(tank);
  }
  // console.log(data);
  // console.log(tanks);
  // AMIGA_Map.onChange(drawMap);
}

function draw() {
  mouseMoving();
  if (draww){
  clear();
  // Zoom settings
  const zoom = AMIGA_Map.getZoom(); //getZoom() returns a float, zoom() an int
  const scl1 = pow(2, zoom);
  // const sclm =  // Escala para unidades en metros Leaflet
  const sclm = options.scl // Escala para unidades en metros Mapbox
  // const scl2 = 0.0002;
  // const offset = radius * 1.5;
  // let escala = constrain(scl * scl2, 2, 6);
  let escalaReal = scl1 * sclm;

  // Disable SDs plotting:
  for (let i = 0; i < tanks.length; i++) {
    tanks[i].update(); // Updates the position on the map

    if (showSDs.show433 == false && tanks[i].tipo == '433m') {
      tanks[i].plot = false;
    } else if (showSDs.showTwins_KT == false && tanks[i].tipo == 'Twins_KT') {
      tanks[i].plot = false;
    } else if (showSDs.showCampoIbarra == false && tanks[i].tipo == 'Campo_Ibarra') {
      tanks[i].plot = false;
    } else if (showSDs.showCampoAraya == false && tanks[i].tipo == 'Campo_Araya') {
      tanks[i].plot = false;
    } else {
      tanks[i].plot = true;
    }
  }

  // Plot SDs
  for (let i = 0; i < tanks.length; i++) {
    if (tanks[i].plot == true){
      tanks[i].showSD(escalaReal, propiedades.item, showInfo.showLabel, showInfo.showName, showInfo.showLSID); // Plots with a certain scale
    }
  }

  // Plot UMDs
  for (let i = 0; i < tanks.length; i++) {
    if (tanks[i].plot == true){
      if (showInfo.showUMDs) {
        if (tanks[i].status) { // If the position is finished, and the checkbox is enabled:
          tanks[i].showUMD(escalaReal); // Show the UMDs
          }
        }
    }
  }

  // Plot popups
  for (let i = 0; i < tanks.length; i++) {
    if (tanks[i].plot == true){
    tanks[i].update(); // Updates the position on the map
    tanks[i].showPopup();
    }
  }

  // Plot hexagons
  if (showHexagons.showUC) {
    drawShape(UC, "black");
  }
  if (showHexagons.showMARTA) {
    drawShape(MARTA, "orange");
  }
  if (showHexagons.show433_1) {
    drawShape(h433_1, "blue");
  }
  if (showHexagons.show433_2) {
    drawShape(h433_2, "cyan");
  }

  // Plot roads and tracks
  // if (showInfo.showRoads) {
  //   drawRoads(roads, "white");
  // }
  if (showInfo.showRoads) {
    drawRoads(tracks, colors.roads);
  }

  // Plot References
  showReferences();
  showTitle(propiedades.item);

  // noLoop();
  text(count, 5, 180);
  count--;
    if (count < 0){
    draww = false;
    }
  }
}

// function keyPressed() {
//   switch (key) {
//     // type [p] to hide / show the GUI
//     case 'p':
//       visible = !visible;
//       if (visible) gui.show();
//       else gui.hide();
//       break;
//   }
// }

function mouseMoving(){
    let d = dist(mouseX, mouseY, pmouseX, pmouseY);
    if (d>1){
      draww = true;
      count = n;
    }
  }

function mouseClicked(){
  for (let i = 0; i < tanks.length; i++) {
    if (tanks[i].plot == true){
    tanks[i].selectSD(); // Updates the position on the map
    // console.log(tanks[i].selected);
    }
  }
}

function mousePressed(){
    draww = true;
    count = n;
}

function makeDraw(){
    draww = true;
    count = n;
}

function takeScreenshot(){
  push();

  save('myCanvas.png');
  pop();
  return false;
}

function drawShape(lista, col) {
  let puntos = [];
  for (var i of lista) {
    for (var j = 0; j < data.length; j++) {
      if (data[j].lsid == i) {
        puntos.push(data[j].pos);
      }
    }
  }
  push();
  strokeWeight(2);
  noFill();
  stroke(col);
  beginShape();
  for (var elt of puntos) {
    const point = AMIGA_Map.latLngToPixel(elt.lat, elt.lng);
    vertex(point.x, point.y);
  }
  endShape();
  pop();
}

function showReferences() {
  let width = 100;
  let height = 160;
  textAlign(LEFT, CENTER);
  push();
  stroke(127);
  strokeWeight(1);
  fill(51, 200);
  rect(0, 0, width, height, 5);
  pop();
  push();
  fill(200);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text("References:", 5, 15);
  
  textSize(14);
  fill(colors.ok);
  circle(8, 45, 10);
  text("    OK", 5, 45);
  fill(colors.warning);
  circle(8, 75, 10);
  text("    Needs fix",5, 75);
  fill(colors.dead);
  circle(8, 105, 10);
  text("    Critical", 5, 105);
  fill(colors.noData);
  circle(8, 135, 10);
  text("    No Data", 5, 135);
  pop();
  // const point = AMIGA_Map.latLngToPixel(elt.lat, elt.lng);
}

function showTitle(text_) {
  let t = text_.replace("_", " ");
  t = toTitleCase(t);
  let date = day().toString() + "/" + month().toString() + "/" + year().toString();
  let info = t + " ("+date+")";
  let width = info.length * 10;
  let height = 30;
  push();
  stroke(127);
  strokeWeight(1);
  fill(51, 200);
  rectMode(CENTER);
  rect(canvas.width/2 , height * 0.5 + 5 , width, height, 5);
  pop();
  push();
  fill(200);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text(info, canvas.width /2, height * 0.5 + 5);
  pop();
  // const point = AMIGA_Map.latLngToPixel(elt.lat, elt.lng);
}

function loadRoads(file) {
  let allroads = [];
  let road = []
  for (i = 0; i < file.length; i++) {
    let line = file[i].split(/\s+/);
    if (line.length == 2) {
      let pointUTM = {
        latUTM: line[0],
        lngUTM: line[1]
      }
      let utmz = 19;
      let easting = Number(pointUTM.latUTM);
      let northing = Number(pointUTM.lngUTM) - 10000000;
      var utm = new UTMConv.UTMCoords(utmz, easting, northing);
      var degd = utm.to_deg();
      var pos = {
      lat: degd.latd,
      lng: degd.lngd
    }
      road.push(pos);
    } else {
      allroads.push(road);
      road = []
    }
  }
  allroads.push(road);
  // console.log(allroads);
  return allroads;
}

function drawRoads(list, col) {
  for (i = 0; i < list.length; i++) {
    push();
    strokeWeight(2);
    noFill();
    stroke(col);
    beginShape();
    for (var elt of list[i]) {
      const point = AMIGA_Map.latLngToPixel(elt.lat, elt.lng);
      vertex(point.x, point.y);
    }
    endShape();
    pop();
  }
}

function toTitleCase(str) {
  return str.replace(
      /\w\S*/g,
      function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
  );
}

function windowResized() {
  resizeCanvas(windowHeight, windowHeight);
}

//GUI settings
// var strokeWidth = 1;
// var strokeColor = '#FFFFFF';

// let item = [
//   'cap_hs',
//   'ip',
//   'radio_uptime',
//   'front_end',
//   'amiga_box',
//   'bbox',
//   'status'
// ];

// var showLabel = true;
// var showName = false;
// var showLSID = true;
// var showUMDs = false;

// var showUC = false;
// var showMARTA = false;
// var show433_1 = false;
// var show433_2 = false;

// var show433 = true;
// var showTwins_KT = false;
// var showCampoIbarra = true;
// var showCampoAraya = true;

// gui
// var visible = true;
// var gui;

// Create Layout GUI
// gui = createGui();
// gui.setPosition(650,100);
// gui.setPosition(windowHeight + 5, 0);

// gui.setPosition(10,10);
// sliderRange(1, 50, 1);
// gui.addGlobals('item',
//   'showLSID',
//   'showName',
//   'showLabel',
//   'showUMDs',
//   'show433',
//   'showTwins_KT',
//   'showCampoIbarra',
//   'showCampoAraya',
//   'showUC',
//   'showMARTA',
//   'show433_1',
//   'show433_2',
//   'mult');
