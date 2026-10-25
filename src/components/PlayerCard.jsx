export default function PlayerCard({
  player,
  draggable = true,
  selected = false,
  onClick,
  onDragStart,
  compact = false,
}) {
  if (!player) return null;

  const rating = player.ovr ?? player.base ?? 80;
  const mainPosition = player.positions?.[0] ?? "—";

  const pace = Math.max(55, rating - 5);
  const shooting = Math.max(50, rating - 1);
  const passing = Math.max(55, rating + 2);
  const dribbling = Math.max(55, rating + 1);
  const defending = Math.max(40, rating - 4);
  const physical = Math.max(50, rating);

  return (
    <article
      className={[
        "player-card",
        "legacy-gold-card",
        selected ? "selected" : "",
        compact ? "compact" : "",
        player.isIcon ? "icon-card" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      draggable={draggable}
      onDragStart={() => onDragStart?.(player)}
      onClick={() => onClick?.(player)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onClick?.(player);
        }
      }}
    >
      {/* Card shine */}
      <div className="legacy-card-shine" />

      {/* Top */}
      <div className="legacy-card-top">
        <div className="legacy-rating">
          <strong>{rating}</strong>
          <span>OVR</span>
        </div>

        <div className="legacy-position">
          {mainPosition}
        </div>
      </div>

      {/* Large OVR area */}
      <div className="legacy-ovr-stage">
        <div className="legacy-ovr-number">
          {rating}
        </div>

        <div className="legacy-ovr-label">
          OVERALL
        </div>

        <div className="legacy-card-symbol">
          XI
        </div>
      </div>

      {/* Player information */}
      <div className="legacy-player-info">
        <h3>{player.name}</h3>

        <div className="legacy-player-meta">
          <span>🌍 {player.nation}</span>
          <span>⚽ {player.club}</span>
        </div>

        {player.season && (
          <div className="legacy-season">
            {player.season}
          </div>
        )}
      </div>

      {/* Stats */}
      {!compact && (
        <div className="legacy-stats">
          <div className="legacy-stat">
            <b>{pace}</b>
            <span>PAC</span>
          </div>

          <div className="legacy-stat">
            <b>{shooting}</b>
            <span>SHO</span>
          </div>

          <div className="legacy-stat">
            <b>{passing}</b>
            <span>PAS</span>
          </div>

          <div className="legacy-stat">
            <b>{dribbling}</b>
            <span>DRI</span>
          </div>

          <div className="legacy-stat">
            <b>{defending}</b>
            <span>DEF</span>
          </div>

          <div className="legacy-stat">
            <b>{physical}</b>
            <span>PHY</span>
          </div>
        </div>
      )}

      {/* Legacy badge */}
      {player.isIcon && (
        <div className="legacy-badge">
          ★ LEGACY
        </div>
      )}

      {/* Choose button */}
      <button
        type="button"
        className="legacy-card-button"
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(player);
        }}
      >
        {selected ? "SELECTED ✓" : "CHOOSE PLAYER →"}
      </button>
    </article>
  );
}