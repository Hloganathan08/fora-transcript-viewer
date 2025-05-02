export default function Filters({
    speakers,
    selectedSpeaker,
    onSpeakerChange,
    searchTerm,
    onSearchChange,
  }) {
    return (
      <div className="filters">
        <label>
          Speaker:
          <select
            value={selectedSpeaker}
            onChange={(e) => onSpeakerChange(e.target.value)}
          >
            <option value="">All</option>
            {speakers.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
  
        <label>
          Search:
          <input
            type="text"
            placeholder="Filter transcript…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
      </div>
    );
  }