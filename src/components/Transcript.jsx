export default function Transcript({ snippets, currentTime, onWordClick }) {
    return (
      <>
        <h2>Transcript</h2>
        <div className="transcript-box">
          {snippets.map((snip, i) => (
            <p key={snip.id || i}>
              <strong>{snip.speaker_name}:</strong>{' '}
              {snip.words.map(([w, start, end], j) => {
                const isActive = currentTime >= start && currentTime <= end;
                return (
                  <span
                    key={j}
                    className={isActive ? 'word highlight' : 'word'}
                    onClick={() => onWordClick(start)}
                  >
                    {w}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      </>
    );
  }