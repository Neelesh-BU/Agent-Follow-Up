/**
 * WaveFront — darker foreground wave tile used in the wave-anim-1 scrolling layer.
 * Rendered twice side-by-side (200% width wrapper) for seamless infinite scroll.
 * The parent div applies the .wave-anim-1 CSS class for animation.
 */
const WaveFront = () => (
  <svg
    viewBox='0 0 1440 200'
    preserveAspectRatio='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{ width: '50%', display: 'inline-block', height: '220px' }}
  >
    <path
      d='M0 80 C200 30, 400 130, 600 80 C800 30, 1000 130, 1200 80 C1300 55, 1380 70, 1440 80 L1440 200 L0 200 Z'
      fill='#2d8a72'
    />
  </svg>
);

export default WaveFront;
