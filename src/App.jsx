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
      <h1>Fora Transcript Viewer</h1>

      <AudioPlayer
        audioUrl={conversation?.audio_url}
        onTimeUpdate={handleTimeUpdate}
      />

      <SpeakerStats stats={stats} />

      <Filters
        speakers={speakers}
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
    </div>
  );
}

