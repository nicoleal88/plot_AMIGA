class UMD {

    constructor(x, y, ra, rd, pa){
      this.sd_x = x;
      this.sd_y = y;
      this.ra = ra;
      this.rd = rd;
      this.pa = pa;
    }
    
    show(scl){
      angleMode(DEGREES);
      this.coordX = this.sd_x - this.rd * sin(this.pa) * scl;
      this.coordY = this.sd_y + this.rd * cos(this.pa) * scl;
 
      fill(0, 200, 200);
      push();
      translate(this.coordX, this.coordY);
      rotate(this.ra);
      rectMode(CENTER);
      strokeWeight(2);
      stroke(0);
      rect(0, 0, 1.4* scl, 9.0* scl);
      fill(255,0,0);
    //   circle(7, 45,4);
      pop();
    }
    
    drawLine(){
      stroke(100);
      line(0,0,this.coordX, this.coordY);
    }
  }