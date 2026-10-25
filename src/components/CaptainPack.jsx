export default function CaptainPack({
  players = [],
  onComplete,
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#08070f",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
        XI LEGACY
      </h1>

      <h2 style={{ color: "#a866ff" }}>
        CAPTAIN PACK
      </h2>

      <p style={{ color: "#aaa" }}>
        Your captain candidates are ready.
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "35px 0",
        }}
      >
        {players.map((player) => (
          <div
            key={player.id}
            style={{
              width: "180px",
              padding: "25px",
              borderRadius: "20px",
              border: "2px solid #a866ff",
              background:
                "linear-gradient(145deg, #24183c, #0c0914)",
              boxShadow:
                "0 0 25px rgba(150,80,255,.25)",
            }}
          >
            <div
              style={{
                fontSize: "55px",
                fontWeight: "900",
              }}
            >
              {player.base}
            </div>

            <small>OVR</small>

            <h3>{player.name}</h3>

            <p>{player.positions?.join(" · ")}</p>

            <p>{player.nation}</p>

            <p>{player.club}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        style={{
          padding: "15px 30px",
          border: "none",
          borderRadius: "12px",
          background:
            "linear-gradient(135deg, #7e35ff, #b06cff)",
          color: "white",
          fontWeight: "900",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        CHOOSE YOUR CAPTAIN →
      </button>
    </div>
  );
}