const coin = document.getElementById('coin');
const flipBtn = document.getElementById('flip-btn');
const coinContainer = document.querySelector('.coin-container');
const resultMessage = document.getElementById('result-message');
let isFlipping = false;
let currentSide = 0; // 0: head, 1: tail
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Easing function for smooth ease-out
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Handle both mouse and touch movement
function handleMovement(x, y) {
  if (isFlipping) return;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const maxMove = 20; // subtle movement
  const maxRotate = 10; // subtle rotation
  const maxTilt = 20; // subtle tilt
  const relativeX = (x - centerX) / centerX;
  const relativeY = (y - centerY) / centerY;
  coinContainer.style.transform = `translateX(${relativeX * maxMove}px) translateY(${relativeY * maxMove}px) rotateZ(${relativeX * maxRotate}deg) rotateX(${-relativeY * maxTilt}deg) rotateY(${relativeX * maxTilt}deg)`;
}

// Mouse events
document.addEventListener('mousemove', (e) => {
  if (isTouchDevice) return; // Skip mouse events on touch devices
  handleMovement(e.clientX, e.clientY);
});

document.addEventListener('mouseleave', () => {
  if (isFlipping || isTouchDevice) return;
  coinContainer.style.transform = 'none';
});

// Touch events
document.addEventListener('touchmove', (e) => {
  e.preventDefault(); // Prevent scrolling while interacting with coin
  const touch = e.touches[0];
  handleMovement(touch.clientX, touch.clientY);
}, { passive: false });

document.addEventListener('touchend', () => {
  if (isFlipping) return;
  coinContainer.style.transform = 'none';
});

// Flip animation
flipBtn.addEventListener('click', () => {
  if (isFlipping) return;
  isFlipping = true;
  const flips = Math.floor(Math.random() * 4) + 6; // 6-9 flips
  const result = Math.random() < 0.5 ? 0 : 1; // 0: head, 1: tail
  let startDeg = currentSide === 1 ? 180 : 0;
  let endDeg = startDeg + flips * 180 + (result === 1 ? 180 : 0);
  let frame = 0;
  const totalFrames = Math.floor(Math.random() * 30) + 60; // 60-90 frames for varied speed
  const rotationAxis = Math.random() < 0.5 ? 'rotateY' : 'rotateX'; // randomly choose rotation axis
  function animate() {
    frame++;
    const t = frame / totalFrames;
    const progress = easeOutCubic(t);
    const deg = startDeg + (endDeg - startDeg) * progress;
    coin.style.transform = `${rotationAxis}(${deg}deg)`;
    if (frame < totalFrames) {
      requestAnimationFrame(animate);
    } else {
      currentSide = result;
      isFlipping = false;
      // Calculate which side is facing up based on the final rotation
      const finalRotation = endDeg % 360;
      const isHeads = finalRotation % 360 < 180;
      resultMessage.textContent = isHeads ? 'Heads' : 'Tails';
      resultMessage.classList.add('visible');
      setTimeout(() => {
        resultMessage.classList.remove('visible');
      }, 2000);
    }
  }
  animate();
});
