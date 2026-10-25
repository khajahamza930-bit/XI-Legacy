import { useEffect, useState } from "react";

export default function ManagerPack({
  managers = [],
  formation,
  onComplete,
}) {
  const [phase, setPhase] = useState("lights");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase("board");
    }, 1800);

    const timer2 = setTimeout(() => {
      setPhase("silhouette");
    }, 3600);

    const timer3 = setTimeout(() => {
      setPhase("reveal");
    }, 5200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="manager-pack-opening">

      {/* ==================================================
          STADIUM LIGHTS
          ================================================== */}

      <div className="manager-stadium-lights">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>


      {/* ==================================================
          MAIN CONTENT
          ================================================== */}

      <div className="manager-pack-content">

        <p className="manager-pack-eyebrow">
          XI LEGACY · MANAGER PACK
        </p>


        {/* ==================================================
            PHASE 1 — INTRO
            ================================================== */}

        {phase === "lights" && (
          <div className="manager-pack-intro">

            <div className="manager-pack-logo">
              XI
            </div>

            <h1>
              THE MIND
              <span> BEHIND THE XI</span>
            </h1>

            <p>
              Preparing your tactical leadership...
            </p>

          </div>
        )}


        {/* ==================================================
            PHASE 2 — TACTICAL BOARD
            ================================================== */}

        {phase === "board" && (
          <div className="manager-tactical-reveal">

            <p className="manager-reveal-label">
              YOUR FORMATION
            </p>

            <h1>
              {formation?.name ?? "FORMATION"}
            </h1>

            <div className="manager-tactical-pitch">

              <div className="tactical-line tactical-st">
                ST
              </div>

              <div className="tactical-line tactical-lw">
                LW
              </div>

              <div className="tactical-line tactical-rw">
                RW
              </div>

              <div className="tactical-line tactical-cm1">
                CM
              </div>

              <div className="tactical-line tactical-cm2">
                CM
              </div>

              <div className="tactical-line tactical-cm3">
                CM
              </div>

              <div className="tactical-line tactical-lb">
                LB
              </div>

              <div className="tactical-line tactical-cb1">
                CB
              </div>

              <div className="tactical-line tactical-cb2">
                CB
              </div>

              <div className="tactical-line tactical-rb">
                RB
              </div>

              <div className="tactical-line tactical-gk">
                GK
              </div>

            </div>

          </div>
        )}


        {/* ==================================================
            PHASE 3 — SILHOUETTE
            ================================================== */}

        {phase === "silhouette" && (
          <div className="manager-silhouette-reveal">

            <div className="manager-silhouette">

              <div className="manager-head" />

              <div className="manager-body" />

            </div>

            <p>
              THE STRATEGIST
            </p>

            <h1>
              WHO WILL LEAD
              <span> YOUR XI?</span>
            </h1>

          </div>
        )}


        {/* ==================================================
            PHASE 4 — MANAGERS
            ================================================== */}

        {phase === "reveal" && (
          <div className="manager-final-reveal">

            <p className="manager-reveal-label">
              FIVE MINDS · ONE LEADER
            </p>

            <h1>
              MANAGER
              <span> CANDIDATES</span>
            </h1>

            <div className="manager-reveal-grid">

              {managers.map((manager, index) => (

                <div
                  key={manager.id ?? index}
                  className="manager-reveal-card"
                  style={{
                    animationDelay:
                      `${index * 0.35}s`,
                  }}
                >

                  <div className="manager-reveal-number">
                    #{index + 1}
                  </div>

                  <div className="manager-reveal-emblem">
                    XI
                  </div>

                  <strong>
                    {manager.name}
                  </strong>

                  <span>
                    🌍 {manager.nation}
                  </span>

                  <small>
                    {manager.style ??
                      manager.tactics ??
                      "BALANCED"}
                  </small>

                </div>

              ))}

            </div>

            <button
              className="manager-pack-continue"
              onClick={onComplete}
            >
              REVEAL MANAGERS →
            </button>

          </div>
        )}

      </div>

    </div>
  );
}