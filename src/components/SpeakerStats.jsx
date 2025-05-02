export default function SpeakerStats({ stats }) {
    return (
      <>
        <h2>Speaker Stats</h2>
        <ul className="stats-list">
          {Object.entries(stats).map(([name, { words, time }]) => (
            <li key={name}>
              <strong>{name}</strong>: {words} words, {time.toFixed(1)}s
            </li>
          ))}
        </ul>
      </>
    );
  }