class UMD {

  constructor(x, y, ra, rd, pa, id, ekit, num_, a) {
    this.sd_x = x;
    this.sd_y = y;
    this.ra = ra;
    this.rd = rd;
    this.pa = pa;
    this.id = id;
    this.ekit = ekit;
    this.num = num_;
    if (!a){
      this.len = 9.0;
    }
    else if(a == 10){
      this.len = 9.0;
    }
    else{
      this.len = 4.5;
    }
  }

  show(scl) {
    
    // UMD's center coordinates
    angleMode(DEGREES);
    this.coordX = this.sd_x - this.rd * sin(this.pa) * scl;
    this.coordY = this.sd_y + this.rd * cos(this.pa) * scl;

    push();
    translate(this.coordX, this.coordY);
    rotate(this.ra);

    // UMD
    rectMode(CENTER);
    strokeWeight(1);
    if (this.num.slice(-7)=="Not Op."){
      fill(0,100);
    }
    else{
      fill(127, 100);
    }
    
    stroke(0, 100);
    rect(0, 0, 1.4 * scl, this.len * scl);

    // Access tube
    fill(0, 150);
    circle(0, 0, 0.6 * scl);

    // Fiber 1 indicator
    fill(255,0,0, 127);
    circle(-0.5 * scl , (-this.len/2 + 0.2) * scl, 0.2 * scl);

    // ID label
    textSize(0.4 * scl);
    fill(255);
    stroke(0);
    textAlign(CENTER, TOP);
    text("ID:\n" + this.id, 0, -4 * scl);

    // eKit label
    textSize(0.3 * scl);
    textAlign(CENTER, BOTTOM);
    text("eKit:\n" + this.ekit, 0, -0.5 * scl);

    // Position label
    textSize(0.5 * scl);
    textAlign(LEFT, CENTER);
    rotate(-90);
    text(this.num,(-this.len/2 + 0.2) * scl, 0);
    pop();
  }
  // drawLine() {
  //   stroke(100);
  //   line(0, 0, this.coordX, this.coordY);
  // }
}