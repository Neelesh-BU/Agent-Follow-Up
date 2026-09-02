import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

// Pre-defined waveform bar heights for natural voice audio curves
const WAVEFORM_BAR_HEIGHTS = [
  6, 10, 16, 22, 14, 8, 18, 24, 28, 20, 12, 16, 26, 30, 22, 10, 6, 14, 24, 28,
  18, 12, 22, 30, 26, 16, 8, 14, 20, 26, 18, 10, 6, 12, 20, 24, 16, 8, 14, 22,
  28, 18, 10, 6,
];

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export const AudioPlayerModal = ({
  isOpen = false,
  onClose,
  audioUrl = '',
  candidateName = '',
  title,
  subtitle,
}) => {
  const { t } = useTranslation();
  const audioRef = useRef(null);
  const waveformRef = useRef(null);
  const speedMenuRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Close speed menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        speedMenuRef.current &&
        !speedMenuRef.current.contains(e.target)
      ) {
        setIsSpeedMenuOpen(false);
      }
    };
    if (isSpeedMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSpeedMenuOpen]);

  // Reset and auto-play when modal opens or audioUrl changes
  useEffect(() => {
    if (isOpen && audioUrl) {
      setAudioError(false);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      setPlaybackSpeed(1.0);

      const audio = audioRef.current;
      if (audio) {
        audio.playbackRate = 1.0;
        audio.src = audioUrl;
        audio.load();
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [isOpen, audioUrl]);

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setIsSpeedMenuOpen(false);
    if (onClose) onClose();
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setAudioError(true));
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    setIsSpeedMenuOpen(false);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Seek handler for clicking/dragging on waveform
  const seekToPosition = useCallback(
    (clientX) => {
      if (!waveformRef.current || !duration || !audioRef.current) return;
      const rect = waveformRef.current.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration],
  );

  const handleWaveformMouseDown = (e) => {
    setIsDragging(true);
    seekToPosition(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        seekToPosition(e.clientX);
      }
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, seekToPosition]);

  const handleDownload = async () => {
    if (!audioUrl) return;
    setIsDownloading(true);
    try {
      const cleanCandidate = candidateName
        ? candidateName.trim().replace(/[^a-zA-Z0-9_-]/g, '_')
        : 'Candidate';
      const filename = `${cleanCandidate}_Recording.mp3`;

      // Try fetching as blob for direct download
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback if CORS prevents blob download
      const link = document.createElement('a');
      link.href = audioUrl;
      link.target = '_blank';
      link.download = `${candidateName || 'Candidate'}_Recording.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  const currentProgressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200'>
      <style>
        {`
          @keyframes wave-bounce {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.4); }
          }
          .animate-wave {
            animation: wave-bounce 1s ease-in-out infinite;
          }
        `}
      </style>
      <div className='bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 sm:p-7 relative flex flex-col scale-100 animate-in zoom-in-95 duration-150'>
        {/* Close Button */}
        <button
          type='button'
          onClick={handleClose}
          className='absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer'
          title={t('common.close', { defaultValue: 'Close' })}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </button>

        {/* Modal Title & Subtitle */}
        <div className='mb-6 pr-8'>
          <h2 className='text-xl sm:text-2xl font-black text-slate-900 tracking-tight'>
            {title || t('audioPlayer.title', { defaultValue: 'Audio' })}
          </h2>
          <p className='text-xs sm:text-sm font-medium text-slate-500 mt-1 leading-relaxed'>
            {subtitle ||
              t(
                'audioPlayer.subtitle',
                { defaultValue: 'Replay the original conversation recording' },
              )}
          </p>
        </div>

        {/* Audio Error Alert if any */}
        {audioError && (
          <div className='mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center justify-between'>
            <span>Unable to play audio recording file.</span>
            <button
              type='button'
              onClick={() => setAudioError(false)}
              className='text-rose-500 hover:text-rose-800 font-bold ml-2'
            >
              ✕
            </button>
          </div>
        )}

        {/* Capsule / Pill Dark Audio Player */}
        <div className='bg-[#18181b] rounded-full px-4 py-3 sm:px-5 sm:py-3.5 flex items-center gap-3 sm:gap-4 shadow-xl'>
          {/* Circular Play / Pause Button */}
          <button
            type='button'
            onClick={togglePlay}
            className='w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0'
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <PauseRoundedIcon sx={{ fontSize: 24, color: '#18181b' }} />
            ) : (
              <PlayArrowRoundedIcon
                sx={{ fontSize: 24, color: '#18181b', ml: 0.3 }}
              />
            )}
          </button>

          {/* Waveform Visualization Bars */}
          <div
            ref={waveformRef}
            onMouseDown={handleWaveformMouseDown}
            className='flex-1 flex items-center justify-between gap-[2.5px] sm:gap-[3.5px] h-9 cursor-pointer select-none py-1'
            title='Click or drag to seek'
          >
            {WAVEFORM_BAR_HEIGHTS.map((height, idx) => {
              const barPercentage = (idx / WAVEFORM_BAR_HEIGHTS.length) * 100;
              const isPlayed = barPercentage <= currentProgressPercent;
              const animationDelay = `${(idx * 0.05).toFixed(2)}s`;
              const animationDuration = `${0.8 + (idx % 3) * 0.2}s`; // Vary duration slightly

              return (
                <div
                  key={idx}
                  className='flex items-center justify-center flex-1 h-full'
                >
                  <span
                    className={`w-full max-w-[3px] sm:max-w-[4px] rounded-full transition-colors duration-200 ${
                      isPlayed
                        ? 'bg-white opacity-100 shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                        : 'bg-white/30 hover:bg-white/50'
                    } ${isPlaying ? 'animate-wave' : ''}`}
                    style={{
                      height: `${height}px`,
                      animationDelay: isPlaying ? animationDelay : '0s',
                      animationDuration: isPlaying ? animationDuration : '0s',
                      transformOrigin: 'center',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Time Display */}
          <div className='text-white text-xs sm:text-sm font-bold font-mono tracking-wider shrink-0 pl-1 select-none min-w-[44px] text-right'>
            {formatTime(currentTime || duration)}
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className='flex items-center gap-2.5 sm:gap-3 mt-4 sm:mt-5'>
          {/* Speed Selector Dropdown */}
          <div className='relative' ref={speedMenuRef}>
            <button
              type='button'
              onClick={() => setIsSpeedMenuOpen((prev) => !prev)}
              className='inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer'
            >
              <SpeedRoundedIcon sx={{ fontSize: 17, color: '#475569' }} />
              <span>Speed: {playbackSpeed}x</span>
              <span className='text-[10px] text-slate-400 ml-0.5'>▼</span>
            </button>

            {isSpeedMenuOpen && (
              <div className='absolute left-0 bottom-full mb-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100'>
                <div className='px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400'>
                  Playback Speed
                </div>
                {SPEED_OPTIONS.map((speed) => (
                  <button
                    key={speed}
                    type='button'
                    onClick={() => handleSpeedChange(speed)}
                    className={`w-full px-3 py-1.5 text-xs font-bold text-left flex items-center justify-between transition-colors cursor-pointer ${
                      playbackSpeed === speed
                        ? 'bg-sky-50 text-[#007cc2]'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{speed}x</span>
                    {playbackSpeed === speed && (
                      <CheckRoundedIcon sx={{ fontSize: 16 }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Download Button */}
          <button
            type='button'
            onClick={handleDownload}
            disabled={isDownloading || !audioUrl}
            className='inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer'
          >
            <FileDownloadOutlinedIcon
              sx={{ fontSize: 17, color: '#475569' }}
            />
            <span>
              {isDownloading
                ? 'Downloading...'
                : t('audioPlayer.download', { defaultValue: 'Download' })}
            </span>
          </button>
        </div>

        {/* Hidden HTML5 Audio Element */}
        <audio
          ref={audioRef}
          className='hidden'
          preload='auto'
          onTimeUpdate={() => {
            if (audioRef.current && !isDragging) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration || 0);
            }
          }}
          onDurationChange={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration || 0);
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
          onError={() => {
            setIsPlaying(false);
            setAudioError(true);
          }}
        />
      </div>
    </div>
  );
};

export default AudioPlayerModal;
