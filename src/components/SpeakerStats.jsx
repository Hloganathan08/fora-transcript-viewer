import './SpeakerStats.css';

export default function SpeakerStats({ stats }) {
  return (
    <div className="speaker-stats">
      <h2>Speaker Stats</h2>
      <ul className="stats-list">
        {Object.entries(stats).map(([name, { words, time }]) => (
          <li key={name}>
            <span className="speaker-name">{name}</span>
            <span className="stats-value">
              {words} words, {time.toFixed(1)}s
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}