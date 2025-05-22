const coin = document.getElementById('coin');
const flipBtn = document.getElementById('flip-btn');
const coinContainer = document.querySelector('.coin-container');
const resultMessage = document.getElementById('result-message');
let isFlipping = false;
let currentSide = 0; // 0: head, 1: tail

// Easing function for smooth ease-out
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Subtle movement, rotation, and tilt towards cursor
document.addEventListener('mousemove', (e) => {
  if (isFlipping) return;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const maxMove = 20; // subtle movement
  const maxRotate = 10; // subtle rotation
  const maxTilt = 20; // subtle tilt
  const x = (e.clientX - centerX) / centerX;
  const y = (e.clientY - centerY) / centerY;
  coinContainer.style.transform = `translateX(calc(-50% + ${x * maxMove}px)) translateY(${y * maxMove}px) rotateZ(${x * maxRotate}deg) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg)`;
});
document.addEventListener('mouseleave', () => {
  if (isFlipping) return;
  coinContainer.style.transform = 'translateX(-50%)';
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
