(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Circle = function () {
  function Circle(ctx, width, height) {
    _classCallCheck(this, Circle);

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

  _createClass(Circle, [{
    key: 'update',
    value: function update(mouse, power) {
      var tx = this.x + Math.cos(Math.PI - mouse.angle) * 2;
      var ty = this.y + Math.sin(-mouse.angle) * 2;

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

      var coef = power / 255;

      this.radius = (1 - coef) * this.minRadius + coef * this.maxRadius;
      // this.opacity = (1 - coef) * this.minOpacity + coef * this.maxOpacity;

      this.draw();
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.ctx.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }]);

  return Circle;
}();

exports.default = Circle;

},{}],2:[function(require,module,exports){
'use strict';

var _circle = require('./circle');

var _circle2 = _interopRequireDefault(_circle);

var _mouse = require('./mouse');

var _mouse2 = _interopRequireDefault(_mouse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var circles = [];
var mouse = new _mouse2.default();
var wWidth = window.innerWidth;
var wHeight = window.innerHeight;

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = wWidth;
canvas.height = wHeight;
document.body.appendChild(canvas);

var audio = new Audio();
audio.controls = false;
audio.autoplay = true;
audio.src = 'i/music.mp3';
document.body.appendChild(audio);
var actx = void 0,
    analyser = void 0,
    source = void 0,
    bars = void 0,
    clicked = false;

document.body.addEventListener('click', function () {
  if (clicked) return;
  clicked = true;
  audio.play();
  actx = new AudioContext();
  analyser = actx.createAnalyser();
  source = actx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(actx.destination);
  analyser.fftSize = 512;
  bars = new Uint8Array(analyser.frequencyBinCount);

  for (var i = 0; i < 256; i++) {
    circles[i] = new _circle2.default(ctx, wWidth, wHeight);
  }

  render();
});

function render() {
  analyser.getByteFrequencyData(bars);
  ctx.clearRect(0, 0, wWidth, wHeight);
  circles.forEach(function (circle, i) {
    circle.update(mouse, bars[i]);
  });
  requestAnimationFrame(render);
}

document.addEventListener('mousemove', function (e) {
  mouse.update(e);
});

},{"./circle":1,"./mouse":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mouse = function () {
  function Mouse() {
    _classCallCheck(this, Mouse);

    this.x = 0;
    this.y = 0;

    this.oldX = this.x;
    this.oldY = this.y;

    this.dist = 0;

    this.angle = 0;
  }

  _createClass(Mouse, [{
    key: "update",
    value: function update(e) {
      this.oldX = this.x;
      this.oldY = this.y;

      this.x = e.clientX;
      this.y = e.clientY;

      var dx = this.x - this.oldX;
      var dy = this.y - this.oldY;

      this.dist = Math.sqrt(dx * dx + dy * dy);
      this.angle = Math.atan2(dy, dx);
    }
  }]);

  return Mouse;
}();

exports.default = Mouse;

},{}]},{},[2]);
