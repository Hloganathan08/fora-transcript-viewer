import { useRef, useEffect } from 'react';

export default function AudioPlayer({ audioUrl, onTimeUpdate }) {
  const audioRef = useRef();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTime = () => onTimeUpdate(audio.currentTime);
    audio.addEventListener('timeupdate', handleTime);
    return () => audio.removeEventListener('timeupdate', handleTime);
  }, [onTimeUpdate]);

  return (
    <audio
      ref={audioRef}
      controls
      src={audioUrl}
      className="audio-player"
    />
  );
}
