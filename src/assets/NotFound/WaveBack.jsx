/**
 * WaveBack — lighter background wave tile used in the wave-anim-2 scrolling layer.
 * Rendered twice side-by-side (200% width wrapper) for seamless infinite scroll.
 * The parent div applies the .wave-anim-2 CSS class for animation.
 */
const WaveBack = () => (
  <svg
    viewBox='0 0 1440 120'
    preserveAspectRatio='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{ width: '50%', display: 'inline-block', height: '80px' }}
  >
    <path
      d='M0 60 C180 20, 360 100, 540 60 C720 20, 900 100, 1080 60 C1260 20, 1440 60, 1440 60 L1440 120 L0 120 Z'
      fill='#4a9e88'
      opacity='0.5'
    />
  </svg>
);

export default WaveBack;
