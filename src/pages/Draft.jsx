import { useMemo, useState } from "react";

import useDraft from "../hooks/useDraft";

import FormationPicker from "../components/FormationPicker";
import PlayerCard from "../components/PlayerCard";
import PackOpening from "../components/PackOpening";
import Pitch from "../components/Pitch";
import CaptainCard from "../components/CaptainCard";

export default function Draft({
  difficulty,
  onExit,
}) {
  const d = useDraft(difficulty);

  const [dragged, setDragged] = useState(null);

  /*
   * ==========================================================
   * FORMATION
   * ==========================================================
   */

  if (d.stage === "formation") {
    return (
      <div className="page">
        <Header d={d} onExit={onExit} />

        <section className="center">
          <p className="eyebrow">STEP 1</p>

          <h1>
            Choose a <span>Formation</span>
          </h1>

          <p>
            Select the shape for your complete XI.
          </p>

          <FormationPicker
            formations={d.formationChoices}
            onPick={d.chooseFormation}
          />
        </section>
      </div>
    );
  }

  /*
   * ==========================================================
   * LINEUP PREVIEW
   * ==========================================================
   *
   * After choosing the formation, show the complete empty
   * formation first. This lets the user understand exactly
   * which positions are required before selecting a captain.
   */

  if (d.stage === "lineupPreview") {
    return (
      <div className="page lineup-preview-page">
        <Header d={d} onExit={onExit} />

        <main className="lineup-preview-shell">

          <section className="lineup-preview-heading">

            <p className="eyebrow">
              STEP 2 · FORMATION PREVIEW
            </p>

            <h1>
              Build your{" "}
              <span>Legacy XI</span>
            </h1>

            <p>
              Your formation determines the positions your
              players can occupy.
            </p>

          </section>

          <section className="lineup-preview-card">

            <div className="lineup-preview-top">

              <div>
                <small>SELECTED FORMATION</small>

                <h2>
                  {d.formation?.name ?? "—"}
                </h2>
              </div>

              <div className="lineup-preview-count">
                <strong>0/11</strong>
                <span>PLAYERS</span>
              </div>

            </div>

            <div className="lineup-preview-pitch-wrap">

              <Pitch
                formation={d.formation}
                placed={d.placed}
                captain={null}
                captainSlot={null}
                style={d.style}
                onEmptySlotClick={() => {}}
                getAllowedPositionsForSlot={
                  d.getAllowedPositionsForSlot
                }
                selectedPlayer={null}
                onSlotClick={() => {}}
                onDrop={() => {}}
                onDragOver={() => {}}
                onDragStart={() => {}}
                playerChemistry={{}}
                playerChemistryLevel={{}}
                chemistryLinks={[]}
              />

            </div>

            <div className="lineup-position-list">

              <div className="lineup-position-list-title">
                REQUIRED POSITIONS
              </div>

              <div className="lineup-position-grid">

                {(d.formation?.slots ?? []).map(
                  (slot, index) => {

                    const allowed =
                      d.getAllowedPositionsForSlot
                        ? d.getAllowedPositionsForSlot(
                            slot,
                            d.formation,
                            d.style
                          )
                        : [
                            String(slot).replace(
                              /[0-9]/g,
                              ""
                            ),
                          ];

                    return (
                      <div
                        key={slot}
                        className="lineup-position-item"
                      >
                        <span>
                          {index + 1}
                        </span>

                        <strong>
                          {slot}
                        </strong>

                        <small>
                          {allowed?.join(" / ") ||
                            slot}
                        </small>
                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </section>

          <div className="lineup-preview-actions">

            <button
              type="button"
              className="primary lineup-preview-continue"
              onClick={d.finishCaptainOpening}
            >
              CONTINUE TO CAPTAIN → 
            </button>

          </div>

          {d.message && (
            <div className="error">
              {d.message}
            </div>
          )}

        </main>

        <style>{`
          .lineup-preview-page {
            min-height: 100vh;
            background:
              radial-gradient(
                circle at 50% 0%,
                rgba(34,119,255,.12),
                transparent 40%
              ),
              linear-gradient(
                145deg,
                #030711 0%,
                #07101e 50%,
                #03060c 100%
              );
          }

          .lineup-preview-shell {
            width: min(1450px, calc(100% - 30px));
            margin: 0 auto;
            padding: 32px 0 60px;
          }

          .lineup-preview-heading {
            text-align: center;
            margin-bottom: 24px;
          }

          .lineup-preview-heading h1 {
            margin: 5px 0;
            font-size: clamp(30px, 4vw, 48px);
            line-height: 1;
            font-weight: 950;
            letter-spacing: -.03em;
          }

          .lineup-preview-heading h1 span {
            color: #e4b93d;
          }

          .lineup-preview-heading p:last-child {
            color: #8e9daf;
            font-size: 13px;
          }

          .lineup-preview-card {
            width: 100%;
            border:
              1px solid rgba(255,255,255,.08);
            border-radius: 20px;
            background:
              linear-gradient(
                145deg,
                rgba(12,25,43,.97),
                rgba(4,9,17,.98)
              );
            box-shadow:
              0 25px 60px rgba(0,0,0,.35);
            overflow: hidden;
          }

          .lineup-preview-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 18px 22px;
            border-bottom:
              1px solid rgba(255,255,255,.07);
          }

          .lineup-preview-top small {
            color: #728197;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .15em;
          }

          .lineup-preview-top h2 {
            margin: 4px 0 0;
            color: #fff;
            font-size: 24px;
            font-weight: 950;
          }

          .lineup-preview-count {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }

          .lineup-preview-count strong {
            color: #e4b93d;
            font-size: 25px;
            line-height: 1;
            font-weight: 950;
          }

          .lineup-preview-count span {
            margin-top: 4px;
            color: #65758b;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .12em;
          }

          .lineup-preview-pitch-wrap {
            width: 100%;
            padding: 25px 20px 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }

          .lineup-preview-pitch-wrap > * {
            width: min(1100px, 100%);
          }

          .lineup-position-list {
            padding: 20px;
            border-top:
              1px solid rgba(255,255,255,.06);
          }

          .lineup-position-list-title {
            margin-bottom: 12px;
            color: #8b9aae;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .15em;
          }

          .lineup-position-grid {
            display: grid;
            grid-template-columns:
              repeat(auto-fit, minmax(100px, 1fr));
            gap: 8px;
          }

          .lineup-position-item {
            min-height: 62px;
            padding: 9px;
            border:
              1px solid rgba(255,255,255,.07);
            border-radius: 10px;
            background:
              rgba(255,255,255,.025);
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .lineup-position-item > span {
            color: #53647a;
            font-size: 7px;
            font-weight: 900;
          }

          .lineup-position-item strong {
            margin-top: 2px;
            color: #fff;
            font-size: 12px;
            font-weight: 950;
          }

          .lineup-position-item small {
            margin-top: 2px;
            color: #46aaff;
            font-size: 7px;
            font-weight: 800;
          }

          .lineup-preview-actions {
            display: flex;
            justify-content: center;
            margin-top: 22px;
          }

          .lineup-preview-continue {
            min-width: 250px;
            min-height: 48px;
            font-weight: 950;
            letter-spacing: .05em;
          }

          @media (max-width: 700px) {
            .lineup-preview-shell {
              width: calc(100% - 18px);
              padding-top: 22px;
            }

            .lineup-preview-card {
              border-radius: 14px;
            }

            .lineup-preview-top {
              padding: 14px;
            }

            .lineup-preview-top h2 {
              font-size: 20px;
            }

            .lineup-preview-pitch-wrap {
              padding:
                15px 5px 10px;
            }

            .lineup-position-list {
              padding: 14px;
            }

            .lineup-position-grid {
              grid-template-columns:
                repeat(3, minmax(0,1fr));
            }

            .lineup-preview-continue {
              width: 100%;
            }
          }

          @media (max-width: 420px) {
            .lineup-position-grid {
              grid-template-columns:
                repeat(2, minmax(0,1fr));
            }
          }
        `}</style>
      </div>
    );
  }

  /*
   * ==========================================================
   * CAPTAIN OPENING
   * ==========================================================
   */

  if (d.stage === "captainOpening") {
    return (
      <div className="captain-opening-screen">
        <div className="captain-opening-content">

          <p className="eyebrow">
            XI LEGACY · CAPTAIN PACK
          </p>

          <h1>
            REVEALING YOUR{" "}
            <span>CAPTAIN CANDIDATES</span>
          </h1>

          <p className="captain-opening-subtitle">
            Five legends. One leader.
          </p>

          <div className="captain-opening-pack">
            <div className="captain-opening-logo">
              XI
            </div>

            <strong>LEGACY</strong>
            <small>CAPTAIN PACK</small>
          </div>

          <div className="captain-opening-cards">
            {d.captainChoices.map(
              (player, index) => (
                <div
                  key={player.id}
                  className="captain-opening-card"
                  style={{
                    animationDelay:
                      `${index * 0.7}s`,
                  }}
                >
                  <div className="captain-opening-card-inner">

                    <span>#{index + 1}</span>

                    <strong>{player.base}</strong>

                    <small>OVR</small>

                    <h2>{player.name}</h2>

                    <p>
                      {player.positions?.join(" · ")}
                    </p>

                    <p>
                      🌍 {player.nation}
                    </p>

                    <p>
                      ⚽ {player.club}
                    </p>

                  </div>
                </div>
              )
            )}
          </div>

          <button
            type="button"
            className="captain-opening-continue"
            onClick={d.finishCaptainOpening}
          >
            REVEAL CAPTAINS →
          </button>

        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * CAPTAIN
   * ==========================================================
   */

  if (d.stage === "captain") {
    return (
      <div className="page captain-selection-page">

        <Header d={d} onExit={onExit} />

        <section className="captain-selection">

          <div className="captain-selection-heading">

            <p className="eyebrow">
              STEP 2 · CAPTAIN PACK
            </p>

            <h1>
              Choose your <span>Captain</span>
            </h1>

            <p className="captain-selection-subtitle">
              Five legends. One leader.
            </p>

          </div>

          <div className="captain-selection-grid">

            {d.captainChoices.map(
              (player, index) => (
                <CaptainCard
                  key={player.id}
                  player={{
                    ...player,
                    ovr: player.base,
                  }}
                  index={index}
                  onClick={d.startCaptain}
                />
              )
            )}

          </div>

          <div className="captain-selection-footer">

            <span className="captain-footer-star">
              ★
            </span>

            <span>
              Choose the player who will lead your XI
            </span>

            <span className="captain-footer-star">
              ★
            </span>

          </div>

        </section>
      </div>
    );
  }

  /*
   * ==========================================================
   * MANAGER
   * ==========================================================
   */

  if (
    d.stage === "managerOpening" ||
    d.stage === "manager"
  ) {
    return (
      <div className="page manager-selection-page">

        <Header d={d} onExit={onExit} />

        <section className="manager-selection">

          <div className="manager-selection-heading">

            <p className="eyebrow">
              STEP 3 · MANAGER
            </p>

            <h1>
              Choose your <span>Manager</span>
            </h1>

            <p className="manager-selection-subtitle">
              Five managers. One tactical identity.
            </p>

          </div>

          <div className="manager-team-preview">

            <div className="manager-preview-item">
              <small>FORMATION</small>

              <strong>
                {d.formation?.name ?? "—"}
              </strong>
            </div>

            <div className="manager-preview-divider" />

            <div className="manager-preview-item">
              <small>CAPTAIN</small>

              <strong>
                {d.captain?.name ?? "—"}
              </strong>
            </div>

            <div className="manager-preview-divider" />

            <div className="manager-preview-item">
              <small>STYLE</small>

              <strong>
                {d.style ?? "Balanced"}
              </strong>
            </div>

          </div>

          <div className="manager-selection-grid">

            {d.managerChoices.map(
              (manager, index) => (

                <button
                  key={manager.id}
                  type="button"
                  className="legacy-manager-card"
                  onClick={() =>
                    d.startManager(manager)
                  }
                >

                  <div className="manager-card-number">
                    #{index + 1}
                  </div>

                  <div className="manager-card-emblem">

                    <div className="manager-card-emblem-ring">
                      <span>XI</span>
                    </div>

                    <small>LEGACY</small>

                  </div>

                  <div className="legacy-manager-info">

                    <h2>{manager.name}</h2>

                    <p>
                      🌍 {manager.nation}
                    </p>

                    <p>
                      🏆 {manager.league}
                    </p>

                  </div>

                  <div className="manager-tactical-box">

                    <span>TACTICAL IDENTITY</span>

                    <strong>
                      {manager.style ??
                        manager.tactics ??
                        "BALANCED"}
                    </strong>

                  </div>

                  <div className="manager-select-button">

                    <span>★</span>

                    SELECT MANAGER →

                  </div>

                </button>
              )
            )}

          </div>

          <div className="manager-selection-footer">

            <span>★</span>

            <p>
              Your manager will lead your XI through the draft.
            </p>

            <span>★</span>

          </div>

        </section>
      </div>
    );
  }

  /*
   * ==========================================================
   * PLAYER PACK OPENING
   * ==========================================================
   */

  if (d.stage === "opening") {
    return (
      <PackOpening
        players={d.pack}
        season={d.season}
        round={d.round}
        type={d.roundType}
        onComplete={d.finishPackOpening}
      />
    );
  }

  /*
   * ==========================================================
   * PLAYER PICK
   * ==========================================================
   */

  if (d.stage === "pick") {

    const selectedPlayer =
      d.pack.find(
        (player) =>
          player.id === d.selectedId
      );

    return (
      <div className="page">

        <Header d={d} onExit={onExit} />

        <section className="center">

          <p className="eyebrow">
            POSITION PACK · {d.activePackSlot}
          </p>

          <h1>
            Choose your <span>Player</span>
          </h1>

          <p>
            Select one player for{" "}
            <strong>{d.activePackSlot}</strong>.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "20px",
              width: "100%",
              maxWidth: "1100px",
              margin: "30px auto",
            }}
          >

            {d.pack.map(
              (player) => (

                <button
                  key={player.id}
                  type="button"
                  onClick={() =>
                    d.choosePlayer(player)
                  }
                  style={{
                    cursor: "pointer",
                    border:
                      d.selectedId === player.id
                        ? "3px solid gold"
                        : "1px solid #444",
                    background:
                      d.selectedId === player.id
                        ? "#16233a"
                        : "#10151f",
                    color: "white",
                    borderRadius: "14px",
                    padding: "12px",
                  }}
                >
                  <PlayerCard player={player} />
                </button>
              )
            )}

          </div>

          {selectedPlayer && (

            <div style={{ marginTop: "20px" }}>

              <p>
                Selected:{" "}
                <strong>
                  {selectedPlayer.name}
                </strong>
              </p>

              <p>
                Position:{" "}
                <strong>
                  {d.activePackSlot}
                </strong>
              </p>

              <button
                type="button"
                className="primary"
                onClick={() =>
                  d.placePlayer(
                    selectedPlayer,
                    d.activePackSlot
                  )
                }
              >
                CONFIRM PLAYER →
              </button>

            </div>
          )}

          {d.message && (
            <div className="error">
              {d.message}
            </div>
          )}

        </section>
      </div>
    );
  }

  /*
   * ==========================================================
   * FINAL DRAFT RESULT
   * ==========================================================
   */

  if (d.stage === "done") {
    return (
      <DraftResultScreen
        d={d}
        onExit={onExit}
      />
    );
  }

  /*
   * ==========================================================
   * MAIN DRAFT
   * ==========================================================
   *
   * IMPORTANT:
   * The pitch is now the LARGE PRIMARY AREA.
   * The squad/stat information sits underneath it instead of
   * squeezing the pitch into the old narrow sidebar.
   */

  return (
    <div className="page">

      <Header d={d} onExit={onExit} />

      <div className="draft-large-shell">

        <main className="draft-main-area">

          <div className="round-head">

            <div>

              <p className="eyebrow">
                BUILD YOUR XI
              </p>

              <h1>
                Complete your{" "}
                <span>Legacy XI</span>
              </h1>

              <p>
                Open a pack from any empty position on the pitch.
              </p>

            </div>

          </div>

          <div className="style-panel">

            <div className="style-title">

              <div>

                <small>TACTICAL STYLE</small>

                <h3>

                  {d.style === "Defensive" &&
                    "🛡️ Defensive"}

                  {d.style === "Balanced" &&
                    "⚖️ Balanced"}

                  {d.style === "Attacking" &&
                    "⚔️ Attacking"}

                </h3>

              </div>

              <span>
                Changes which positions players can fill
              </span>

            </div>

            <div className="style-buttons">

              <button
                type="button"
                className={
                  d.style === "Defensive"
                    ? "style-btn active defensive"
                    : "style-btn defensive"
                }
                onClick={() =>
                  d.setStyle("Defensive")
                }
              >
                <strong>
                  🛡️ Defensive
                </strong>

                <small>
                  More defensive positioning
                </small>
              </button>

              <button
                type="button"
                className={
                  d.style === "Balanced"
                    ? "style-btn active balanced"
                    : "style-btn balanced"
                }
                onClick={() =>
                  d.setStyle("Balanced")
                }
              >
                <strong>
                  ⚖️ Balanced
                </strong>

                <small>
                  Standard positioning
                </small>
              </button>

              <button
                type="button"
                className={
                  d.style === "Attacking"
                    ? "style-btn active attacking"
                    : "style-btn attacking"
                }
                onClick={() =>
                  d.setStyle("Attacking")
                }
              >
                <strong>
                  ⚔️ Attacking
                </strong>

                <small>
                  More attacking positioning
                </small>
              </button>

            </div>
          </div>

          <section className="large-pitch-section">

            <div className="large-pitch-header">

              <div>

                <small>YOUR XI</small>

                <h2>
                  {d.formation?.name}
                </h2>

              </div>

              <strong>
                {d.allPlacedCount}/11
              </strong>

            </div>

            <Pitch
              formation={d.formation}
              placed={d.placed}
              captain={d.captain}
              captainSlot={d.captainSlot}
              style={d.style}

              onEmptySlotClick={(slot) => {
                d.openPositionPack(slot);
              }}

              getAllowedPositionsForSlot={
                d.getAllowedPositionsForSlot
              }

              selectedPlayer={
                d.selectedId
                  ? d.pack.find(
                      (player) =>
                        player.id === d.selectedId
                    )
                  : dragged
              }

              onSlotClick={(slot) => {

                const player =
                  d.selectedId
                    ? d.pack.find(
                        (player) =>
                          player.id === d.selectedId
                      )
                    : dragged;

                if (player) {

                  const success =
                    d.placePlayer(
                      player,
                      slot
                    );

                  if (success) {
                    setDragged(null);
                  }
                }
              }}

              onDrop={(slot) => {

                if (dragged) {

                  const success =
                    d.placePlayer(
                      dragged,
                      slot
                    );

                  if (success) {
                    setDragged(null);
                  }
                }
              }}

              onDragOver={() => {}}

              onDragStart={setDragged}

              playerChemistry={
                d.playerChemistry
              }

              playerChemistryLevel={
                d.playerChemistryLevel
              }

              chemistryLinks={
                d.chemistryLinks
              }
            />

          </section>

        </main>

        <aside className="draft-info-area">

          <DraftSquadPanel d={d} />

          <div
            className="stats-bar"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >

            <span>
              TEAM OVR{" "}
              <b>
                {d.allPlacedCount > 0
                  ? d.teamOVR
                  : "--"}
              </b>
            </span>

            <span>
              CHEMISTRY{" "}
              <b>
                {d.teamChemistry ?? 0}
              </b>
            </span>

            <span>
              STYLE{" "}
              <b>{d.style}</b>
            </span>

          </div>

          {d.allPlacedCount > 0 && (
            <div
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                padding: "8px 12px",
                borderRadius: "10px",
                background:
                  "rgba(7,17,31,0.75)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                color: "#b9c7d8",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              🟢 Strong 7–10&nbsp;&nbsp;
              🟡 Medium 4–6&nbsp;&nbsp;
              🔴 Weak 1–3
            </div>
          )}

          {d.captain && (
            <div className="captain-chip">
              ⭐ CAPTAIN · {d.captain.name}
            </div>
          )}

          {d.manager && (
            <div className="manager-chip">
              👨‍💼 MANAGER · {d.manager.name}
            </div>
          )}

          <div
            className="manager-chip"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span>🧪 TEAM CHEMISTRY</span>

            <strong>
              {d.teamChemistry ?? 0}
            </strong>
          </div>

          {d.activePackSlot && (
            <div className="manager-chip">
              🎴 DRAFTING · {d.activePackSlot}
            </div>
          )}

          {d.message && (
            <div className="error">
              {d.message}
            </div>
          )}

        </aside>

      </div>

      <style>{`
        /*
         * ======================================================
         * LARGE DRAFT LAYOUT
         * ======================================================
         */

        .draft-large-shell {
          width: min(1500px, calc(100% - 30px));
          margin: 0 auto;
          padding: 28px 0 60px;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(270px, 320px);
          gap: 22px;
          align-items: start;
        }

        .draft-main-area {
          min-width: 0;
        }

        .draft-info-area {
          min-width: 0;
        }

        /*
         * ======================================================
         * LARGE PITCH
         * ======================================================
         */

        .large-pitch-section {
          width: 100%;
          margin-top: 22px;
          padding: 18px;
          border-radius: 20px;
          border:
            1px solid rgba(255,255,255,.08);
          background:
            linear-gradient(
              145deg,
              rgba(10,24,41,.98),
              rgba(3,9,17,.99)
            );
          box-shadow:
            0 25px 60px rgba(0,0,0,.32);
        }

        .large-pitch-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .large-pitch-header small {
          color: #718197;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .15em;
        }

        .large-pitch-header h2 {
          margin: 3px 0 0;
          color: #fff;
          font-size: 23px;
          font-weight: 950;
        }

        .large-pitch-header > strong {
          color: #e4b93d;
          font-size: 25px;
          font-weight: 950;
        }

        /*
         * Force the Pitch component to use the available large
         * content width rather than the old narrow sidebar width.
         */

        .large-pitch-section > div {
          width: 100%;
        }

        /*
         * ======================================================
         * RESPONSIVE
         * ======================================================
         */

        @media (max-width: 1050px) {
          .draft-large-shell {
            grid-template-columns: 1fr;
          }

          .draft-info-area {
            display: grid;
            grid-template-columns:
              minmax(0, 1fr)
              minmax(240px, 320px);
            gap: 12px;
            align-items: start;
          }

          .draft-info-area .stats-bar {
            grid-column: 1 / -1;
          }

          .draft-info-area .captain-chip,
          .draft-info-area .manager-chip,
          .draft-info-area .error {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 760px) {
          .draft-large-shell {
            width: calc(100% - 16px);
            padding-top: 18px;
          }

          .large-pitch-section {
            padding: 9px;
            border-radius: 14px;
          }

          .large-pitch-header {
            padding: 3px 4px;
          }

          .large-pitch-header h2 {
            font-size: 19px;
          }

          .large-pitch-header > strong {
            font-size: 21px;
          }

          .draft-info-area {
            display: flex;
            flex-direction: column;
          }
        }
      `}</style>

    </div>
  );
}


/*
 * ==========================================================
 * FINAL RESULT SCREEN
 * ==========================================================
 */

function DraftResultScreen({
  d,
  onExit,
}) {
  const players = useMemo(() => {
    return Object.values(
      d.placed || {}
    ).filter(Boolean);
  }, [d.placed]);

  const sortedPlayers = useMemo(() => {
    return [...players].sort(
      (a, b) =>
        Number(b.ovr ?? b.base ?? 0) -
        Number(a.ovr ?? a.base ?? 0)
    );
  }, [players]);

  const topPlayers =
    sortedPlayers.slice(0, 3);

  const averageByPosition = (
    keywords
  ) => {
    const group = players.filter(
      (player) => {
        const positions =
          player.positions || [];

        return positions.some(
          (position) =>
            keywords.includes(
              position
            )
        );
      }
    );

    if (!group.length) {
      return "--";
    }

    const total =
      group.reduce(
        (sum, player) =>
          sum +
          Number(
            player.ovr ??
              player.base ??
              0
          ),
        0
      );

    return Math.round(
      total / group.length
    );
  };

  const attackRating =
    averageByPosition([
      "ST",
      "CF",
      "LW",
      "RW",
    ]);

  const midfieldRating =
    averageByPosition([
      "CAM",
      "CM",
      "CDM",
      "LM",
      "RM",
    ]);

  const defenceRating =
    averageByPosition([
      "LB",
      "LWB",
      "CB",
      "RB",
      "RWB",
    ]);

  const goalkeeperRating =
    averageByPosition([
      "GK",
    ]);

  const groups = useMemo(() => {
    const build = (field) => {
      const map = {};

      players.forEach(
        (player) => {
          const value =
            player?.[field];

          if (!value) {
            return;
          }

          if (!map[value]) {
            map[value] = 0;
          }

          map[value]++;
        }
      );

      return Object.entries(map)
        .sort(
          (a, b) => b[1] - a[1]
        )
        .slice(0, 4);
    };

    return {
      nations: build("nation"),
      clubs: build("club"),
      leagues: build("league"),
    };
  }, [players]);

  const squadRating =
    d.teamOVR ||
    (players.length
      ? Math.round(
          players.reduce(
            (sum, player) =>
              sum +
              Number(
                player.ovr ??
                  player.base ??
                  0
              ),
            0
          ) / players.length
        )
      : 0);

  return (
    <div className="xi-result-page">

      <div className="xi-result-background" />

      <header className="xi-result-header">

        <button
          type="button"
          className="xi-result-brand"
          onClick={onExit}
        >
          XI <span>LEGACY</span>
        </button>

        <div className="xi-result-header-title">
          <small>
            XI LEGACY
          </small>

          <strong>
            DRAFT SUMMARY
          </strong>
        </div>

        <div className="xi-result-complete">
          ✓ COMPLETE
        </div>

      </header>

      <main className="xi-result-content">

        <div className="xi-result-title">

          <p className="eyebrow">
            YOUR LEGACY XI
          </p>

          <h1>
            Draft <span>Complete</span>
          </h1>

          <p>
            Your eleven legends are ready for battle.
          </p>

        </div>

        <section className="xi-result-grid">

          <div className="xi-result-left">

            <div className="xi-result-section-label">
              <span>TOP PLAYERS</span>
              <i />
            </div>

            <div className="xi-top-players">

              {topPlayers.map(
                (player, index) => (
                  <div
                    key={player.id}
                    className={
                      `xi-result-player-card ${
                        index === 0
                          ? "featured"
                          : ""
                      }`
                    }
                  >

                    <div className="xi-result-player-number">
                      #{index + 1}
                    </div>

                    <div className="xi-result-player-ovr">
                      {player.ovr ??
                        player.base ??
                        "--"}
                    </div>

                    <div className="xi-result-player-info">

                      <strong>
                        {player.name}
                      </strong>

                      <span>
                        {player.primaryPosition ??
                          player.positions?.[0] ??
                          "—"}
                      </span>

                      <small>
                        {player.club}
                      </small>

                    </div>

                    <div className="xi-result-player-meta">
                      <span>
                        🌍 {player.nation}
                      </span>

                      <span>
                        🏆 {player.league}
                      </span>
                    </div>

                  </div>
                )
              )}

            </div>

            <div className="xi-result-section-label">
              <span>POSITION RATINGS</span>
              <i />
            </div>

            <div className="xi-position-ratings">

              <ResultPosition
                label="ATTACK"
                value={attackRating}
                icon="⚔️"
              />

              <ResultPosition
                label="MIDFIELD"
                value={midfieldRating}
                icon="🎯"
              />

              <ResultPosition
                label="DEFENCE"
                value={defenceRating}
                icon="🛡️"
              />

              <ResultPosition
                label="GOALKEEPER"
                value={goalkeeperRating}
                icon="🧤"
              />

            </div>

          </div>

          <div className="xi-result-right">

            <div className="xi-rating-card">

              <div className="xi-rating-card-label">
                SQUAD RATING
              </div>

              <div className="xi-rating-circle">

                <div className="xi-rating-number">
                  {squadRating}
                </div>

                <div className="xi-rating-ovr">
                  OVR
                </div>

              </div>

              <div className="xi-rating-stars">
                ★★★★★
              </div>

              <div className="xi-rating-caption">
                LEGACY XI
              </div>

            </div>

            <div className="xi-chemistry-card">

              <div className="xi-result-card-heading">
                <span>🧪</span>
                TEAM CHEMISTRY
              </div>

              <div className="xi-chemistry-number">
                {d.teamChemistry ?? 0}
                <small>/100</small>
              </div>

              <div className="xi-chemistry-bar">
                <span
                  style={{
                    width:
                      `${Math.min(
                        100,
                        Math.max(
                          0,
                          Number(
                            d.teamChemistry ??
                              0
                          )
                        )
                      )}%`,
                  }}
                />
              </div>

              <p>
                Chemistry generated from
                nations, clubs and leagues.
              </p>

            </div>

            <div className="xi-result-groups">

              <ResultGroup
                title="NATIONS"
                icon="🌍"
                data={groups.nations}
              />

              <ResultGroup
                title="CLUBS"
                icon="⚽"
                data={groups.clubs}
              />

              <ResultGroup
                title="LEAGUES"
                icon="🏆"
                data={groups.leagues}
              />

            </div>

          </div>

        </section>

        <section className="xi-result-xi">

          <div className="xi-result-section-label">
            <span>YOUR XI</span>
            <i />
          </div>

          <div className="xi-result-player-strip">

            {sortedPlayers.map(
              (player) => (
                <div
                  key={player.id}
                  className="xi-result-mini-player"
                >

                  <div className="xi-mini-ovr">
                    {player.ovr ??
                      player.base ??
                      "--"}
                  </div>

                  <div className="xi-mini-position">
                    {player.primaryPosition ??
                      player.positions?.[0] ??
                      "—"}
                  </div>

                  <strong>
                    {player.name}
                  </strong>

                  <small>
                    {player.club}
                  </small>

                  {d.captain?.id ===
                    player.id && (
                    <span className="xi-mini-captain">
                      ★
                    </span>
                  )}

                </div>
              )
            )}

          </div>

        </section>

        <div className="xi-result-actions">

          <button
            type="button"
            className="primary xi-result-draft-again"
            onClick={d.reset}
          >
            DRAFT AGAIN →
          </button>

        </div>

      </main>

      <style>{`
        .xi-result-page {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(
              circle at 50% 10%,
              rgba(34, 119, 255, .14),
              transparent 38%
            ),
            linear-gradient(
              145deg,
              #030711 0%,
              #07101e 48%,
              #03060c 100%
            );
          color: #fff;
          padding-bottom: 60px;
        }

        .xi-result-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .22;
          background-image:
            linear-gradient(
              rgba(255,255,255,.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.025) 1px,
              transparent 1px
            );
          background-size: 42px 42px;
        }

        .xi-result-header {
          position: relative;
          z-index: 2;
          min-height: 70px;
          padding: 12px 28px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 20px;
          border-bottom: 1px solid rgba(255,255,255,.08);
          background: rgba(3,7,14,.88);
          backdrop-filter: blur(12px);
        }

        .xi-result-brand {
          justify-self: start;
          border: 0;
          background: transparent;
          color: #fff;
          font-size: 18px;
          font-weight: 950;
          cursor: pointer;
          letter-spacing: .08em;
        }

        .xi-result-brand span {
          color: #e4b93d;
        }

        .xi-result-header-title {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .xi-result-header-title small {
          color: #71839a;
          font-size: 8px;
          letter-spacing: .2em;
          font-weight: 800;
        }

        .xi-result-header-title strong {
          color: #f3f6fa;
          font-size: 15px;
          letter-spacing: .12em;
        }

        .xi-result-complete {
          justify-self: end;
          color: #43e58b;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: .08em;
        }

        .xi-result-content {
          position: relative;
          z-index: 1;
          width: min(1320px, calc(100% - 40px));
          margin: 0 auto;
          padding-top: 34px;
        }

        .xi-result-title {
          text-align: center;
          margin-bottom: 28px;
        }

        .xi-result-title h1 {
          margin: 5px 0;
          font-size: clamp(30px, 5vw, 52px);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -.03em;
        }

        .xi-result-title h1 span {
          color: #e5ba45;
        }

        .xi-result-title p:last-child {
          color: #8e9daf;
          font-size: 13px;
        }

        .xi-result-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.45fr)
            minmax(310px, .75fr);
          gap: 20px;
          align-items: start;
        }

        .xi-result-left,
        .xi-result-right {
          min-width: 0;
        }

        .xi-result-section-label {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 10px;
          color: #a9b6c6;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .14em;
        }

        .xi-result-section-label i {
          height: 1px;
          flex: 1;
          background:
            linear-gradient(
              90deg,
              rgba(228,185,61,.5),
              transparent
            );
        }

        .xi-top-players {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 22px;
        }

        .xi-result-player-card {
          position: relative;
          min-height: 180px;
          padding: 15px;
          overflow: hidden;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,.1);
          background:
            linear-gradient(
              145deg,
              rgba(22,39,65,.98),
              rgba(7,13,24,.98)
            );
          box-shadow:
            0 14px 30px rgba(0,0,0,.22);
        }

        .xi-result-player-card.featured {
          border-color:
            rgba(228,185,61,.55);
          background:
            linear-gradient(
              145deg,
              rgba(67,54,25,.95),
              rgba(12,19,29,.99)
            );
        }

        .xi-result-player-number {
          position: absolute;
          top: 10px;
          right: 12px;
          color: #65748a;
          font-size: 9px;
          font-weight: 800;
        }

        .xi-result-player-ovr {
          font-size: 42px;
          line-height: 1;
          font-weight: 950;
          color: #e9bf4d;
        }

        .xi-result-player-info {
          margin-top: 22px;
          display: flex;
          flex-direction: column;
        }

        .xi-result-player-info strong {
          color: #fff;
          font-size: 16px;
          font-weight: 900;
        }

        .xi-result-player-info span {
          color: #48adff;
          font-size: 10px;
          font-weight: 850;
          margin-top: 4px;
        }

        .xi-result-player-info small {
          color: #8190a3;
          margin-top: 4px;
          font-size: 9px;
        }

        .xi-result-player-meta {
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-top: 15px;
          color: #9caabc;
          font-size: 9px;
        }

        .xi-position-ratings {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0,1fr));
          gap: 8px;
        }

        .xi-position-rating {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px;
          border-radius: 11px;
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.025);
        }

        .xi-position-rating-icon {
          font-size: 18px;
        }

        .xi-position-rating-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .xi-position-rating-info small {
          color: #68798e;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .1em;
        }

        .xi-position-rating-info strong {
          color: #fff;
          font-size: 17px;
          font-weight: 950;
        }

        .xi-rating-card,
        .xi-chemistry-card,
        .xi-result-groups {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.08);
          background:
            linear-gradient(
              145deg,
              rgba(13,25,43,.97),
              rgba(5,10,19,.98)
            );
          box-shadow:
            0 15px 35px rgba(0,0,0,.22);
        }

        .xi-rating-card {
          padding: 20px;
          text-align: center;
        }

        .xi-rating-card-label {
          color: #8d9caf;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .15em;
        }

        .xi-rating-circle {
          width: 138px;
          height: 138px;
          margin: 16px auto 10px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border:
            4px solid #e4b93d;
          box-shadow:
            0 0 0 7px rgba(228,185,61,.06),
            0 0 35px rgba(228,185,61,.13);
          background:
            radial-gradient(
              circle,
              rgba(228,185,61,.13),
              rgba(3,8,15,.95) 65%
            );
        }

        .xi-rating-number {
          font-size: 43px;
          line-height: .9;
          font-weight: 950;
        }

        .xi-rating-ovr {
          color: #7f8da1;
          font-size: 9px;
          margin-top: 7px;
          font-weight: 900;
        }

        .xi-rating-stars {
          color: #e4b93d;
          letter-spacing: 3px;
          font-size: 12px;
        }

        .xi-rating-caption {
          margin-top: 7px;
          color: #64748a;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .15em;
        }

        .xi-chemistry-card {
          margin-top: 10px;
          padding: 15px;
        }

        .xi-result-card-heading {
          color: #a9b6c6;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .xi-result-card-heading span {
          margin-right: 7px;
        }

        .xi-chemistry-number {
          margin-top: 8px;
          color: #40df87;
          font-size: 32px;
          font-weight: 950;
        }

        .xi-chemistry-number small {
          color: #63738a;
          font-size: 11px;
          margin-left: 2px;
        }

        .xi-chemistry-bar {
          height: 6px;
          margin-top: 7px;
          overflow: hidden;
          border-radius: 10px;
          background: rgba(255,255,255,.08);
        }

        .xi-chemistry-bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #1fbf6c,
              #7be7a8
            );
        }

        .xi-chemistry-card p {
          margin: 8px 0 0;
          color: #68798d;
          font-size: 9px;
          line-height: 1.4;
        }

        .xi-result-groups {
          margin-top: 10px;
          padding: 6px;
        }

        .xi-result-group {
          padding: 10px;
          border-bottom:
            1px solid rgba(255,255,255,.06);
        }

        .xi-result-group:last-child {
          border-bottom: 0;
        }

        .xi-result-group-title {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #8e9daf;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .xi-result-group-items {
          margin-top: 7px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .xi-result-group-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: #dbe3ec;
          font-size: 10px;
        }

        .xi-result-group-row span:last-child {
          color: #42a9ff;
          font-weight: 900;
        }

        .xi-result-xi {
          margin-top: 24px;
        }

        .xi-result-player-strip {
          display: grid;
          grid-template-columns:
            repeat(11, minmax(75px, 1fr));
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 6px;
        }

        .xi-result-mini-player {
          position: relative;
          min-width: 75px;
          min-height: 102px;
          padding: 8px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,.08);
          background:
            linear-gradient(
              145deg,
              #17263c,
              #09111e
            );
        }

        .xi-mini-ovr {
          color: #e6bc48;
          font-size: 20px;
          line-height: 1;
          font-weight: 950;
        }

        .xi-mini-position {
          color: #48aaff;
          font-size: 8px;
          font-weight: 900;
          margin-top: 3px;
        }

        .xi-result-mini-player strong {
          display: block;
          margin-top: 10px;
          color: #edf2f8;
          font-size: 9px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .xi-result-mini-player small {
          display: block;
          margin-top: 3px;
          color: #6f8095;
          font-size: 7px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .xi-mini-captain {
          position: absolute;
          top: 6px;
          right: 7px;
          color: #e4b93d;
          font-size: 10px;
        }

        .xi-result-actions {
          display: flex;
          justify-content: center;
          margin-top: 28px;
        }

        .xi-result-draft-again {
          min-width: 190px;
        }

        @media (max-width: 950px) {
          .xi-result-grid {
            grid-template-columns: 1fr;
          }

          .xi-result-right {
            display: grid;
            grid-template-columns:
              minmax(220px, .8fr)
              minmax(250px, 1fr);
            gap: 10px;
          }

          .xi-result-groups {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 700px) {
          .xi-result-header {
            grid-template-columns: 1fr auto;
            padding: 10px 14px;
          }

          .xi-result-header-title {
            display: none;
          }

          .xi-result-content {
            width: calc(100% - 20px);
            padding-top: 24px;
          }

          .xi-top-players {
            grid-template-columns: 1fr;
          }

          .xi-result-player-card {
            min-height: 145px;
          }

          .xi-position-ratings {
            grid-template-columns:
              repeat(2, minmax(0,1fr));
          }

          .xi-result-right {
            display: flex;
            flex-direction: column;
          }

          .xi-rating-card {
            padding: 18px;
          }

          .xi-rating-circle {
            width: 118px;
            height: 118px;
          }

          .xi-rating-number {
            font-size: 37px;
          }
        }

        @media (max-width: 420px) {
          .xi-result-title h1 {
            font-size: 31px;
          }

          .xi-result-title p:last-child {
            font-size: 11px;
          }

          .xi-position-ratings {
            grid-template-columns: 1fr 1fr;
          }

          .xi-position-rating {
            padding: 9px;
          }

          .xi-position-rating-info strong {
            font-size: 15px;
          }

          .xi-result-player-card {
            min-height: 135px;
          }

          .xi-result-player-ovr {
            font-size: 35px;
          }
        }
      `}</style>

    </div>
  );
}


/*
 * ==========================================================
 * RESULT POSITION
 * ==========================================================
 */

function ResultPosition({
  label,
  value,
  icon,
}) {
  return (
    <div className="xi-position-rating">

      <div className="xi-position-rating-icon">
        {icon}
      </div>

      <div className="xi-position-rating-info">

        <small>{label}</small>

        <strong>{value}</strong>

      </div>

    </div>
  );
}


/*
 * ==========================================================
 * RESULT GROUP
 * ==========================================================
 */

function ResultGroup({
  title,
  icon,
  data,
}) {
  return (
    <div className="xi-result-group">

      <div className="xi-result-group-title">
        <span>{icon}</span>
        {title}
      </div>

      <div className="xi-result-group-items">

        {data.length === 0 && (
          <div className="xi-result-group-row">
            <span>—</span>
            <span>0</span>
          </div>
        )}

        {data.map(
          ([name, count]) => (
            <div
              key={name}
              className="xi-result-group-row"
            >
              <span>{name}</span>
              <span>{count}</span>
            </div>
          )
        )}

      </div>

    </div>
  );
}


/*
 * ==========================================================
 * DRAFT SQUAD PANEL
 * ==========================================================
 */

function DraftSquadPanel({ d }) {
  const players = useMemo(() => {
    return Object.values(
      d.placed || {}
    ).filter(Boolean);
  }, [d.placed]);

  const categoryData = useMemo(() => {

    const buildCategory = (
      field,
      icon
    ) => {

      const map = {};

      players.forEach(
        (player) => {

          const value =
            player?.[field];

          if (!value) {
            return;
          }

          if (!map[value]) {
            map[value] = [];
          }

          map[value].push(player);
        }
      );

      return Object.entries(map)
        .map(
          ([name, members]) => ({
            name,
            members,
            icon,
          })
        )
        .sort(
          (a, b) =>
            b.members.length -
            a.members.length
        );
    };

    return {
      nations:
        buildCategory(
          "nation",
          "🌍"
        ),

      clubs:
        buildCategory(
          "club",
          "⚽"
        ),

      leagues:
        buildCategory(
          "league",
          "🏆"
        ),
    };
  }, [players]);

  const nationLinks =
    categoryData.nations.reduce(
      (total, item) =>
        total +
        chemistryCount(
          item.members.length
        ),
      0
    );

  const clubLinks =
    categoryData.clubs.reduce(
      (total, item) =>
        total +
        chemistryCount(
          item.members.length
        ),
      0
    );

  const leagueLinks =
    categoryData.leagues.reduce(
      (total, item) =>
        total +
        chemistryCount(
          item.members.length
        ),
      0
    );

  if (players.length === 0) {
    return (
      <div className="draft-squad-panel">

        <SquadPanelHeader
          rating="--"
          chemistry={0}
        />

        <div className="draft-squad-empty">
          Draft players to build your
          <br />
          Legacy Squad chemistry.
        </div>

      </div>
    );
  }

  const rows = [
    ...categoryData.clubs,
    ...categoryData.leagues,
    ...categoryData.nations,
  ];

  return (
    <div className="draft-squad-panel">

      <SquadPanelHeader
        rating={
          d.teamOVR || "--"
        }
        chemistry={
          d.teamChemistry ?? 0
        }
      />

      <div className="draft-squad-summary">

        <MiniChemStat
          icon="🌍"
          label="NATION"
          value={nationLinks}
        />

        <MiniChemStat
          icon="⚽"
          label="CLUB"
          value={clubLinks}
        />

        <MiniChemStat
          icon="🏆"
          label="LEAGUE"
          value={leagueLinks}
        />

      </div>

      <div className="draft-squad-list">

        {rows.map(
          (item, index) => {

            const chemistry =
              chemistryCount(
                item.members.length
              );

            return (
              <div
                key={`${item.name}-${index}`}
                className="draft-squad-row"
              >

                <div className="draft-squad-row-icon">
                  {item.icon}
                </div>

                <div className="draft-squad-row-content">

                  <div className="draft-squad-row-name">
                    {item.name}
                  </div>

                  <div className="draft-squad-player-dots">

                    {item.members
                      .slice(0, 5)
                      .map(
                        (player) => (
                          <span
                            key={player.id}
                            className="draft-squad-player-dot"
                            title={player.name}
                          />
                        )
                      )}

                  </div>

                </div>

                <div className="draft-squad-chemistry">
                  +{chemistry}
                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}


/*
 * ==========================================================
 * SQUAD HEADER
 * ==========================================================
 */

function SquadPanelHeader({
  rating,
  chemistry,
}) {
  const chemistryClass =
    chemistry >= 70
      ? "high"
      : chemistry >= 40
        ? "medium"
        : "low";

  return (
    <div className="draft-squad-header">

      <div className="draft-squad-header-main">

        <div>

          <div className="draft-squad-title">
            DRAFT SQUAD
          </div>

          <div className="draft-squad-stars">
            ★★★★★
          </div>

          <div className="draft-squad-rating-label">
            Squad Rating
          </div>

        </div>

        <div className="draft-squad-rating">

          <div>
            {rating}
          </div>

          <small>OVR</small>

        </div>

      </div>

      <div className="draft-squad-total">

        <span>
          Total Chemistry
        </span>

        <strong
          className={
            chemistryClass
          }
        >
          {chemistry}
          <span>/100</span>
        </strong>

      </div>

    </div>
  );
}


/*
 * ==========================================================
 * MINI CHEMISTRY
 * ==========================================================
 */

function MiniChemStat({
  icon,
  label,
  value,
}) {
  return (
    <div className="draft-squad-summary-item">

      <div className="draft-squad-summary-icon">
        {icon}
      </div>

      <div className="draft-squad-summary-label">
        {label}
      </div>

      <strong className="draft-squad-summary-value">
        +{value}
      </strong>

    </div>
  );
}


/*
 * ==========================================================
 * CHEMISTRY COUNT
 * ==========================================================
 */

function chemistryCount(
  playerCount
) {
  if (playerCount < 2) {
    return 0;
  }

  return (
    playerCount *
    (playerCount - 1)
  ) / 2;
}


/*
 * ==========================================================
 * HEADER
 * ==========================================================
 */

function Header({
  d,
  onExit,
}) {
  return (
    <header className="top">

      <button
        type="button"
        className="brand-button"
        onClick={onExit}
      >
        XI <span>LEGACY</span>
      </button>

      <div className="top-meta">

        <span>
          {d.formation?.name ??
            "DRAFT"}
        </span>

        <span>
          {d.style ??
            "Balanced"}
        </span>

      </div>

    </header>
  );
}