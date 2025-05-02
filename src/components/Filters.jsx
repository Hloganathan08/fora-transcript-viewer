import './Filters.css';

export default function Filters({ speakers, selectedSpeaker, onSpeakerChange, searchTerm, onSearchChange }) {
  return (
    <div className="filters">
      <label>
        Speaker:
        <select value={selectedSpeaker} onChange={(e) => onSpeakerChange(e.target.value)}>
          <option value="">All</option>
          {speakers.map((speaker) => (
            <option key={speaker} value={speaker}>
              {speaker}
            </option>
          ))}
        </select>
      </label>
      <label>
        Search:
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search transcript..."
        />
      </label>
    </div>
  );
}