import { useEffect } from "react";

export default function PackOpening({
  players = [],
  season,
  round,
  type,
  onComplete,
}) {
  /*
   * Automatically finish the animation
   * after all five cards have appeared.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 4500);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  const isCaptain =
    type === "CAPTAIN";

  return (
    <div className="pack-overlay">
      <div className="pack-stage">

        {/* HEADER */}

        <div className="eyebrow">
          HISTORICAL DRAFT PACK ·{" "}
          {isCaptain
            ? "CAPTAIN"
            : `ROUND ${round}/10`}
        </div>

        <h1>
          REVEALING{" "}
          <span>
            {isCaptain
              ? "YOUR CAPTAIN"
              : "YOUR PLAYERS"}
          </span>
        </h1>

        <p>
          {type} · {season}
        </p>

        {/* PLAYER CARDS */}

        <div className="reveal-row">

          {players
            .slice(0, 5)
            .map(
              (player, index) => (
                <div
                  className="reveal-card"
                  style={{
                    animationDelay:
                      `${index * 0.65}s`,
                  }}
                  key={player.id}
                >

                  <div className="reveal-number">
                    #{index + 1}
                  </div>

                  <div className="reveal-rating">
                    {player.ovr ??
                      player.base ??
                      80}
                  </div>

                  <strong>
                    {player.name}
                  </strong>

                  <small>
                    {player.positions?.join(
                      " · "
                    )}
                  </small>

                  <small>
                    {player.nation}
                  </small>

                  {player.club && (
                    <small>
                      {player.club}
                    </small>
                  )}

                </div>
              )
            )}

        </div>

        {/* CENTER PACK */}

        <div className="pack-core">

          <div className="pack-core-logo">
            XI
          </div>

          <div className="pack-core-name">
            LEGACY
          </div>

        </div>

        {/* LOADING ANIMATION */}

        <div className="pack-loading">

          <span></span>
          <span></span>
          <span></span>

        </div>

        {/* REVEAL STATUS */}

        <div className="pack-status">
          REVEALING{" "}
          {Math.min(
            players.length,
            5
          )}
          /5
        </div>

      </div>
    </div>
  );
}