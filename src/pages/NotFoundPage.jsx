import { useNavigate } from 'react-router-dom';
import PATHS from '@/routes/paths';
import useAuth from '@/hooks/useAuth';

// ── SVG assets ──────────────────────────────────────────────────────────────
import CharacterOnBoat from '@/assets/NotFound/CharacterOnBoat';
import IslandRock from '@/assets/NotFound/IslandRock';
import WaveBack from '@/assets/NotFound/WaveBack';
import WaveFront from '@/assets/NotFound/WaveFront';
import SeaFoam from '@/assets/NotFound/SeaFoam';
import FindPathIcon from '@/assets/NotFound/FindPathIcon';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div
      className='relative min-h-screen w-full overflow-hidden flex flex-col'
      style={{
        background:
          'linear-gradient(180deg, #e8f5f0 0%, #c8eae0 35%, #a0d4c4 65%, #6db8a4 100%)',
      }}
    >
      {/* ── Animation keyframes ─────────────────────────────────────────── */}
      <style>{`
        @keyframes wave1 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wave2 {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes bobBoat {
          0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
          50%       { transform: translateY(-10px) rotate(1.5deg); }
        }
        @keyframes wobbleHead {
          0%, 100% { transform: rotate(-3deg); }
          50%       { transform: rotate(3deg); }
        }
        @keyframes floatStress {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0); opacity: 1; }
          33%       { transform: translateY(-8px) translateX(4px) rotate(15deg); opacity: 0.7; }
          66%       { transform: translateY(-14px) translateX(-2px) rotate(-10deg); opacity: 0.4; }
          99%       { transform: translateY(-22px) translateX(2px) rotate(5deg); opacity: 0; }
        }
        @keyframes ripple {
          0%   { transform: scaleX(1); opacity: 0.4; }
          100% { transform: scaleX(1.2); opacity: 0; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wave-anim-1  { animation: wave1 14s linear infinite; }
        .wave-anim-2  { animation: wave2 10s linear infinite; }
        .boat-anim    { animation: bobBoat 3s ease-in-out infinite; }
        .head-anim    { animation: wobbleHead 2s ease-in-out infinite; transform-origin: center bottom; }
        .stress-1     { animation: floatStress 2s ease-out infinite; animation-delay: 0s; }
        .stress-2     { animation: floatStress 2s ease-out infinite; animation-delay: 0.6s; }
        .stress-3     { animation: floatStress 2s ease-out infinite; animation-delay: 1.2s; }
        .fade-in      { animation: fadeInDown 0.8s ease forwards; }
        .fade-in-2    { animation: fadeInDown 0.8s ease 0.2s forwards; opacity: 0; }
        .fade-in-3    { animation: fadeInDown 0.8s ease 0.4s forwards; opacity: 0; }
      `}</style>

      {/* ── Top Content: Heading + CTA ──────────────────────────────────── */}
      <div className='relative z-20 flex flex-col items-center pt-16 sm:pt-24 px-6 text-center'>
        <h1
          className='fade-in text-2xl sm:text-3xl lg:text-4xl font-black tracking-widest uppercase text-slate-700'
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.18em' }}
        >
          Whoops... looks like you got lost
        </h1>

        <p className='fade-in-2 text-sm font-semibold text-slate-500 mt-2 tracking-wide'>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className='fade-in-3 mt-5'>
          <button
            type='button'
            onClick={() => navigate(isAuthenticated ? PATHS.DASHBOARD : PATHS.LOGIN)}
            className='inline-flex items-center gap-2 px-7 py-2.5 bg-[#10b981] hover:bg-[#059669] active:scale-95 text-white text-xs font-extrabold tracking-widest uppercase rounded-xl shadow-lg shadow-[#10b981]/30 transition-all hover:-translate-y-0.5 cursor-pointer'
          >
            <FindPathIcon />
            Find Path
          </button>
        </div>
      </div>

      {/* ── Scene: Character + Waves ────────────────────────────────────── */}
      <div className='relative flex-1 flex items-end' style={{ minHeight: '60vh' }}>

        {/* Animated character on boat — centred */}
        <div
          className='boat-anim absolute left-1/2 z-20'
          style={{ bottom: '30%', transform: 'translateX(-50%)' }}
        >
          <CharacterOnBoat />
        </div>

        {/* Island / rock peeking from the left */}
        <div className='absolute z-10' style={{ left: '8%', bottom: '32%' }}>
          <IslandRock />
        </div>

        {/* Wave Layer 1 — back (lighter, scrolls right → left) */}
        <div className='absolute w-full z-10' style={{ bottom: '28%' }}>
          <div className='wave-anim-2' style={{ width: '200%' }}>
            <WaveBack />
            <WaveBack />
          </div>
        </div>

        {/* Wave Layer 2 — front (darker, scrolls left → right) */}
        <div className='absolute w-full z-10' style={{ bottom: '0' }}>
          {/* "404" text behind the front wave */}
          <div
            className='absolute w-full text-center z-0 select-none'
            style={{
              bottom: '30%',
              fontSize: 'clamp(80px, 18vw, 180px)',
              fontWeight: 900,
              color: 'rgba(58,140,118,0.35)',
              letterSpacing: '0.05em',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              lineHeight: 1,
            }}
          >
            404
          </div>

          <div className='wave-anim-1 relative z-10' style={{ width: '200%' }}>
            <WaveFront />
            <WaveFront />
          </div>

          {/* Solid sea floor */}
          <div className='bg-[#2d8a72] w-full' style={{ height: '80px', marginTop: '-2px' }} />
        </div>

        {/* Sea foam line between wave layers */}
        <div className='absolute w-full z-10' style={{ bottom: '26%' }}>
          <SeaFoam />
        </div>
      </div>
    </div>
  );
};


export default NotFoundPage;
