/**
 * CharacterOnBoat — animated SVG of a lost person standing on a wooden boat.
 * Relies on CSS animation classes defined in NotFoundPage:
 *   .stress-1 / .stress-2 / .stress-3  — floating stress marks above head
 *   .head-anim                           — wobbling head
 * The parent wrapper applies .boat-anim (bobbing boat).
 */
const CharacterOnBoat = () => (
  <svg
    width='140'
    height='180'
    viewBox='0 0 140 180'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    {/* Stress marks above head */}
    <g className='stress-1'>
      <line x1='62' y1='18' x2='58' y2='8' stroke='#64748b' strokeWidth='2.5' strokeLinecap='round' />
      <line x1='58' y1='8' x2='62' y2='2' stroke='#64748b' strokeWidth='2.5' strokeLinecap='round' />
    </g>
    <g className='stress-2'>
      <line x1='72' y1='14' x2='70' y2='4' stroke='#64748b' strokeWidth='2.5' strokeLinecap='round' />
      <line x1='70' y1='4' x2='74' y2='0' stroke='#64748b' strokeWidth='2.5' strokeLinecap='round' />
    </g>
    <g className='stress-3'>
      <line x1='82' y1='18' x2='82' y2='8' stroke='#64748b' strokeWidth='2.5' strokeLinecap='round' />
      <line x1='82' y1='8' x2='86' y2='2' stroke='#64748b' strokeWidth='2.5' strokeLinecap='round' />
    </g>

    {/* Head */}
    <g className='head-anim'>
      {/* Hair */}
      <ellipse cx='72' cy='34' rx='20' ry='18' fill='#4a3728' />
      <ellipse cx='58' cy='30' rx='8' ry='10' fill='#4a3728' />
      {/* Face */}
      <ellipse cx='72' cy='40' rx='18' ry='18' fill='#f5d0b0' />
      {/* Eyes — worried */}
      <ellipse cx='65' cy='38' rx='3' ry='3.5' fill='#2d1f14' />
      <ellipse cx='79' cy='38' rx='3' ry='3.5' fill='#2d1f14' />
      {/* Eyebrow furrow */}
      <path d='M62 33 Q65 31 68 33' stroke='#4a3728' strokeWidth='1.8' strokeLinecap='round' fill='none' />
      <path d='M76 33 Q79 31 82 33' stroke='#4a3728' strokeWidth='1.8' strokeLinecap='round' fill='none' />
      {/* Open mouth O shape */}
      <ellipse cx='72' cy='48' rx='4' ry='4.5' fill='#c0392b' />
      <ellipse cx='72' cy='48' rx='2.5' ry='3' fill='#922b21' />
      {/* Ears */}
      <ellipse cx='54' cy='41' rx='3.5' ry='4.5' fill='#f5d0b0' />
      <ellipse cx='90' cy='41' rx='3.5' ry='4.5' fill='#f5d0b0' />
      {/* Neck */}
      <rect x='66' y='56' width='12' height='10' rx='3' fill='#f5d0b0' />
      {/* Collar / scarf */}
      <ellipse cx='72' cy='68' rx='16' ry='5' fill='#e8d8c8' />
    </g>

    {/* Body — red coat */}
    <rect x='54' y='65' width='36' height='50' rx='8' fill='#e74c3c' />
    {/* Coat buttons */}
    <circle cx='72' cy='78' r='2' fill='#c0392b' />
    <circle cx='72' cy='88' r='2' fill='#c0392b' />
    <circle cx='72' cy='98' r='2' fill='#c0392b' />
    {/* Left arm */}
    <rect x='38' y='68' width='18' height='10' rx='5' fill='#e74c3c' />
    <ellipse cx='36' cy='73' rx='6' ry='6' fill='#f5d0b0' />
    {/* Right arm */}
    <rect x='84' y='68' width='18' height='10' rx='5' fill='#e74c3c' />
    <ellipse cx='104' cy='73' rx='6' ry='6' fill='#f5d0b0' />
    {/* Legs */}
    <rect x='60' y='112' width='12' height='22' rx='4' fill='#2c3e50' />
    <rect x='68' y='112' width='12' height='22' rx='4' fill='#2c3e50' />
    {/* Shoes */}
    <ellipse cx='65' cy='134' rx='8' ry='5' fill='#1a252f' />
    <ellipse cx='77' cy='134' rx='8' ry='5' fill='#1a252f' />

    {/* Boat */}
    <path d='M18 138 Q72 148 126 138 L120 158 Q72 168 24 158 Z' fill='#d4a574' />
    <path d='M18 138 Q72 143 126 138' stroke='#b8865a' strokeWidth='2' fill='none' />
    {/* Boat rim highlight */}
    <path d='M24 140 Q72 145 120 140' stroke='#e8c89a' strokeWidth='1.5' fill='none' opacity='0.6' />

    {/* Water ripple under boat */}
    <ellipse
      cx='72'
      cy='162'
      rx='55'
      ry='6'
      fill='none'
      stroke='#6db8a4'
      strokeWidth='1.5'
      opacity='0.5'
      style={{ animation: 'ripple 2s ease-out infinite' }}
    />
  </svg>
);

export default CharacterOnBoat;
