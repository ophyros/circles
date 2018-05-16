import Circle from './circle';
import Mouse from './mouse';

let circles = [];
let mouse = new Mouse();
const wWidth = window.innerWidth;
const wHeight = window.innerHeight;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = wWidth;
canvas.height = wHeight;
document.body.appendChild(canvas);

const audio = new Audio();
audio.controls = false;
audio.autoplay = true;
audio.src = 'i/music.mp3';
document.body.appendChild(audio);
let actx, analyser, source, bars, clicked = false;

document.body.addEventListener('click', () => {
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

  for (let i = 0; i < 256; i++) {
    circles[i] = new Circle(ctx, wWidth, wHeight);
  }

  render();
});

function render() {
  analyser.getByteFrequencyData(bars);
  ctx.clearRect(0, 0, wWidth, wHeight);
  circles.forEach((circle, i) => {
    circle.update(mouse, bars[i]);
  });
  requestAnimationFrame(render);
}

document.addEventListener('mousemove', (e) => {
  mouse.update(e);
})

