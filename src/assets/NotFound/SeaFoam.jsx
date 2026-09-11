/**
 * SeaFoam — a subtle white sine-wave line rendered across the full width
 * to simulate sea foam on the water surface between wave layers.
 */
const SeaFoam = () => (
  <svg
    viewBox='0 0 1440 20'
    preserveAspectRatio='none'
    xmlns='http://www.w3.org/2000/svg'
    width='100%'
    height='20'
  >
    <path
      d='M0 10 C120 4, 240 16, 360 10 C480 4, 600 16, 720 10 C840 4, 960 16, 1080 10 C1200 4, 1320 16, 1440 10'
      stroke='rgba(255,255,255,0.45)'
      strokeWidth='2'
      fill='none'
    />
  </svg>
);

export default SeaFoam;
