class Tank{
    constructor(datos){
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
        this.cap_hs = datos.cap_hs
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
        this.terminado = datos.terminado

        this.caseLabel = "_-_";
        this.textID;
        this.textsize;

        this.radius = 1.8;
      }
      
      update(){
        this.point = AMIGA_Map.latLngToPixel(this.pos.lat,this.pos.lng)
      }

      showSD(scl, item, label, name, lsid){
        // Get fill color acording to item
        this.getColor(item);
        // Draw SD
        circle(this.point.x, this.point.y, this.radius * 2 * scl * mult);
        // Draw label text
        if (label) {
          text(this.caseLabel, this.point.x, this.point.y + this.radius * 2 * scl * mult);
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

    this.textsize = 3 * scl * mult;
    textSize(this.textsize);
    fill(51);
    noStroke();
    text(this.textID, this.point.x, this.point.y - this.radius * 2 * scl * mult);
      }

      showUMD(scl){
        this.update();
        //M101
        let M101 = new UMD(this.point.x, this.point.y, this.ra1, this.rd1, this.pa1);
        M101.show(scl * mult);
        let M102 = new UMD(this.point.x, this.point.y, this.ra2, this.rd2, this.pa2);
        M102.show(scl * mult);
        let M103 = new UMD(this.point.x, this.point.y, this.ra3, this.rd3, this.pa3);
        M103.show(scl * mult);
        // M101.drawLine();
        //M101
        // let M102 = new UMD(90, 87, 164);
        // M102.show();
        //M101
        // let M103 = new UMD(90, 102, 166);
        // M103.show();
      }

      getColor(option){
        switch (option) {
          case 'amiga_box':
      this.caseLabel = this.amiga_box;
      if (this.caseLabel !== "" && this.caseLabel !== "-") {
        fill(colors.ok);
      } else if(this.caseLabel === "" ){
        fill(colors.warning);
      }
      else if(this.caseLabel === "-" ){
        fill(100, 20);
      }
      else{
        fill(colors.noData);
      }
      break;

    case 'cap_hs':
      this.caseLabel = this.cap_hs;
      if (this.caseLabel === "OK") {
        fill(colors.ok);
      } else if (this.caseLabel === "CAP") {
        fill("blue");
      } else if (this.caseLabel === "" && this.radio_mikrotik === "OK") {
        fill(colors.warning);
      } else {
        fill(colors.noData);
      }
      break;

    case 'terminado':
      this.caseLabel = this.terminado;
      if (this.caseLabel === "Terminado") {
        fill(colors.ok);
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
      } 
      else if(this.caseLabel === "-" ){
        fill(100, 20);
      }
      else {
        fill(colors.noData);
      }
      break;
        }
      }
}