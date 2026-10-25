export default function CaptainCard({
  player,
  index,
  onClick,
}) {
  if (!player) return null;

  const rating =
    player.ovr ??
    player.base ??
    80;

  const positions =
    player.positions?.join(" · ") ?? "—";

  return (
    <button
      type="button"
      className="captain-card"
      onClick={() => onClick?.(player)}
    >
      {/* Premium glow */}
      <span className="captain-card-glow" />

      {/* Top number */}
      <div className="captain-card-number">
        #{index + 1}
      </div>

      {/* Main OVR */}
      <div className="captain-card-rating">
        <strong>{rating}</strong>
        <span>OVR</span>
      </div>

      {/* Position */}
      <div className="captain-card-position">
        {positions}
      </div>

      {/* Decorative center */}
      <div className="captain-card-center">
        <div className="captain-card-emblem">
          XI
        </div>

        <span>LEGACY</span>
      </div>

      {/* Player information */}
      <div className="captain-card-info">
        <h2>{player.name}</h2>

        <p>
          🌍 {player.nation}
        </p>

        <p>
          ⚽ {player.club}
        </p>
      </div>

      {/* Captain button */}
      <div className="captain-card-action">
        <span>★</span>
        CHOOSE CAPTAIN
      </div>
    </button>
  );
}