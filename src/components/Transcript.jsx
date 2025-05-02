import { useEffect, useRef } from 'react';
import './Transcript.css';

export default function Transcript({ snippets, currentTime, onWordClick }) {
  const activeWordRef = useRef(null);
  const transcriptRef = useRef(null);

  useEffect(() => {
    // Auto-scroll only if the active word is outside the visible area
    if (activeWordRef.current && transcriptRef.current) {
      const activeWordRect = activeWordRef.current.getBoundingClientRect();
      const transcriptRect = transcriptRef.current.getBoundingClientRect();

      const isOutOfView =
        activeWordRect.top < transcriptRect.top || activeWordRect.bottom > transcriptRect.bottom;

      if (isOutOfView) {
        activeWordRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentTime]);

  return (
    <div className="transcript" ref={transcriptRef}>
      {snippets.map((snippet, snippetIndex) => (
        <div key={snippetIndex} className="snippet">
          <p className="speaker">{snippet.speaker_name}</p>
          <p className="words">
            {snippet.words.map(([word, startTime], wordIndex) => {
              const isActive = currentTime >= startTime && currentTime < (snippet.words[wordIndex + 1]?.[1] || Infinity);
              return (
                <span
                  key={wordIndex}
                  ref={isActive ? activeWordRef : null} // Attach ref to the active word
                  className={isActive ? 'active-word' : ''}
                  onClick={() => onWordClick(startTime)} // Allow clicking to jump to the word
                >
                  {word}{' '}
                </span>
              );
            })}
          </p>
        </div>
      ))}
    </div>
  );
}