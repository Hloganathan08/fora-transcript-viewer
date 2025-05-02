import { useState, useMemo } from 'react';
import './App.css';
import { useConversationData } from './hooks/useConversationData';
import AudioPlayer from './components/AudioPlayer';
import SpeakerStats from './components/SpeakerStats';
import Filters from './components/Filters';
import Transcript from './components/Transcript';

export default function App() {
  // Load conversation, loading & error
  const { conversation, loading, error } = useConversationData();

  // Filter states
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Compute stats per speaker
  const stats = useMemo(() => {
    if (!conversation || !conversation.snippets) return {}; // Guard clause
    return conversation.snippets.reduce((acc, snip) => {
      const who = snip.speaker_name;
      const dur = snip.audio_end_offset - snip.audio_start_offset;
      const cnt = snip.words.length;
      if (!acc[who]) acc[who] = { words: 0, time: 0 };
      acc[who].words += cnt;
      acc[who].time += dur;
      return acc;
    }, {});
  }, [conversation]);

  // Speaker list
  const speakers = useMemo(() => Object.keys(stats), [stats]);

  // Filtered snippets
  const filteredSnippets = useMemo(() => {
    if (!conversation || !conversation.snippets) return []; // Guard clause
    return conversation.snippets.filter((snip) => {
      const bySpeaker = !selectedSpeaker || snip.speaker_name === selectedSpeaker;
      const bySearch = !searchTerm || snip.words.some(([w]) =>
        w.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return bySpeaker && bySearch;
    });
  }, [conversation, selectedSpeaker, searchTerm]);

  // Handle audio time update
  const handleTimeUpdate = (time) => setCurrentTime(time);

  // Loading and error checks (moved after hooks)
  if (loading) return <p className="loading">Loading…</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div id="root">
      <header>
        <h1>Fora Transcript Viewer</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </header>

      <main className="app-layout">
    
        {/* Transcript Section */}
        <section className="transcript-section">
          <AudioPlayer
            audioUrl={conversation?.audio_url}
            onTimeUpdate={handleTimeUpdate}
          />

          {/* Filters Section */}
          <Filters
            speakers={Object.keys(stats)}
            selectedSpeaker={selectedSpeaker}
            onSpeakerChange={setSelectedSpeaker}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />


          {filteredSnippets.length > 0 ? (
            <Transcript
              snippets={filteredSnippets}
              currentTime={currentTime}
              onWordClick={(t) => handleTimeUpdate(t)}
            />
          ) : (
            <p className="no-results">Found nothing</p>
          )}
        </section>

        {/* Stats Section */}
        <aside className="stats-section">
          <SpeakerStats stats={stats} />
        </aside>
      </main>
    </div>
  );
}

