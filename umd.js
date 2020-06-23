class UMD {

  constructor(x, y, ra, rd, pa, id, ekit, num_) {
    this.sd_x = x;
    this.sd_y = y;
    this.ra = ra;
    this.rd = rd;
    this.pa = pa;
    this.id = id;
    this.ekit = ekit;
    this.num = num_
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
    fill(127, 100);
    stroke(0, 100);
    rect(0, 0, 1.4 * scl, 9.0 * scl);

    // Access tube
    fill(0, 150);
    circle(0, 0, 0.6 * scl);

    // Fiber 1 indicator
    fill(255,0,0, 127);
    circle(-0.5 * scl , -4.3 * scl, 0.2 * scl);

    // ID label
    textSize(0.4 * scl);
    fill(255);
    stroke(0);
    textAlign(CENTER, TOP);
    text(this.id, 0, 0.5 * scl);

    // eKit label
    textSize(0.3 * scl);
    textAlign(CENTER, BOTTOM);
    text(this.ekit, 0, -0.5 * scl);

    // Position label
    textAlign(RIGHT, TOP);
    text(this.num, 0.6 * scl, -4.4 * scl);
    pop();
  }
  // drawLine() {
  //   stroke(100);
  //   line(0, 0, this.coordX, this.coordY);
  // }
}