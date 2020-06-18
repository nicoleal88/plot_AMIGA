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
 
      
      push();
      translate(this.coordX, this.coordY);
      rotate(this.ra);
      rectMode(CENTER);
      strokeWeight(1);
      fill(127, 100);
      stroke(0, 100);
      rect(0, 0, 1.4* scl, 9.0* scl);
      fill(0, 150);
      circle(0, 0, 0.6 * scl);
      pop();
    }
    
    drawLine(){
      stroke(100);
      line(0,0,this.coordX, this.coordY);
    }
  }