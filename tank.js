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
        this.terminado = datos.terminado
      }
      
      update(){
        this.point = AMIGA_Map.latLngToPixel(this.pos.lat,this.pos.lng)
      }

      showSD(scl){
        circle(this.point.x, this.point.y, radius * 1 * scl);
      }

      showUMD(scl){
        this.update();
        //M101
        let M101 = new UMD(this.point.x, this.point.y, this.ra1, this.rd1, this.pa1);
        M101.show(scl);
        let M102 = new UMD(this.point.x, this.point.y, this.ra2, this.rd2, this.pa2);
        M102.show(scl);
        let M103 = new UMD(this.point.x, this.point.y, this.ra3, this.rd3, this.pa3);
        M103.show(scl);
        // M101.drawLine();
        //M101
        // let M102 = new UMD(90, 87, 164);
        // M102.show();
        //M101
        // let M103 = new UMD(90, 102, 166);
        // M103.show();
}
}