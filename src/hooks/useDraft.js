import { useCallback, useMemo, useState } from "react";
import { FORMATIONS } from "../data/formations";
import { MANAGERS } from "../data/managers";
import { players } from "../data/players";

/*
 * ============================================================
 * XI LEGACY - DRAFT ENGINE
 * ============================================================
 *
 * Draft flow:
 *
 * Formation
 *    ↓
 * Lineup Preview
 *    ↓
 * Captain Opening
 *    ↓
 * Captain Selection
 *    ↓
 * Manager
 *    ↓
 * Lineup Draft
 *    ↓
 * Click position pack
 *    ↓
 * Generate 5 players for that position
 *    ↓
 * Pack opening
 *    ↓
 * Player selection
 *    ↓
 * Confirm player
 *    ↓
 * Player automatically goes into clicked position
 *
 * ============================================================
 */


/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

const sample = (arr, n) =>
  [...arr]
    .sort(() => Math.random() - 0.5)
    .slice(0, n);


const allSeasons = () =>
  [
    ...new Set(
      players.flatMap((player) =>
        Object.keys(player.seasons || {})
      )
    ),
  ];


const ovrFor = (player, season) =>
  player.seasons?.[season]?.ovr ??
  player.base ??
  80;


/*
 * ============================================================
 * CHEMISTRY CONSTANTS
 * ============================================================
 */

const CHEMISTRY_VALUES = {
  club: 3,
  nation: 2,
  league: 1,
};

const MAX_PLAYER_CHEMISTRY = 10;


/*
 * ============================================================
 * POSITION / TACTICAL STYLE SYSTEM
 * ============================================================
 */

const STYLE_POSITION_MAP = {
  "433": {
    Defensive: {
      CM1: ["CM"],
      CM2: ["CDM"],
      CM3: ["CM"],
    },

    Balanced: {
      CM1: ["CM"],
      CM2: ["CM"],
      CM3: ["CM"],
    },

    Attacking: {
      CM1: ["CAM"],
      CM2: ["CM"],
      CM3: ["CAM"],
    },
  },

  "442": {
    Defensive: {
      LM: ["LM", "LW"],
      CM1: ["CDM", "CM"],
      CM2: ["CDM", "CM"],
      RM: ["RM", "RW"],
    },

    Balanced: {
      LM: ["LM", "LW"],
      CM1: ["CM"],
      CM2: ["CM"],
      RM: ["RM", "RW"],
    },

    Attacking: {
      LM: ["LW", "LM"],
      CM1: ["CM"],
      CM2: ["CAM", "CM"],
      RM: ["RW", "RM"],
    },
  },

  "4231": {
    Defensive: {
      CDM1: ["CDM"],
      CDM2: ["CDM"],
      CAM1: ["LM", "LW"],
      CAM2: ["CAM", "CM"],
      CAM3: ["RM", "RW"],
    },

    Balanced: {
      CDM1: ["CDM"],
      CDM2: ["CDM"],
      CAM1: ["LW", "LM"],
      CAM2: ["CAM"],
      CAM3: ["RW", "RM"],
    },

    Attacking: {
      CDM1: ["CM", "CDM"],
      CDM2: ["CM", "CDM"],
      CAM1: ["LW", "LM"],
      CAM2: ["CAM", "ST"],
      CAM3: ["RW", "RM"],
    },
  },

  "352": {
    Defensive: {
      LM: ["LM", "LWB", "LB"],
      CM1: ["CM"],
      CDM: ["CDM"],
      CM2: ["CM"],
      RM: ["RM", "RWB", "RB"],
    },

    Balanced: {
      LM: ["LM", "LWB", "LB"],
      CM1: ["CM"],
      CDM: ["CDM", "CM"],
      CM2: ["CM"],
      RM: ["RM", "RWB", "RB"],
    },

    Attacking: {
      LM: ["LM", "LW", "LWB"],
      CM1: ["CM"],
      CDM: ["CM", "CAM", "CDM"],
      CM2: ["CM"],
      RM: ["RM", "RW", "RWB"],
    },
  },

  "41212": {
    Defensive: {
      CDM: ["CDM"],
      CM1: ["CM", "CDM"],
      CM2: ["CM", "CDM"],
      CAM: ["CAM", "CM"],
    },

    Balanced: {
      CDM: ["CDM"],
      CM1: ["CM"],
      CM2: ["CM"],
      CAM: ["CAM"],
    },

    Attacking: {
      CDM: ["CDM", "CM"],
      CM1: ["CM"],
      CM2: ["CM"],
      CAM: ["CAM", "ST"],
    },
  },

  "4321": {
    Defensive: {
      CM1: ["CDM", "CM"],
      CM2: ["CM"],
      CM3: ["CDM", "CM"],
      LF: ["LW", "LM", "LF"],
      RF: ["RW", "RM", "RF"],
    },

    Balanced: {
      CM1: ["CM"],
      CM2: ["CM"],
      CM3: ["CM"],
      LF: ["LW", "LF"],
      RF: ["RW", "RF"],
    },

    Attacking: {
      CM1: ["CM"],
      CM2: ["CAM", "CM"],
      CM3: ["CM"],
      LF: ["LW", "LF", "ST"],
      RF: ["RW", "RF", "ST"],
    },
  },
};


/*
 * ============================================================
 * STYLE NORMALIZER
 * ============================================================
 */

const normalizeStyle = (value) => {
  if (!value) {
    return "Balanced";
  }

  const text = String(value).toLowerCase();

  if (text === "defensive") {
    return "Defensive";
  }

  if (text === "attacking") {
    return "Attacking";
  }

  return "Balanced";
};


/*
 * ============================================================
 * POSITION HELPERS
 * ============================================================
 */

const getBasePosition = (slot) => {
  if (!slot) {
    return "";
  }

  return slot.replace(/[0-9]/g, "");
};


/*
 * Check whether player can play any position
 * required by a formation slot.
 */
const playerCanPlayPositions = (
  player,
  positions
) => {
  if (
    !player ||
    !Array.isArray(player.positions)
  ) {
    return false;
  }

  return player.positions.some(
    (position) =>
      positions.includes(position)
  );
};


/*
 * Get all possible positions required
 * by the formation.
 */
const getFormationRequirements = (
  formation,
  style
) => {
  if (!formation) {
    return [];
  }

  const normalizedStyle =
    normalizeStyle(style);

  const formationMap =
    STYLE_POSITION_MAP[
      formation.id
    ];

  return formation.slots.map(
    (slot) => {

      const styleMap =
        formationMap?.[
          normalizedStyle
        ];

      const positions =
        styleMap?.[slot];

      return {
        slot,

        positions:
          positions?.length
            ? positions
            : [
                getBasePosition(
                  slot
                ),
              ],
      };
    }
  );
};


/*
 * ============================================================
 * FORMATION-AWARE CAPTAIN POOL
 * ============================================================
 *
 * The captain pool is no longer completely random.
 *
 * Example:
 *
 * 3-5-2
 *
 * ST / ST / LM / CM / CDM / CM / RM /
 * CB / CB / CB / GK
 *
 * Captain candidates must be able to fit
 * at least one of those required positions.
 *
 * We also try to provide positional variety.
 * ============================================================
 */

const buildCaptainPool = (
  formation,
  style
) => {
  if (!formation) {
    return [];
  }

  const requirements =
    getFormationRequirements(
      formation,
      style
    );

  const result = [];
  const usedPlayers = new Set();

  /*
   * First try to find candidates from
   * different important positions.
   */
  const priorityPositions = [
    "ST",
    "CF",
    "CAM",
    "CM",
    "CDM",
    "LW",
    "RW",
    "LM",
    "RM",
    "CB",
    "LB",
    "RB",
    "GK",
  ];

  for (
    const position of priorityPositions
  ) {

    if (result.length >= 5) {
      break;
    }

    const matchingSlots =
      requirements.filter(
        (requirement) =>
          requirement.positions.includes(
            position
          )
      );

    if (
      matchingSlots.length === 0
    ) {
      continue;
    }

    const pool =
      players.filter(
        (player) =>
          !usedPlayers.has(
            player.id
          ) &&
          (player.base ?? 0) >= 85 &&
          playerCanPlayPositions(
            player,
            [position]
          )
      );

    if (!pool.length) {
      continue;
    }

    const candidate =
      sample(pool, 1)[0];

    if (candidate) {
      result.push({
        ...candidate,
        captainEligiblePosition:
          position,
      });

      usedPlayers.add(
        candidate.id
      );
    }
  }

  /*
   * Fill any remaining captain slots
   * from the entire formation-compatible pool.
   */
  if (result.length < 5) {

    const compatiblePool =
      players.filter(
        (player) =>
          !usedPlayers.has(
            player.id
          ) &&
          (player.base ?? 0) >= 85 &&
          requirements.some(
            (requirement) =>
              playerCanPlayPositions(
                player,
                requirement.positions
              )
          )
      );

    const extra =
      sample(
        compatiblePool,
        5 - result.length
      );

    extra.forEach(
      (player) => {

        result.push({
          ...player,
          captainEligiblePosition:
            player.positions?.[0] ??
            null,
        });

        usedPlayers.add(
          player.id
        );
      }
    );
  }

  /*
   * Final safety:
   * every captain must fit the formation.
   */
  return result
    .filter(
      (player) =>
        requirements.some(
          (requirement) =>
            playerCanPlayPositions(
              player,
              requirement.positions
            )
        )
    )
    .slice(0, 5);
};


/*
 * ============================================================
 * CHEMISTRY HELPERS
 * ============================================================
 */

const managerMatchesPlayer = (
  manager,
  player
) => {

  if (!manager || !player) {
    return {
      club: false,
      nation: false,
      league: false,
    };
  }

  const managerClub =
    manager.club ??
    manager.team ??
    manager.clubName ??
    null;

  const managerNation =
    manager.nation ??
    manager.country ??
    manager.nationality ??
    null;

  const managerLeague =
    manager.league ??
    manager.competition ??
    null;

  return {
    club:
      Boolean(managerClub) &&
      Boolean(player.club) &&
      managerClub === player.club,

    nation:
      Boolean(managerNation) &&
      Boolean(player.nation) &&
      managerNation === player.nation,

    league:
      Boolean(managerLeague) &&
      Boolean(player.league) &&
      managerLeague === player.league,
  };
};


const chemistryBetweenPlayers = (
  playerA,
  playerB
) => {

  if (
    !playerA ||
    !playerB ||
    playerA.id === playerB.id
  ) {
    return {
      chemistry: 0,
      reasons: [],
    };
  }

  let chemistry = 0;
  const reasons = [];

  if (
    playerA.club &&
    playerB.club &&
    playerA.club === playerB.club
  ) {
    chemistry += CHEMISTRY_VALUES.club;
    reasons.push("club");
  }

  if (
    playerA.nation &&
    playerB.nation &&
    playerA.nation === playerB.nation
  ) {
    chemistry += CHEMISTRY_VALUES.nation;
    reasons.push("nation");
  }

  if (
    playerA.league &&
    playerB.league &&
    playerA.league === playerB.league
  ) {
    chemistry += CHEMISTRY_VALUES.league;
    reasons.push("league");
  }

  return {
    chemistry,
    reasons,
  };
};


const calculatePlayerChemistry = (
  occupiedPlayers,
  managerValue
) => {

  const chemistry = {};

  for (
    const player of occupiedPlayers
  ) {

    let total = 0;

    for (
      const other of occupiedPlayers
    ) {

      if (
        player.id === other.id
      ) {
        continue;
      }

      const connection =
        chemistryBetweenPlayers(
          player,
          other
        );

      total += connection.chemistry;
    }

    const managerMatch =
      managerMatchesPlayer(
        managerValue,
        player
      );

    if (managerMatch.club) {
      total += CHEMISTRY_VALUES.club;
    } else if (
      managerMatch.nation
    ) {
      total += CHEMISTRY_VALUES.nation;
    } else if (
      managerMatch.league
    ) {
      total += CHEMISTRY_VALUES.league;
    }

    chemistry[player.id] =
      Math.min(
        MAX_PLAYER_CHEMISTRY,
        total
      );
  }

  return chemistry;
};


const calculateTeamChemistry = (
  occupiedPlayers,
  managerValue
) => {

  if (
    occupiedPlayers.length === 0
  ) {
    return 0;
  }

  const chemistry =
    calculatePlayerChemistry(
      occupiedPlayers,
      managerValue
    );

  const total =
    occupiedPlayers.reduce(
      (sum, player) =>
        sum +
        (
          chemistry[player.id] ??
          0
        ),
      0
    );

  return Math.round(
    total /
      occupiedPlayers.length
  );
};


const calculateChemistryLinks = (
  occupiedPlayers
) => {

  const links = [];

  for (
    let i = 0;
    i < occupiedPlayers.length;
    i += 1
  ) {

    for (
      let j = i + 1;
      j < occupiedPlayers.length;
      j += 1
    ) {

      const playerA =
        occupiedPlayers[i];

      const playerB =
        occupiedPlayers[j];

      const connection =
        chemistryBetweenPlayers(
          playerA,
          playerB
        );

      if (
        connection.chemistry > 0
      ) {

        links.push({
          from:
            playerA.id,

          to:
            playerB.id,

          chemistry:
            connection.chemistry,

          reasons:
            connection.reasons,
        });
      }
    }
  }

  return links;
};


const chemistryLevel = (
  value
) => {

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
};


/*
 * ============================================================
 * MAIN HOOK
 * ============================================================
 */

export default function useDraft(
  difficulty = "normal"
) {

  /*
   * ----------------------------------------------------------
   * BASIC STATE
   * ----------------------------------------------------------
   */

  const [stage, setStage] =
    useState("formation");

  const [formation, setFormation] =
    useState(null);

  const [captain, setCaptain] =
    useState(null);

  const [manager, setManager] =
    useState(null);

  const [placed, setPlaced] =
    useState({});

  const [round, setRound] =
    useState(0);

  const [pack, setPack] =
    useState([]);

  const [season, setSeason] =
    useState(null);

  const [roundType, setRoundType] =
    useState("STANDARD");

  const [opening, setOpening] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState(null);

  const [pickLocked, setPickLocked] =
    useState(false);

  const [activePackSlot, setActivePackSlot] =
    useState(null);

  const [style, setStyleState] =
    useState("Balanced");

  const [rerolls, setRerolls] =
    useState({
      era:
        difficulty === "easy"
          ? 5
          : difficulty === "hard"
          ? 1
          : 3,

      club:
        difficulty === "easy"
          ? 5
          : difficulty === "hard"
          ? 1
          : 3,

      pack:
        difficulty === "easy"
          ? 5
          : difficulty === "hard"
          ? 1
          : 3,
    });

  const [message, setMessage] =
    useState("");


  /*
   * ----------------------------------------------------------
   * FORMATION / CAPTAIN / MANAGER CHOICES
   * ----------------------------------------------------------
   */

  const formationChoices =
    useMemo(
      () => sample(FORMATIONS, 5),
      []
    );


  /*
   * Captain choices now depend on
   * the selected formation.
   */
  const captainChoices =
    useMemo(
      () =>
        buildCaptainPool(
          formation,
          style
        ),
      [
        formation,
        style,
      ]
    );


  const managerChoices =
    useMemo(
      () => sample(MANAGERS, 5),
      []);


  /*
   * ----------------------------------------------------------
   * OCCUPIED PLAYERS
   * ----------------------------------------------------------
   */

  const occupied =
    Object.values(placed).filter(
      Boolean
    );


  /*
   * ----------------------------------------------------------
   * POSITION HELPERS
   * ----------------------------------------------------------
   */

  const getBasePositionForSlot =
    useCallback(
      (slot) =>
        getBasePosition(slot),
      []
    );


  const getAllowedPositionsForSlot =
    useCallback(
      (
        slot,
        formationValue = formation,
        styleValue = style
      ) => {

        if (
          !slot ||
          !formationValue
        ) {
          return [];
        }

        const normalizedStyle =
          normalizeStyle(
            styleValue
          );

        const formationMap =
          STYLE_POSITION_MAP[
            formationValue.id
          ];

        const styleMap =
          formationMap?.[
            normalizedStyle
          ];

        const customPositions =
          styleMap?.[slot];

        if (
          customPositions &&
          customPositions.length
        ) {
          return customPositions;
        }

        return [
          getBasePosition(slot),
        ];
      },
      [
        formation,
        style,
      ]
    );


  const canPlayerPlaySlot =
    useCallback(
      (
        player,
        slot,
        formationValue = formation,
        styleValue = style
      ) => {

        if (
          !player ||
          !slot ||
          !formationValue
        ) {
          return false;
        }

        const allowedPositions =
          getAllowedPositionsForSlot(
            slot,
            formationValue,
            styleValue
          );

        return player.positions?.some(
          (position) =>
            allowedPositions.includes(
              position
            )
        );
      },
      [
        formation,
        style,
        getAllowedPositionsForSlot,
      ]
    );


  /*
   * ----------------------------------------------------------
   * STYLE
   * ----------------------------------------------------------
   */

  const setStyle =
    useCallback(
      (newStyle) => {

        const normalized =
          normalizeStyle(
            newStyle
          );

        setStyleState(
          normalized
        );

        setSelectedId(null);
        setMessage("");
      },
      []
    );


  /*
   * ==========================================================
   * FORMATION
   * ==========================================================
   */

  const chooseFormation =
    useCallback(
      (nextFormation) => {

        if (!nextFormation) {
          return;
        }

        setFormation(
          nextFormation
        );

        setCaptain(null);

        setManager(null);

        setPlaced({});

        setRound(0);

        setPack([]);

        setSeason(null);

        setRoundType(
          "STANDARD"
        );

        setSelectedId(null);

        setPickLocked(false);

        setActivePackSlot(null);

        setOpening(false);

        setMessage("");

        /*
         * NEW:
         *
         * Do not immediately open the captain pack.
         *
         * First show the selected formation
         * so the player can understand the
         * positions they need to fill.
         */
        setStage(
          "lineupPreview"
        );
      },
      []
    );


  /*
   * ==========================================================
   * LINEUP PREVIEW → CAPTAIN
   * ==========================================================
   */

  const continueToCaptain =
    useCallback(
      () => {

        if (!formation) {
          return;
        }

        /*
         * Rebuild the captain candidates
         * using the current formation/style.
         */
        setSelectedId(null);

        setPickLocked(false);

        setMessage("");

        setStage(
          "captainOpening"
        );
      },
      [
        formation,
      ]
    );


  /*
   * ==========================================================
   * CAPTAIN SLOT
   * ==========================================================
   */

  const captainSlot =
    useMemo(
      () => {

        if (!captain) {
          return null;
        }

        const existing =
          Object.entries(
            placed
          ).find(
            ([, player]) =>
              player?.id ===
              captain.id
          )?.[0];

        if (existing) {
          return existing;
        }

        if (!formation) {
          return null;
        }

        const possible =
          formation.slots.find(
            (slot) =>
              canPlayerPlaySlot(
                captain,
                slot,
                formation,
                style
              )
          );

        return possible ?? null;
      },
      [
        captain,
        placed,
        formation,
        style,
        canPlayerPlaySlot,
      ]
    );


  /*
   * ==========================================================
   * CAPTAIN
   * ==========================================================
   */

  const startCaptain =
    useCallback(
      (player) => {

        if (
          !formation ||
          !player
        ) {
          return;
        }

        /*
         * HARD SAFETY:
         *
         * The captain must have at least
         * one legal position in this formation.
         */
        const legalSlot =
          formation.slots.find(
            (slot) =>
              canPlayerPlaySlot(
                player,
                slot,
                formation,
                style
              )
          );

        if (!legalSlot) {

          setMessage(
            `${player.name} does not fit this formation.`
          );

          return;
        }

        setCaptain(
          player
        );

        /*
         * Put the captain directly into
         * a compatible formation slot.
         */
        const seasons =
          Object.keys(
            player.seasons || {}
          );

        const firstSeason =
          seasons[0] ??
          "2020";

        setPlaced(
          {
            [legalSlot]: {
              ...player,

              season:
                firstSeason,

              ovr:
                ovrFor(
                  player,
                  firstSeason
                ),

              slot:
                legalSlot,

              draftSlot:
                undefined,
            },
          }
        );

        setSelectedId(null);

        setPickLocked(false);

        setActivePackSlot(null);

        setMessage("");

        /*
         * Captain selected.
         * Next step = manager.
         */
        setStage(
          "managerOpening"
        );
      },
      [
        formation,
        style,
        canPlayerPlaySlot,
      ]
    );


  /*
   * ==========================================================
   * MANAGER
   * ==========================================================
   */

  const startManager =
    useCallback(
      (managerValue) => {

        if (!managerValue) {
          return;
        }

        setManager(
          managerValue
        );

        setRound(0);

        setSelectedId(null);

        setPickLocked(false);

        setActivePackSlot(null);

        setPack([]);

        setOpening(false);

        setMessage("");

        setStage(
          "rounds"
        );
      },
      []
    );


  /*
   * ==========================================================
   * AVAILABLE SLOTS
   * ==========================================================
   */

  const availableSlots =
    formation?.slots.filter(
      (slot) =>
        !placed[slot]
    ) ?? [];


  /*
   * ==========================================================
   * PLAYER POOL
   * ==========================================================
   *
   * IMPORTANT FIX:
   *
   * A player is generated ONLY when they can
   * legally play the selected slot.
   *
   * Therefore Neymar cannot appear in an
   * incompatible position pack.
   * ==========================================================
   */

  const playerPoolForSlot =
    useCallback(
      (
        slot,
        seasonValue,
        typeValue = roundType
      ) => {

        if (
          !slot ||
          !formation
        ) {
          return [];
        }

        const allowedPositions =
          getAllowedPositionsForSlot(
            slot,
            formation,
            style
          );

        if (
          !allowedPositions.length
        ) {
          return [];
        }

        let pool =
          players.filter(
            (player) =>
              Array.isArray(
                player.positions
              ) &&
              player.positions.some(
                (position) =>
                  allowedPositions.includes(
                    position
                  )
              )
          );


        /*
         * ICON round.
         */
        if (
          typeValue === "ICON"
        ) {

          const iconPool =
            pool.filter(
              (player) =>
                player.isIcon
            );

          if (
            iconPool.length
          ) {
            pool = iconPool;
          }
        }


        /*
         * Remove players already in XI.
         */
        const occupiedIds =
          new Set(
            occupied.map(
              (player) =>
                player.id
            )
          );

        const available =
          pool.filter(
            (player) =>
              !occupiedIds.has(
                player.id
              )
          );

        if (
          !available.length
        ) {
          return [];
        }


        /*
         * Shuffle.
         */
        const shuffled =
          [...available].sort(
            () =>
              Math.random() - 0.5
          );


        /*
         * Prefer different clubs.
         */
        const selected = [];

        const usedClubs =
          new Set();

        const usedPlayers =
          new Set();


        for (
          const player of shuffled
        ) {

          if (
            selected.length >= 5
          ) {
            break;
          }

          if (
            player.club &&
            usedClubs.has(
              player.club
            )
          ) {
            continue;
          }

          selected.push(
            player
          );

          usedPlayers.add(
            player.id
          );

          if (player.club) {
            usedClubs.add(
              player.club
            );
          }
        }


        /*
         * Fill remaining cards.
         */
        if (
          selected.length < 5
        ) {

          for (
            const player of shuffled
          ) {

            if (
              selected.length >= 5
            ) {
              break;
            }

            if (
              usedPlayers.has(
                player.id
              )
            ) {
              continue;
            }

            selected.push(
              player
            );

            usedPlayers.add(
              player.id
            );
          }
        }


        /*
         * Final safety check.
         *
         * This is important:
         * NEVER return a player that cannot
         * actually play the clicked slot.
         */
        const safeSelection =
          selected.filter(
            (player) =>
              canPlayerPlaySlot(
                player,
                slot,
                formation,
                style
              )
          );


        return safeSelection.map(
          (player) => {

            let playerOVR =
              ovrFor(
                player,
                seasonValue
              );

            if (
              difficulty === "hard"
            ) {
              playerOVR -=
                Math.floor(
                  Math.random() * 4
                );
            }

            playerOVR =
              Math.max(
                60,
                playerOVR
              );

            return {
              ...player,

              season:
                seasonValue,

              ovr:
                playerOVR,

              draftSlot:
                slot,

              allowedPositions:
                allowedPositions,
            };
          }
        );
      },
      [
        formation,
        style,
        roundType,
        occupied,
        difficulty,
        getAllowedPositionsForSlot,
        canPlayerPlaySlot,
      ]
    );


  /*
   * ==========================================================
   * OLD ROUND START
   * ==========================================================
   */

  const beginRound =
    useCallback(
      () => {

        if (
          !formation ||
          !manager
        ) {
          return;
        }

        const slot =
          formation.slots.find(
            (value) =>
              !placed[value]
          );

        if (!slot) {

          setStage(
            "done"
          );

          return;
        }

        const nextRound =
          round + 1;

        const specialRounds = {
          4: "ICON",
          7: "NATION",
          10: "WILDCARD",
        };

        const type =
          specialRounds[
            nextRound
          ] ?? "STANDARD";

        const seasons =
          allSeasons();

        const selectedSeason =
          seasons.length
            ? seasons[
                Math.floor(
                  Math.random() *
                    seasons.length
                )
              ]
            : "2020";

        const playerPack =
          playerPoolForSlot(
            slot,
            selectedSeason,
            type
          );

        if (
          !playerPack.length
        ) {

          setMessage(
            `No players available for ${slot}.`
          );

          return;
        }

        setActivePackSlot(
          slot
        );

        setRound(
          nextRound
        );

        setRoundType(
          type
        );

        setSeason(
          selectedSeason
        );

        setSelectedId(null);

        setPickLocked(false);

        setMessage("");

        setPack(
          playerPack
        );

        setOpening(true);

        setStage(
          "opening"
        );
      },
      [
        formation,
        manager,
        placed,
        round,
        playerPoolForSlot,
      ]
    );


  /*
   * ==========================================================
   * OPEN POSITION PACK
   * ==========================================================
   */

  const openPositionPack =
    useCallback(
      (slot) => {

        if (
          !formation ||
          !manager ||
          !slot
        ) {
          return;
        }

        if (
          placed[slot]
        ) {
          return;
        }

        const nextRound =
          round + 1;

        const specialRounds = {
          4: "ICON",
          7: "NATION",
          10: "WILDCARD",
        };

        const type =
          specialRounds[
            nextRound
          ] ?? "STANDARD";

        const seasons =
          allSeasons();

        const selectedSeason =
          seasons.length
            ? seasons[
                Math.floor(
                  Math.random() *
                    seasons.length
                )
              ]
            : "2020";

        const playerPack =
          playerPoolForSlot(
            slot,
            selectedSeason,
            type
          );

        if (
          !playerPack.length
        ) {

          setMessage(
            `No players available for ${slot}.`
          );

          return;
        }

        setActivePackSlot(
          slot
        );

        setRound(
          nextRound
        );

        setRoundType(
          type
        );

        setSeason(
          selectedSeason
        );

        setSelectedId(null);

        setPickLocked(false);

        setMessage("");

        setPack(
          playerPack
        );

        setOpening(true);

        setStage(
          "opening"
        );
      },
      [
        formation,
        manager,
        placed,
        round,
        playerPoolForSlot,
      ]
    );


  /*
   * ==========================================================
   * PLAYER SELECTION
   * ==========================================================
   */

  const choosePlayer =
    useCallback(
      (player) => {

        if (!player) {
          return;
        }

        if (opening) {
          return;
        }

        /*
         * Final safety check.
         */
        if (
          activePackSlot &&
          !canPlayerPlaySlot(
            player,
            activePackSlot,
            formation,
            style
          )
        ) {

          setMessage(
            `${player.name} cannot play ${activePackSlot}.`
          );

          return;
        }

        setSelectedId(
          player.id
        );

        setPickLocked(true);

        setMessage("");
      },
      [
        opening,
        activePackSlot,
        formation,
        style,
        canPlayerPlaySlot,
      ]
    );


  /*
   * ==========================================================
   * PLAYER PLACEMENT
   * ==========================================================
   */

  const placePlayer =
    useCallback(
      (
        player,
        slot
      ) => {

        if (
          !player ||
          !slot ||
          !formation
        ) {
          return false;
        }

        if (
          slot === captainSlot
        ) {

          setMessage(
            "Your captain slot is locked."
          );

          return false;
        }

        const canPlay =
          canPlayerPlaySlot(
            player,
            slot,
            formation,
            style
          );

        if (!canPlay) {

          const allowed =
            getAllowedPositionsForSlot(
              slot,
              formation,
              style
            );

          setMessage(
            `${player.name} cannot play ${allowed.join(
              " / "
            )} in ${style} style`
          );

          return false;
        }

        if (
          captain &&
          player.id === captain.id
        ) {

          setMessage(
            "Your captain is already in the team."
          );

          return false;
        }

        setPlaced(
          (previous) => {

            const next = {
              ...previous,
            };

            const sourceSlot =
              player.slot ??
              player.draftSlot ??
              null;

            const targetPlayer =
              next[slot];

            if (
              sourceSlot &&
              sourceSlot !== slot
            ) {

              if (targetPlayer) {

                const targetCanMove =
                  canPlayerPlaySlot(
                    targetPlayer,
                    sourceSlot,
                    formation,
                    style
                  );

                if (
                  !targetCanMove
                ) {
                  return previous;
                }

                next[sourceSlot] = {
                  ...targetPlayer,
                  slot:
                    sourceSlot,
                };

              } else {
                delete next[
                  sourceSlot
                ];
              }
            }

            next[slot] = {
              ...player,
              slot,
              draftSlot:
                undefined,
            };

            return next;
          }
        );

        setSelectedId(null);

        setPickLocked(false);

        setMessage("");

        setActivePackSlot(null);

        setOpening(false);

        /*
         * If all positions are now filled,
         * go directly to result screen.
         */
        const remaining =
          formation.slots.filter(
            (formationSlot) =>
              formationSlot !== slot &&
              !placed[formationSlot]
          );

        if (
          remaining.length === 0
        ) {
          setStage(
            "done"
          );
        } else {
          setStage(
            "rounds"
          );
        }

        return true;
      },
      [
        formation,
        style,
        captain,
        captainSlot,
        canPlayerPlaySlot,
        getAllowedPositionsForSlot,
        placed,
      ]
    );


  /*
   * ==========================================================
   * REROLL
   * ==========================================================
   */

  const rerollPack =
    useCallback(
      () => {

        if (
          rerolls.pack <= 0 ||
          !season ||
          !formation ||
          !activePackSlot
        ) {
          return;
        }

        if (
          placed[
            activePackSlot
          ]
        ) {
          return;
        }

        const newPack =
          playerPoolForSlot(
            activePackSlot,
            season,
            roundType
          );

        if (
          !newPack.length
        ) {

          setMessage(
            `No players available for ${activePackSlot}.`
          );

          return;
        }

        setPack(
          newPack
        );

        setSelectedId(null);

        setPickLocked(false);

        setMessage("");

        setRerolls(
          (previous) => ({
            ...previous,
            pack:
              previous.pack - 1,
          })
        );
      },
      [
        rerolls.pack,
        season,
        formation,
        activePackSlot,
        placed,
        roundType,
        playerPoolForSlot,
      ]
    );


  /*
   * ==========================================================
   * ANIMATIONS
   * ==========================================================
   */

  const finishCaptainOpening =
    useCallback(
      () => {
        setStage(
          "captain"
        );
      },
      []
    );


  const finishPackOpening =
    useCallback(
      () => {

        setOpening(false);

        setStage(
          "pick"
        );
      },
      []
    );


  /*
   * ==========================================================
   * RESET
   * ==========================================================
   */

  const reset =
    useCallback(
      () => {
        window.location.reload();
      },
      []
    );


  /*
   * ==========================================================
   * TEAM OVR
   * ==========================================================
   */

  const allPlacedCount =
    occupied.length;

  const teamOVR =
    Math.round(
      occupied.reduce(
        (
          total,
          player
        ) =>
          total +
          (
            player.ovr ??
            player.base ??
            80
          ),
        0
      ) /
        (
          allPlacedCount ||
          1
        )
    );


  /*
   * ==========================================================
   * CHEMISTRY
   * ==========================================================
   */

  const playerChemistry =
    useMemo(
      () =>
        calculatePlayerChemistry(
          occupied,
          manager
        ),
      [
        occupied,
        manager,
      ]
    );


  const teamChemistry =
    useMemo(
      () =>
        calculateTeamChemistry(
          occupied,
          manager
        ),
      [
        occupied,
        manager,
      ]
    );


  const chemistryLinks =
    useMemo(
      () =>
        calculateChemistryLinks(
          occupied
        ),
      [
        occupied,
      ]
    );


  const playerChemistryLevel =
    useMemo(
      () => {

        const result = {};

        Object.entries(
          playerChemistry
        ).forEach(
          ([playerId, value]) => {

            result[playerId] =
              chemistryLevel(
                value
              );
          }
        );

        return result;
      },
      [
        playerChemistry,
      ]
    );


  /*
   * ==========================================================
   * RETURN API
   * ==========================================================
   */

  return {

    /*
     * State
     */
    stage,

    formation,

    captain,

    manager,

    placed,

    round,

    pack,

    season,

    roundType,

    opening,

    selectedId,

    pickLocked,

    activePackSlot,

    rerolls,

    message,

    /*
     * Tactical style
     */
    style,

    setStyle,

    /*
     * Choices
     */
    formationChoices,

    captainChoices,

    managerChoices,

    /*
     * Captain / formation
     */
    captainSlot,

    continueToCaptain,

    /*
     * Team
     */
    availableSlots,

    allPlacedCount,

    teamOVR,

    /*
     * Chemistry
     */
    playerChemistry,

    playerChemistryLevel,

    teamChemistry,

    chemistryLinks,

    /*
     * Main actions
     */
    chooseFormation,

    startCaptain,

    startManager,

    beginRound,

    openPositionPack,

    choosePlayer,

    placePlayer,

    rerollPack,

    /*
     * Animation
     */
    finishCaptainOpening,

    finishPackOpening,

    /*
     * Utility
     */
    setSelectedId,

    setMessage,

    /*
     * Position helpers
     */
    getBasePositionForSlot,

    getAllowedPositionsForSlot,

    canPlayerPlaySlot,

    /*
     * Reset
     */
    reset,
  };
}