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
    this.distrib = datos.distrib
    this.tubing = datos.tubing
    this.soporte = datos.soporte
    this.solar_panel = datos.solar_panel
    this.bat_1 = datos.bat_1
    this.bat_2 = datos.bat_2
    this.regulator = datos.regulator
    this.bbox = datos.bbox
    this.tipo = datos.tipo
    this.to_do = datos.to_do
    this.status = datos.status
    this.cableado = datos.cableado
    this.id1_cu = datos.id1_cu
    this.id2_cu = datos.id2_cu
    this.id3_cu = datos.id3_cu
    this.id4_cu = datos.id4_cu
    this.id5_cu = datos.id5_cu
    this.id6_cu = datos.id6_cu
    this.id7_cu = datos.id7_cu
    this.id8_cu = datos.id8_cu
    this.id9_cu = datos.id9_cu
    this.ra1_cu = datos.ra1_cu
    this.ra2_cu = datos.ra2_cu
    this.ra3_cu = datos.ra3_cu
    this.ra4_cu = datos.ra4_cu
    this.ra5_cu = datos.ra5_cu
    this.ra6_cu = datos.ra6_cu
    this.ra7_cu = datos.ra7_cu
    this.ra8_cu = datos.ra8_cu
    this.ra9_cu = datos.ra9_cu
    this.rd1_cu = datos.rd1_cu
    this.rd2_cu = datos.rd2_cu
    this.rd3_cu = datos.rd3_cu
    this.rd4_cu = datos.rd4_cu
    this.rd5_cu = datos.rd5_cu
    this.rd6_cu = datos.rd6_cu
    this.rd7_cu = datos.rd7_cu
    this.rd8_cu = datos.rd8_cu
    this.rd9_cu = datos.rd9_cu
    this.pa1_cu = datos.pa1_cu
    this.pa2_cu = datos.pa2_cu
    this.pa3_cu = datos.pa3_cu
    this.pa4_cu = datos.pa4_cu
    this.pa5_cu = datos.pa5_cu
    this.pa6_cu = datos.pa6_cu
    this.pa7_cu = datos.pa7_cu
    this.pa8_cu = datos.pa8_cu
    this.pa9_cu = datos.pa9_cu
    this.ekit1_cu = datos.ekit1_cu
    this.ekit2_cu = datos.ekit2_cu
    this.ekit3_cu = datos.ekit3_cu
    this.ekit4_cu = datos.ekit4_cu
    this.ekit5_cu = datos.ekit5_cu
    this.ekit6_cu = datos.ekit6_cu
    this.ekit7_cu = datos.ekit7_cu
    this.ekit8_cu = datos.ekit8_cu
    this.ekit9_cu = datos.ekit9_cu
    this.a1_cu = datos.a1_cu
    this.a2_cu = datos.a2_cu
    this.a3_cu = datos.a3_cu
    this.a4_cu = datos.a4_cu
    this.a5_cu = datos.a5_cu
    this.a6_cu = datos.a6_cu
    this.a7_cu = datos.a7_cu
    this.a8_cu = datos.a8_cu
    this.a9_cu = datos.a9_cu

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
    
    this.showPwr(scl);
    
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
    if(this.id1 !== "-" && this.id1 !== ""){
      let M101 = new UMD(this.point.x, this.point.y, this.ra1, this.rd1, this.pa1, this.id1, this.ekit1, "M101");
      M101.show(scl * propiedades.mult)}
    //M102
    if(this.id2 !== "-" && this.id2 !== ""){
      let M102 = new UMD(this.point.x, this.point.y, this.ra2, this.rd2, this.pa2, this.id2, this.ekit2, "M102");
      M102.show(scl * propiedades.mult)}
    //M103
    if(this.id3 !== "-" && this.id3 !== ""){
      let M103 = new UMD(this.point.x, this.point.y, this.ra3, this.rd3, this.pa3, this.id3, this.ekit3, "M103");
      M103.show(scl * propiedades.mult)}
    //M101_cu
    if(this.id1_cu !== "-" && this.id1_cu !== ""){
      let M101_cu = new UMD(this.point.x, this.point.y, this.ra1_cu, this.rd1_cu, this.pa1_cu, this.id1_cu, this.ekit1_cu, "M101_CU", this.a1_cu);
      M101_cu.show(scl * propiedades.mult)}
    //M102_cu
    if(this.id2_cu !== "-" && this.id2_cu !== ""){
      let M102_cu = new UMD(this.point.x, this.point.y, this.ra2_cu, this.rd2_cu, this.pa2_cu, this.id2_cu, this.ekit2_cu, "M102_CU", this.a2_cu);
      M102_cu.show(scl * propiedades.mult)}
    //M103_cu
    if(this.id3_cu !== "-" && this.id3_cu !== ""){
      let M103_cu = new UMD(this.point.x, this.point.y, this.ra3_cu, this.rd3_cu, this.pa3_cu, this.id3_cu, this.ekit3_cu, "M103_CU", this.a3_cu);
      M103_cu.show(scl * propiedades.mult)}
    //M104_cu
    if(this.id4_cu !== "-" && this.id4_cu !== ""){
      let M104_cu = new UMD(this.point.x, this.point.y, this.ra4_cu, this.rd4_cu, this.pa4_cu, this.id4_cu, this.ekit4_cu, "M104_CU", this.a4_cu);
      M104_cu.show(scl * propiedades.mult)}
    //M105_cu
    if(this.id5_cu !== "-" && this.id5_cu !== ""){
      let M105_cu = new UMD(this.point.x, this.point.y, this.ra5_cu, this.rd5_cu, this.pa5_cu, this.id5_cu, this.ekit5_cu, "M105_CU", this.a5_cu);
      M105_cu.show(scl * propiedades.mult)}
    //M106_cu
    if(this.id6_cu !== "-" && this.id6_cu !== ""){
      let M106_cu = new UMD(this.point.x, this.point.y, this.ra6_cu, this.rd6_cu, this.pa6_cu, this.id6_cu, this.ekit6_cu, "M106_CU", this.a6_cu);
      M106_cu.show(scl * propiedades.mult)}
    //M107_cu
    if(this.id7_cu !== "-" && this.id7_cu !== ""){
      let M107_cu = new UMD(this.point.x, this.point.y, this.ra7_cu, this.rd7_cu, this.pa7_cu, this.id7_cu, this.ekit7_cu, "M107_CU", this.a7_cu);
      M107_cu.show(scl * propiedades.mult)}
    //M108_cu
    if(this.id8_cu !== "-" && this.id8_cu !== ""){
      let M108_cu = new UMD(this.point.x, this.point.y, this.ra8_cu, this.rd8_cu, this.pa8_cu, this.id8_cu, this.ekit8_cu, "M108_CU", this.a8_cu);
      M108_cu.show(scl * propiedades.mult)}
    //M109_cu
    if(this.id9_cu !== "-" && this.id9_cu !== ""){
      let M109_cu = new UMD(this.point.x, this.point.y, this.ra9_cu, this.rd9_cu, this.pa9_cu, this.id9_cu, this.ekit9_cu, "M109_CU", this.a9_cu);
      M109_cu.show(scl * propiedades.mult)}
  }

  getColor(option) {
    switch (option) {
      case 'surf_electronics':
        // this.caseLabel = "AB: " + this.amiga_box + "\n" + "TX: " + this.tx + "\n" + "Dist: " + this.dist;
        let ab_;
        if (this.amiga_box !== "" && this.amiga_box !== "-"){
          ab_ = "OK"
        }
        let tx_;
        if (this.tx !== "" && this.tx !== "-"){
          tx_ = "OK"
        }
        let d_;
        if (this.distrib !== "" && this.distrib !== "-"){
          d_ = "OK"
        }

        if (ab_ == "OK" && tx_ == "OK" && d_ == "OK") {
          this.caseLabel = "OK";
        }
        else if (this.cableado == "" || this.cableado == "-"){
          this.caseLabel = "";
        }
        else{
          this.caseLabel = "Incomplete";
        }
        // if (this.caseLabel !== "" && this.caseLabel !== "-" && this.cableado == "OK") {
        if (ab_ == "OK" && tx_ == "OK" && d_ == "OK") {
          fill(colors.ok);
        } else if (this.cableado == "OK") {
          fill(colors.warning);
        } else {
          fill(colors.noData);
        }
        break;

      case 'under_electronics':
        // this.caseLabel = "AB: " + this.amiga_box + "\n" + "TX: " + this.tx + "\n" + "Dist: " + this.dist;
        let ekit1_;
        if (this.ekit1 !== "" && this.ekit1 !== "-"){
          ekit1_ = "OK"
        }
        let ekit2_;
        if (this.ekit2 !== "" && this.ekit2 !== "-"){
          ekit2_ = "OK"
        }
        let ekit3_;
        if (this.ekit3 !== "" && this.ekit3 !== "-"){
          ekit3_ = "OK"
        }

        if (ekit1_ == "OK" && ekit2_ == "OK" && ekit3_ == "OK" || this.tipo == "CU") {
          this.caseLabel = "OK";
        }
        else if (this.cableado == "" || this.cableado == "-"){
          this.caseLabel = "";
        }
        else{
          this.caseLabel = "Incomplete";
        }

        if (ekit1_ == "OK" && ekit2_ == "OK" && ekit3_ == "OK" || this.tipo == "CU") {
          fill(colors.ok);
        } else if (this.cableado == "OK") {
          fill(colors.warning);
        } else {
          fill(colors.noData);
        }
        break;

        case 'power_system':
          let tubing_;
          if (this.tubing !== "" && this.tubing !== "-"){
            tubing_ = "OK"
          }
          let soporte_;
          if (this.soporte !== "" && this.soporte !== "-"){
            soporte_ = "OK"
          }
          let solar_panel_;
          if (this.solar_panel !== "" && this.solar_panel !== "-"){
            solar_panel_ = "OK"
          }
          let bbox_;
          if (this.bbox !== "" && this.bbox !== "-"){
            bbox_ = "OK"
          }
          let bat_1_;
          if (this.bat_1 !== "" && this.bat_1 !== "-"){
            bat_1_ = "OK"
          }
          let bat_2_;
          if (this.bat_2 !== "" && this.bat_2 !== "-"){
            bat_2_ = "OK"
          }
          let reg_;
          if (this.regulator !== "" && this.regulator !== "-"){
            reg_ = "OK"
          }
  
          if (tubing_ == "OK" && soporte_ == "OK" && solar_panel_ == "OK" && bbox_ == "OK" && bat_1_ == "OK" && bat_2_ == "OK" && reg_ == "OK") {
            this.caseLabel = "OK";
          }
          else if (this.cableado == "" || this.cableado == "-"){
            this.caseLabel = "";
          }
          else{
            this.caseLabel = "Incomplete";
          }
  
          if (tubing_ == "OK" && soporte_ == "OK" && solar_panel_ == "OK" && bbox_ == "OK" && bat_1_ == "OK" && bat_2_ == "OK" && reg_ == "OK") {
            fill(colors.ok);
          } else if (this.cableado == "OK") {
            fill(colors.warning);
          } else {
            fill(colors.noData);
          }
          break;
      
      case 'cap_disipador':
        this.caseLabel = this.cap_disipador;
        if (this.caseLabel === "OK") {
          fill(colors.ok);
        } else if (this.caseLabel === "Stable") {
          fill(colors.ok);
        } else if (this.caseLabel === "OLD") {
          fill(colors.warning);
        } else {
          fill(colors.noData);
        }
        break;

      case 'status':
        this.caseLabel = this.status;
        if (this.caseLabel === "In ACQ") {
          fill(colors.ok);
        } else if(this.caseLabel === "Deployed"){
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

      case 'to_do':
        this.caseLabel = this.to_do;
        if (this.caseLabel == "" || this.caseLabel == "-") {
          fill(colors.noData);
        } else {
          fill(colors.warning);
        }
        break;
    }
  }
  // Show Power System
  showPwr(scl){
    this.update();
    if (showPower.showTubing && this.tubing == "OK") {
      push();
      circle(this.point.x + 5 * scl * propiedades.mult, this.point.y + 2 * scl * propiedades.mult, 1 * scl * propiedades.mult);
      pop();
    }

    if (showPower.showSupport && this.soporte == "OK") {
      push();
      rectMode(CENTER)
      noFill();
      stroke(127);
      strokeWeight(0.3 * scl * propiedades.mult)
      rect(this.point.x + 5 * scl * propiedades.mult, this.point.y, 2 * scl * propiedades.mult, 3 * scl * propiedades.mult);
      pop();
    }

    if (showPower.showSolarPanel && (this.solar_panel !== "" && this.solar_panel !== "-")) {
      push();
      rectMode(CENTER)
      fill(100, 149, 237);
      noStroke();
      rect(this.point.x + 5 * scl * propiedades.mult, this.point.y, 2 * scl * propiedades.mult, 3 * scl * propiedades.mult);
      pop();
    }

    if (showPower.showBatteryBox && this.bbox == "OK") {
      push();
      rectMode(CENTER)
      fill(255, 248, 220);
      noStroke();
      rect(this.point.x - 5 * scl * propiedades.mult, this.point.y, 4 * scl * propiedades.mult, 3 * scl * propiedades.mult);
      textAlign(CENTER);
      fill(0);
      textSize(0.5 * scl * propiedades.mult);
      text("Reg: " + this.regulator, this.point.x - 5 * scl * propiedades.mult, this.point.y - 0.5 * scl * propiedades.mult);
      text("Bat_1: \n" + this.bat_1, this.point.x + (- 5 - 1 )* scl * propiedades.mult, this.point.y + (- 0.5 + 1.8) * scl * propiedades.mult);
      text("Bat_2: \n" + this.bat_2, this.point.x + (- 5 + 1 )* scl * propiedades.mult, this.point.y + (- 0.5 + 1.8) * scl * propiedades.mult);
      pop();
    }
  }
}