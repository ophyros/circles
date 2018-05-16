export default class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;

    this.oldX = this.x;
    this.oldY = this.y;

    this.dist = 0;

    this.angle = 0;
  }

  update(e) {
    this.oldX = this.x;
    this.oldY = this.y;

    this.x = e.clientX;
    this.y = e.clientY;

    let dx = this.x - this.oldX;
    let dy = this.y - this.oldY;

    this.dist = Math.sqrt(dx*dx + dy*dy);
    this.angle = Math.atan2(dy,dx);
  }
}
