export default class Circle {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.wWidth = width;
    this.wHeight = height;

    this.x = Math.floor(Math.random() * this.wWidth);
    this.y = Math.floor(Math.random() * this.wHeight);
    this.radius = Math.floor(Math.random() * 20 + 10);
    this.minRadius = this.radius;
    this.maxRadius = this.radius + 20;
    this.opacity = Math.floor(Math.random() * 90) / 100 + .1;
    this.minOpacity = this.opacity;
    this.maxOpacity = .9;
    this.level = Math.floor(Math.random() * 5) + 1;
    this.friction = .05;

    this.vx = 0;
    this.vy = 0;
  }

  update(mouse, power) {
    let tx = this.x + Math.cos(Math.PI - mouse.angle)*2;
    let ty = this.y + Math.sin(-mouse.angle)*2;

    this.vx += tx - this.x;
    this.vy += ty - this.y;

    this.vx *= this.friction * this.level;
    this.vy *= this.friction * this.level;

    this.x += this.vx;
    this.y += this.vy;

    this.x = this.x > this.wWidth + this.radius ? 1 - this.radius : this.x;
    this.y = this.y > this.wHeight + this.radius ? 1 - this.radius : this.y;

    this.x = this.x < -this.radius ? this.wWidth + this.radius - 1 : this.x;
    this.y = this.y < -this.radius ? this.wHeight + this.radius - 1 : this.y;

    let coef = power / 255;

    this.radius = (1 - coef) * this.minRadius + coef * this.maxRadius;
    // this.opacity = (1 - coef) * this.minOpacity + coef * this.maxOpacity;

    this.draw();
  }

  draw() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }
}
