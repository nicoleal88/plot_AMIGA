class Tank {
  constructor(datos) {
    this.name = datos.name;
    this.lsid = datos.lsid
    this.pos = datos.pos
    this.point = {};
    this.id1 = datos.id1
    this.ra1 = datos.ra1
    this.rd1 = datos.rd1
    this.pa1 = datos.pa1
    this.id2 = datos.id2
    this.ra2 = datos.ra2
    this.rd2 = datos.rd2
    this.pa2 = datos.pa2
    this.id3 = datos.id3
    this.ra3 = datos.ra3
    this.rd3 = datos.rd3
    this.pa3 = datos.pa3
    this.radio_mikrotik = datos.radio_mikrotik
    this.ip = datos.ip
    this.cap_disipador = datos.cap_disipador
    this.radio_uptime = datos.radio_uptime
    this.front_end = datos.front_end
    this.ekit1 = datos.ekit1
    this.ekit2 = datos.ekit2
    this.ekit3 = datos.ekit3
    this.amiga_box = datos.amiga_box
    this.tx = datos.tx
    this.dist = datos.dist
    this.bbox = datos.bbox
    this.tipo = datos.tipo
    this.observaciones = datos.observaciones
    this.terminado = datos.terminado

    this.caseLabel = "_-_";
    this.textID;
    this.textsize;

    this.radius = 1.8;

    this.plot = true;
    this.selected = false;
  }

  update() {
    this.point = AMIGA_Map.latLngToPixel(this.pos.lat, this.pos.lng)
  }

  showSD(scl, item, label, name, lsid) {
    this.textsize = constrain(3 * scl * propiedades.mult, 1, 18);

    if (this.selected){
      push();
      textAlign(CENTER, CENTER);
      fill(colors.selected);
      textSize(3 * scl * propiedades.mult);
      noStroke();
      text("<      >", this.point.x, this.point.y);
      pop();
      strokeWeight(0.8 * scl * propiedades.mult);
      stroke(colors.selected);
    }

    // Get fill color acording to item
    this.getColor(item);
    // Draw SD
    circle(this.point.x, this.point.y, this.radius * 2 * scl * propiedades.mult);
    imageMode(CENTER);
    // tint(255,0,0,127);
    // image(sd_img,this.point.x, this.point.y, this.radius * 2 * scl * propiedades.mult, this.radius * 2 * 1.185 * scl * propiedades.mult);
    // Draw label text
    if (label) {
      textAlign(CENTER, TOP);
      noStroke();
      text(this.caseLabel, this.point.x, this.point.y + this.radius * 1.5 * scl * propiedades.mult);
    }
    // Draw Name and/or LSID

    if (name == true && lsid == true) {
      this.textID = this.name + " (" + this.lsid + ")";
    } else if (name == true && lsid == false) {
      this.textID = this.name;
    } else if (name == false && lsid == true) {
      this.textID = "(" + this.lsid + ")";
    } else {
      this.textID = "(-_-)";
    }

    textAlign(CENTER, BOTTOM);
    textSize(this.textsize);
    fill(127);
    noStroke();
    text(this.textID, this.point.x, this.point.y - this.radius * 1.5 * scl * propiedades.mult);

    
     
  }
// Draw popup
  showPopup(){
    if (dist(mouseX, mouseY, this.point.x, this.point.y) < 10) {
      push();
      textAlign(LEFT);
      stroke(255,255,191);
      strokeWeight(2);
      fill(0, 240);
    	rect(mouseX+10, mouseY+10, 170,80,7);
      fill(255);
      textSize(14);
      noStroke();
      text("Name: " + this.name, mouseX + 20, mouseY + 30);
      text("LSID: " + this.lsid, mouseX + 20, mouseY + 50);
      text("IP: " + this.ip, mouseX + 20, mouseY + 70);
      // text(this.observaciones, mouseX + 20, mouseY + 70);
      pop();
    }
  }

  selectSD(){
    if (dist(mouseX, mouseY, this.point.x, this.point.y) < 10) {
      this.selected = !this.selected;      
    }
  }

  showUMD(scl) {
    this.update();
    //M101
    let M101 = new UMD(this.point.x, this.point.y, this.ra1, this.rd1, this.pa1, this.id1, this.ekit1, "M101");
    M101.show(scl * propiedades.mult);
    let M102 = new UMD(this.point.x, this.point.y, this.ra2, this.rd2, this.pa2, this.id2, this.ekit2, "M102");
    M102.show(scl * propiedades.mult);
    let M103 = new UMD(this.point.x, this.point.y, this.ra3, this.rd3, this.pa3, this.id3, this.ekit3, "M103");
    M103.show(scl * propiedades.mult);
    // M101.drawLine();
    //M101
    // let M102 = new UMD(90, 87, 164);
    // M102.show();
    //M101
    // let M103 = new UMD(90, 102, 166);
    // M103.show();
  }

  getColor(option) {
    switch (option) {
      case 'amiga_box':
        this.caseLabel = this.amiga_box;
        if (this.caseLabel !== "" && this.caseLabel !== "-") {
          fill(colors.ok);
        } else if (this.caseLabel === "") {
          fill(colors.warning);
        } else if (this.caseLabel === "-") {
          fill(100, 20);
        } else {
          fill(colors.noData);
        }
        break;

      case 'cap_disipador':
        this.caseLabel = this.cap_disipador;
        if (this.caseLabel === "OK") {
          fill(colors.ok);
        } else if (this.caseLabel === "CAP") {
          fill("blue");
        } else if (this.caseLabel === "OLD") {
          fill(colors.warning);
        } else {
          fill(colors.noData);
        }
        break;

      case 'terminado':
        this.caseLabel = this.terminado;
        if (this.caseLabel === "Terminado") {
          fill(colors.ok);
        } else if(this.caseLabel === "Casi"){
          fill(colors.warning);
        } else {
          fill(colors.noData);
        }
        break;

      case 'front_end':
        this.caseLabel = this.front_end;
        if (this.caseLabel === "Cyclone") {
          fill(colors.ok);
        } else if (this.caseLabel === "3.3" || this.caseLabel === "3.1" ) {
          fill(colors.warning);
        } else {
          fill(colors.noData);
        }
        break;
        
        case 'radio_uptime':
          this.caseLabel = this.radio_uptime;
          if (this.caseLabel === "OK") {
            fill(colors.ok);
          } else if (this.caseLabel === "DEAD") {
            fill(colors.dead);
          } else if (this.caseLabel === "REBOOT") {
            fill(colors.warning);
          } else {
            fill(colors.noData);
          }
          break;

      case 'ip':
        this.caseLabel = this.ip;
        if (this.caseLabel !== "" && this.caseLabel !== "-") {
          fill(colors.ok);
        } else if (this.caseLabel === "-") {
          fill(100, 20);
        } else {
          fill(colors.noData);
        }
        break;

      case 'observaciones':
        this.caseLabel = this.observaciones;
        if (this.caseLabel == "" || this.caseLabel == "-") {
          fill(colors.noData);
        } else {
          fill(colors.warning);
        }
        break;
    }
  }
}