import React, { useMemo } from "react";

export default function Pitch({
  formation,
  placed = {},
  captain = null,
  captainSlot = null,
  style = "Balanced",

  onEmptySlotClick,

  selectedPlayer = null,
  onSlotClick,

  onDrop,
  onDragOver,
  onDragStart,

  getAllowedPositionsForSlot,

  /*
   * CHEMISTRY DATA
   */
  playerChemistry = {},
  playerChemistryLevel = {},
  chemistryLinks = [],
}) {
  if (!formation) {
    return null;
  }

  const coords = formation.coords || {};
  const slots = formation.slots || [];

  const slotClass = (slot) =>
    `pitch-slot slot-${String(slot)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")}`;

  const displayPosition = (slot) =>
    String(slot).replace(/[0-9]/g, "");

  /*
   * ----------------------------------------------------------
   * PLAYER → SLOT LOOKUP
   * ----------------------------------------------------------
   *
   * Chemistry links use player IDs.
   * The pitch needs to know where those players are located.
   */

  const playerSlotMap = useMemo(() => {
    const map = {};

    Object.entries(placed).forEach(
      ([slot, player]) => {
        if (player?.id !== undefined) {
          map[player.id] = slot;
        }
      }
    );

    return map;
  }, [placed]);


  /*
   * ----------------------------------------------------------
   * CHEMISTRY LINK DATA
   * ----------------------------------------------------------
   *
   * Convert player chemistry links into pitch coordinates.
   */

  const visibleChemistryLinks = useMemo(() => {
    return chemistryLinks
      .map((link) => {
        const fromSlot =
          playerSlotMap[link.from];

        const toSlot =
          playerSlotMap[link.to];

        if (
          !fromSlot ||
          !toSlot
        ) {
          return null;
        }

        const fromCoords =
          coords[fromSlot];

        const toCoords =
          coords[toSlot];

        if (
          !fromCoords ||
          !toCoords
        ) {
          return null;
        }

        return {
          ...link,

          fromSlot,
          toSlot,

          x1: fromCoords[0],
          y1: fromCoords[1],

          x2: toCoords[0],
          y2: toCoords[1],
        };
      })
      .filter(Boolean);
  }, [
    chemistryLinks,
    playerSlotMap,
    coords,
  ]);


  /*
   * ----------------------------------------------------------
   * CHEMISTRY COLORS
   * ----------------------------------------------------------
   */

  const chemistryColor = (
    level
  ) => {
    if (level === "strong") {
      return "#22c55e";
    }

    if (level === "medium") {
      return "#facc15";
    }

    if (level === "weak") {
      return "#ef4444";
    }

    return "transparent";
  };


  const chemistryGlow = (
    level
  ) => {
    if (level === "strong") {
      return "0 0 14px rgba(34,197,94,0.9)";
    }

    if (level === "medium") {
      return "0 0 12px rgba(250,204,21,0.8)";
    }

    if (level === "weak") {
      return "0 0 10px rgba(239,68,68,0.7)";
    }

    return "none";
  };


  /*
   * ----------------------------------------------------------
   * SELECTED PLAYER VALIDATION
   * ----------------------------------------------------------
   */

  const isValidForSelectedPlayer = (
    slot
  ) => {
    if (!selectedPlayer) {
      return false;
    }

    if (!getAllowedPositionsForSlot) {
      return true;
    }

    const allowed =
      getAllowedPositionsForSlot(
        slot,
        formation,
        style
      );

    return selectedPlayer.positions?.some(
      (position) =>
        allowed.includes(position)
    );
  };


  /*
   * ----------------------------------------------------------
   * DRAG HANDLERS
   * ----------------------------------------------------------
   */

  const handleDragStart = (
    event,
    player
  ) => {
    event.stopPropagation();

    if (onDragStart) {
      onDragStart(player);
    }
  };


  const handleDrop = (
    event,
    slot
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (onDrop) {
      onDrop(slot);
    }
  };


  /*
   * ----------------------------------------------------------
   * PACK CLICK
   * ----------------------------------------------------------
   */

  const handlePackClick = (
    event,
    slot
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (onEmptySlotClick) {
      onEmptySlotClick(slot);
    }
  };


  /*
   * ----------------------------------------------------------
   * PITCH
   * ----------------------------------------------------------
   */

  return (
    <div
      className="pitch-wrapper"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="football-pitch"
        style={{
          position: "relative",
          width: "min(1100px, 92vw)",
          height: "min(730px, 68vw)",
          minHeight: "520px",
          maxWidth: "1100px",
          margin: "0 auto",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >

        {/* ================================================== */}
        {/* PITCH BACKGROUND                                   */}
        {/* ================================================== */}

        <div className="pitch-stripes" />

        <div className="pitch-border" />


        {/* ================================================== */}
        {/* PITCH MARKINGS                                     */}
        {/* ================================================== */}

        <div className="pitch-halfway-line" />

        <div className="pitch-center-circle">
          <div className="pitch-center-dot" />
        </div>

        <div className="pitch-box pitch-box-top">
          <div className="pitch-six-yard pitch-six-yard-top" />
          <div className="pitch-penalty-dot pitch-penalty-dot-top" />
        </div>

        <div className="pitch-box pitch-box-bottom">
          <div className="pitch-six-yard pitch-six-yard-bottom" />
          <div className="pitch-penalty-dot pitch-penalty-dot-bottom" />
        </div>


        {/* ================================================== */}
        {/* CHEMISTRY CONNECTIONS                              */}
        {/* ================================================== */}
        {visibleChemistryLinks.length > 0 && (
          <svg
            className="chemistry-links-layer"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 2,
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            <defs>

              <filter
                id="chemistryGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur
                  stdDeviation="0.8"
                  result="blur"
                />

                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

            </defs>

            {visibleChemistryLinks.map(
              (link, index) => {

                const level =
                  chemistryLevel(
                    link.chemistry
                  );

                const color =
                  chemistryColor(
                    level
                  );

                return (
                  <g
                    key={`${link.from}-${link.to}-${index}`}
                  >

                    {/* Outer glow */}
                    <line
                      x1={link.x1}
                      y1={link.y1}
                      x2={link.x2}
                      y2={link.y2}
                      stroke={color}
                      strokeWidth="1.15"
                      strokeLinecap="round"
                      opacity="0.28"
                      filter="url(#chemistryGlow)"
                    />

                    {/* Main connection */}
                    <line
                      x1={link.x1}
                      y1={link.y1}
                      x2={link.x2}
                      y2={link.y2}
                      stroke={color}
                      strokeWidth="0.42"
                      strokeLinecap="round"
                      opacity="0.95"
                    />

                  </g>
                );
              }
            )}
          </svg>
        )}


        {/* ================================================== */}
        {/* FORMATION SLOTS                                    */}
        {/* ================================================== */}

        {slots.map((slot) => {
          const player =
            placed[slot];

          const position =
            displayPosition(slot);

          const coordinate =
            coords[slot] ||
            [50, 50];


          const isCaptain =
            captainSlot === slot ||
            player?.id === captain?.id;


          const isValid =
            isValidForSelectedPlayer(
              slot
            );


          const chemistry =
            player
              ? (
                  playerChemistry[
                    player.id
                  ] ?? 0
                )
              : 0;


          const chemistryLevelValue =
            player
              ? (
                  playerChemistryLevel[
                    player.id
                  ] ?? "none"
                )
              : "none";


          const chemistryColorValue =
            chemistryColor(
              chemistryLevelValue
            );


          const classes = [
            slotClass(slot),
            isCaptain
              ? "is-captain"
              : "",
            player
              ? "is-filled"
              : "is-empty",
            isValid &&
            !player
              ? "is-valid"
              : "",
          ]
            .filter(Boolean)
            .join(" ");


          return (
            <div
              key={slot}
              className={classes}
              style={{
                position:
                  "absolute",

                left:
                  `${coordinate[0]}%`,

                top:
                  `${coordinate[1]}%`,

                transform:
                  "translate(-50%, -50%)",

                zIndex: 5,
              }}

              onDragOver={(
                event
              ) => {
                event.preventDefault();
                event.stopPropagation();

                if (onDragOver) {
                  onDragOver(slot);
                }
              }}

              onDrop={(event) =>
                handleDrop(
                  event,
                  slot
                )
              }

              onClick={(event) => {
                if (
                  player ||
                  !selectedPlayer
                ) {
                  return;
                }

                event.stopPropagation();

                if (onSlotClick) {
                  onSlotClick(slot);
                }
              }}
            >

              {/* ================================================== */}
              {/* EMPTY POSITION                                     */}
              {/* ================================================== */}

              {!player && (
                <div className="position-pack-container">

                  <button
                    type="button"
                    className="slot-pack"

                    onClick={(event) =>
                      handlePackClick(
                        event,
                        slot
                      )
                    }
                  >

                    <span className="slot-pack-shine" />

                    <span className="slot-pack-glow" />

                    <span className="slot-pack-inner">

                      <span className="slot-pack-top">
                        XI
                      </span>

                      <span className="slot-pack-logo">
                        LEGACY
                      </span>

                      <span className="slot-pack-line" />

                      <span className="slot-pack-position">
                        {position}
                      </span>

                      <span className="slot-pack-label">
                        OPEN PACK
                      </span>

                    </span>

                  </button>

                  <span className="pitch-position-label">
                    {position}
                  </span>

                </div>
              )}


              {/* ================================================== */}
              {/* FILLED POSITION                                    */}
              {/* ================================================== */}

              {player && (
                <div
                  className={`placed-card ${
                    isCaptain
                      ? "placed-card-captain"
                      : ""
                  }`}

                  draggable={
                    !isCaptain
                  }

                  onDragStart={(
                    event
                  ) =>
                    handleDragStart(
                      event,
                      player
                    )
                  }

                  onClick={(
                    event
                  ) => {
                    event.stopPropagation();

                    if (onSlotClick) {
                      onSlotClick(slot);
                    }
                  }}

                  style={{
                    position:
                      "relative",

                    boxShadow:
                      chemistry > 0
                        ? chemistryGlow(
                            chemistryLevelValue
                          )
                        : undefined,
                  }}
                >

                  {/* CHEMISTRY BADGE */}

                  {chemistry > 0 && (
                    <div
                      className="placed-card-chemistry"

                      style={{
                        position:
                          "absolute",

                        top:
                          "-9px",

                        right:
                          "-9px",

                        minWidth:
                          "28px",

                        height:
                          "28px",

                        padding:
                          "0 6px",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        borderRadius:
                          "50%",

                        background:
                          "#07111f",

                        border:
                          `2px solid ${chemistryColorValue}`,

                        color:
                          chemistryColorValue,

                        fontSize:
                          "12px",

                        fontWeight:
                          "900",

                        lineHeight:
                          1,

                        boxSizing:
                          "border-box",

                        boxShadow:
                          `0 0 10px ${chemistryColorValue}66`,

                        zIndex:
                          10,
                      }}
                    >
                      {chemistry}
                    </div>
                  )}


                  {/* PLAYER RATING */}

                  <div className="placed-card-rating">
                    {player.ovr ??
                      player.base ??
                      80}
                  </div>


                  {/* PLAYER POSITION */}

                  <div className="placed-card-position">
                    {position}
                  </div>


                  {/* PLAYER NAME */}

                  <div className="placed-card-name">
                    {player.name}
                  </div>


                  {/* CAPTAIN */}

                  {isCaptain && (
                    <div className="placed-card-captain-badge">
                      ★ CAPTAIN
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}


/*
 * ============================================================
 * LOCAL CHEMISTRY LEVEL HELPER
 * ============================================================
 */

function chemistryLevel(
  value
) {
  if (value >= 7) {
    return "strong";
  }

  if (value >= 4) {
    return "medium";
  }

  if (value > 0) {
    return "weak";
  }

  return "none";
}