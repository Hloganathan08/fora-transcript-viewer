import { useEffect, useRef, useState, useMemo } from 'react';
import './App.css';

function App() {
  const [conversation, setConversation] = useState(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const audioRef = useRef();

  // 1️⃣ Load the JSON
  useEffect(() => {
    fetch('/conversation.json')
      .then(res => res.json())
      .then(data => setConversation(data))
      .catch(err => console.error('Failed to load JSON:', err));
  }, []);

  // 2️⃣ Click a word → seek audio
  const onWordClick = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      audioRef.current.play();
    }
  };

  // 3️⃣ Compute stats: total words & total time per speaker
  const stats = useMemo(() => {
    if (!conversation) return {};
    return conversation.snippets.reduce((acc, snip) => {
      const name = snip.speaker_name;
      const duration = snip.audio_end_offset - snip.audio_start_offset;
      const wordsCount = snip.words.length;
      if (!acc[name]) acc[name] = { time: 0, words: 0 };
      acc[name].time += duration;
      acc[name].words += wordsCount;
      return acc;
    }, {});
  }, [conversation]);

  // 4️⃣ List of speakers (for the dropdown)
  const speakers = useMemo(() => Object.keys(stats), [stats]);

  // 5️⃣ Filtered snippets by speaker & search term
  const filteredSnippets = useMemo(() => {
    if (!conversation) return [];
    return conversation.snippets.filter((snip) => {
      const bySpeaker =
        selectedSpeaker === '' || snip.speaker_name === selectedSpeaker;
      const bySearch =
        searchTerm === '' ||
        snip.words.some(([w]) =>
          w.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return bySpeaker && bySearch;
    });
  }, [conversation, selectedSpeaker, searchTerm]);

  if (!conversation) {
    return <p className="loading">Loading conversation…</p>;
  }

  return (
    <div id="root">
      <h1>Fora Transcript Viewer</h1>
      <audio
        ref={audioRef}
        controls
        src={conversation.audio_url}
        className="audio-player"
      />

      <h2>Speaker Stats</h2>
      <ul className="stats-list">
        {speakers.map((name) => (
          <li key={name}>
            <strong>{name}</strong>: {stats[name].words} words,{' '}
            {stats[name].time.toFixed(1)}s
          </li>
        ))}
      </ul>

      <div className="filters">
        <label>
          Speaker:
          <select
            value={selectedSpeaker}
            onChange={(e) => setSelectedSpeaker(e.target.value)}
          >
            <option value="">All</option>
            {speakers.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Search:
          <input
            type="text"
            placeholder="Filter transcript…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      <h2>Transcript</h2>
      <div className="transcript-box">
        {filteredSnippets.map((snippet, i) => (
          <p key={i}>
            <strong>{snippet.speaker_name}:</strong>{' '}
            {snippet.words.map(([word, start], j) => (
              <span
                key={j}
                onClick={() => onWordClick(start)}
                className="word"
              >
                {word}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
