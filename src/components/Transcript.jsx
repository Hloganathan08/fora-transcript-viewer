import { useEffect, useRef } from 'react';
import './Transcript.css';

export default function Transcript({ snippets, currentTime, onWordClick }) {
  const activeSnippetRef = useRef(null); // Ref for the active snippet
  const transcriptRef = useRef(null);

  useEffect(() => {
    // Auto-scroll the active snippet to the top
    if (activeSnippetRef.current && transcriptRef.current) {
      activeSnippetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentTime]);

  return (
    <div className="transcript" ref={transcriptRef}>
      {snippets.map((snippet, snippetIndex) => {
        // Check if the current snippet contains the active word
        const isActiveSnippet = snippet.words.some(
          ([, startTime], wordIndex) =>
            currentTime >= startTime &&
            currentTime < (snippet.words[wordIndex + 1]?.[1] || Infinity)
        );

        return (
          <div
            key={snippetIndex}
            ref={isActiveSnippet ? activeSnippetRef : null} // Attach ref to the active snippet
            className={`snippet ${isActiveSnippet ? 'active-snippet' : ''}`} // Add class if active
          >
            <p className="speaker">{snippet.speaker_name}</p>
            <p className="words">
              {snippet.words.map(([word, startTime], wordIndex) => {
                const isActiveWord =
                  currentTime >= startTime &&
                  currentTime < (snippet.words[wordIndex + 1]?.[1] || Infinity);
                return (
                  <span
                    key={wordIndex}
                    className={isActiveWord ? 'active-word' : ''}
                    onClick={() => onWordClick(startTime)} // Allow clicking to jump to the word
                  >
                    {word}{' '}
                  </span>
                );
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}