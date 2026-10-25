/*
 * ============================================================
 * XI LEGACY
 * Historical Football Player Database
 * ============================================================
 *
 * 160 players
 *
 * OVR distribution:
 * 75-82  = Average / Squad players
 * 83-87  = Good players
 * 88-92  = Elite players
 * 93-95  = World Class / Legends
 * 96-99  = Extremely rare Icons
 *
 * NOTE:
 * Ratings are designed for XI Legacy game balance.
 */

const createPlayer = (
  id,
  name,
  nation,
  club,
  league,
  positions,
  base,
  seasons,
  isIcon = false
) => {
  const seasonRatings = Object.fromEntries(
    seasons.map((year) => [
      String(year),
      {
        /*
         * Small natural variation around base rating.
         *
         * This keeps historical seasons feeling different
         * while maintaining the player's overall rating range.
         */
        ovr: Math.min(
          99,
          Math.max(
            60,
            base + (Number(year) % 5) - 2
          )
        ),
      },
    ])
  );

  const getRarity = () => {
    if (isIcon) return "ICON";
    if (base >= 93) return "LEGENDARY";
    if (base >= 88) return "ELITE";
    return "GOLD";
  };

  return {
    id: String(id),
    name,
    nation,
    club,
    league,

    /*
     * Every position the player can play.
     */
    positions,

    /*
     * First listed position is treated as the
     * player's primary position.
     */
    primaryPosition: positions[0],

    /*
     * Used later for card design and pack rarity.
     */
    rarity: getRarity(),

    /*
     * Base rating before season adjustment.
     */
    base,

    /*
     * Season-specific ratings.
     */
    seasons: seasonRatings,

    /*
     * Special Icon flag.
     */
    isIcon,

    /*
     * Convenient value for UI/card rendering.
     */
    displayOvr: base,
  };
};

const raw = [
  /*
   * =========================================================
   * EXISTING STAR PLAYERS
   * =========================================================
   */

  [1, "Lionel Messi", "Argentina", "Barcelona", "La Liga", ["RW", "ST", "CAM"], 94, [2009, 2011, 2012, 2015, 2019]],
  [2, "Cristiano Ronaldo", "Portugal", "Manchester United", "Premier League", ["LW", "ST", "RW"], 93, [2007, 2008, 2009, 2013, 2017]],
  [3, "Cristiano Ronaldo", "Portugal", "Real Madrid", "La Liga", ["LW", "ST", "RW"], 94, [2011, 2012, 2014, 2016, 2017]],
  [4, "Xavi", "Spain", "Barcelona", "La Liga", ["CM", "CDM", "CAM"], 90, [2008, 2010, 2011, 2012]],
  [5, "Andres Iniesta", "Spain", "Barcelona", "La Liga", ["CM", "CAM", "LW"], 91, [2009, 2010, 2012, 2015]],
  [6, "Luka Modric", "Croatia", "Real Madrid", "La Liga", ["CM", "CDM", "CAM"], 91, [2014, 2016, 2017, 2018, 2022]],
  [7, "Toni Kroos", "Germany", "Real Madrid", "La Liga", ["CM", "CDM"], 88, [2014, 2016, 2017, 2021]],
  [8, "Zinedine Zidane", "France", "Real Madrid", "La Liga", ["CAM", "CM"], 94, [1998, 2000, 2002], true],
  [9, "Ronaldo Nazario", "Brazil", "Real Madrid", "La Liga", ["ST", "CF"], 95, [1997, 2002], true],
  [10, "Ronaldinho", "Brazil", "Barcelona", "La Liga", ["LW", "CAM", "ST"], 94, [2004, 2005, 2006], true],

  [11, "Thierry Henry", "France", "Arsenal", "Premier League", ["ST", "LW", "CF"], 92, [2002, 2003, 2004, 2006]],
  [12, "Patrick Vieira", "France", "Arsenal", "Premier League", ["CDM", "CM", "CB"], 90, [2001, 2002, 2004]],
  [13, "Dennis Bergkamp", "Netherlands", "Arsenal", "Premier League", ["CF", "CAM", "ST"], 90, [1998, 2001, 2002], true],
  [14, "Wayne Rooney", "England", "Manchester United", "Premier League", ["ST", "CF", "CAM"], 91, [2007, 2009, 2011, 2013]],
  [15, "Rio Ferdinand", "England", "Manchester United", "Premier League", ["CB"], 89, [2007, 2008, 2009, 2011]],
  [16, "Nemanja Vidic", "Serbia", "Manchester United", "Premier League", ["CB"], 88, [2008, 2009, 2010]],
  [17, "Paul Scholes", "England", "Manchester United", "Premier League", ["CM", "CAM"], 88, [2003, 2007, 2009], true],
  [18, "Steven Gerrard", "England", "Liverpool", "Premier League", ["CM", "CAM", "CDM"], 90, [2005, 2007, 2009, 2014]],
  [19, "Mohamed Salah", "Egypt", "Liverpool", "Premier League", ["RW", "ST"], 90, [2017, 2018, 2021, 2022]],
  [20, "Virgil van Dijk", "Netherlands", "Liverpool", "Premier League", ["CB"], 90, [2018, 2019, 2022]],

  [21, "Kevin De Bruyne", "Belgium", "Manchester City", "Premier League", ["CM", "CAM"], 91, [2017, 2019, 2021, 2023]],
  [22, "Sergio Aguero", "Argentina", "Manchester City", "Premier League", ["ST", "CF"], 91, [2012, 2014, 2019]],
  [23, "Vincent Kompany", "Belgium", "Manchester City", "Premier League", ["CB"], 88, [2011, 2012, 2014]],
  [24, "David Silva", "Spain", "Manchester City", "Premier League", ["CAM", "CM", "LW"], 89, [2011, 2012, 2018]],
  [25, "Yaya Toure", "Ivory Coast", "Manchester City", "Premier League", ["CM", "CDM"], 89, [2012, 2014, 2015]],
  [26, "Didier Drogba", "Ivory Coast", "Chelsea", "Premier League", ["ST", "CF"], 90, [2006, 2009, 2010, 2012]],
  [27, "Frank Lampard", "England", "Chelsea", "Premier League", ["CM", "CAM"], 89, [2005, 2006, 2009, 2010]],
  [28, "John Terry", "England", "Chelsea", "Premier League", ["CB"], 89, [2005, 2006, 2009]],
  [29, "Claude Makelele", "France", "Chelsea", "Premier League", ["CDM", "CM"], 88, [2003, 2005, 2006]],
  [30, "Eden Hazard", "Belgium", "Chelsea", "Premier League", ["LW", "CAM", "RW"], 91, [2014, 2017, 2018]],

  [31, "Arjen Robben", "Netherlands", "Bayern Munich", "Bundesliga", ["RW", "LW", "ST"], 92, [2010, 2013, 2014]],
  [32, "Franck Ribery", "France", "Bayern Munich", "Bundesliga", ["LW", "RW", "CAM"], 90, [2011, 2013, 2014]],
  [33, "Thomas Muller", "Germany", "Bayern Munich", "Bundesliga", ["CAM", "ST", "RW"], 89, [2010, 2013, 2014, 2020]],
  [34, "Philipp Lahm", "Germany", "Bayern Munich", "Bundesliga", ["RB", "LB", "CDM"], 89, [2011, 2013, 2014]],
  [35, "Manuel Neuer", "Germany", "Bayern Munich", "Bundesliga", ["GK"], 91, [2013, 2014, 2015]],
  [36, "Robert Lewandowski", "Poland", "Bayern Munich", "Bundesliga", ["ST", "CF"], 92, [2015, 2019, 2020, 2021]],
  [37, "Miroslav Klose", "Germany", "Bayern Munich", "Bundesliga", ["ST"], 87, [2007, 2010, 2012]],
  [38, "Franz Beckenbauer", "Germany", "Bayern Munich", "Bundesliga", ["CB", "CDM"], 94, [1972, 1974], true],

  [39, "Paolo Maldini", "Italy", "AC Milan", "Serie A", ["CB", "LB"], 94, [1994, 2003, 2005], true],
  [40, "Kaka", "Brazil", "AC Milan", "Serie A", ["CAM", "CM"], 91, [2005, 2007, 2008]],
  [41, "Andrea Pirlo", "Italy", "AC Milan", "Serie A", ["CM", "CDM"], 90, [2006, 2011, 2012]],
  [42, "Alessandro Nesta", "Italy", "AC Milan", "Serie A", ["CB"], 93, [2003, 2005, 2007], true],
  [43, "Zlatan Ibrahimovic", "Sweden", "AC Milan", "Serie A", ["ST", "CF"], 91, [2010, 2011, 2012, 2020]],
  [44, "Gianluigi Buffon", "Italy", "Juventus", "Serie A", ["GK"], 92, [2006, 2012, 2015]],
  [45, "Giorgio Chiellini", "Italy", "Juventus", "Serie A", ["CB"], 89, [2012, 2015, 2017]],
  [46, "Alessandro Del Piero", "Italy", "Juventus", "Serie A", ["ST", "CF", "CAM"], 91, [1998, 2003, 2008], true],

  [47, "Rivaldo", "Brazil", "Barcelona", "La Liga", ["LW", "CAM", "ST"], 91, [1998, 1999, 2000], true],
  [48, "Carles Puyol", "Spain", "Barcelona", "La Liga", ["CB", "RB"], 89, [2005, 2009, 2010]],
  [49, "Luis Suarez", "Uruguay", "Barcelona", "La Liga", ["ST", "CF"], 92, [2014, 2015, 2016]],
  [50, "Neymar", "Brazil", "Barcelona", "La Liga", ["LW", "RW", "CAM"], 92, [2015, 2016, 2017]],
  [51, "Sergio Ramos", "Spain", "Real Madrid", "La Liga", ["CB", "RB"], 91, [2012, 2014, 2017]],
  [52, "Iker Casillas", "Spain", "Real Madrid", "La Liga", ["GK"], 91, [2008, 2010, 2012]],
  [53, "Roberto Carlos", "Brazil", "Real Madrid", "La Liga", ["LB"], 92, [1998, 2000, 2002], true],
  [54, "Raul", "Spain", "Real Madrid", "La Liga", ["ST", "CF"], 91, [1999, 2001, 2003]],
  [55, "Fabio Cannavaro", "Italy", "Real Madrid", "La Liga", ["CB"], 90, [2006, 2007], true],
  [56, "Gareth Bale", "Wales", "Real Madrid", "La Liga", ["RW", "LW", "ST"], 90, [2014, 2016, 2018]],
  [57, "Karim Benzema", "France", "Real Madrid", "La Liga", ["ST", "CF"], 92, [2018, 2021, 2022]],

  [58, "Lothar Matthaus", "Germany", "Inter Milan", "Serie A", ["CM", "CDM", "CB"], 93, [1989, 1990, 1991], true],
  [59, "Johan Cruyff", "Netherlands", "Barcelona", "La Liga", ["CF", "CAM", "ST"], 95, [1973, 1974], true],
  [60, "Diego Maradona", "Argentina", "Napoli", "Serie A", ["CAM", "ST", "LW"], 97, [1986, 1987, 1988], true],
  [61, "Lev Yashin", "Russia", "Dynamo Moscow", "Other", ["GK"], 95, [1963], true],
  [62, "Pele", "Brazil", "Santos", "Other", ["ST", "CF", "CAM"], 98, [1961, 1962, 1963], true],
  [63, "George Best", "Northern Ireland", "Manchester United", "Premier League", ["RW", "LW", "ST"], 94, [1968, 1969], true],
  [64, "Eric Cantona", "France", "Manchester United", "Premier League", ["ST", "CF", "CAM"], 91, [1993, 1994, 1996], true],

  /*
   * =========================================================
   * RIGHT BACKS
   * =========================================================
   */

  [65, "Cafu", "Brazil", "AC Milan", "Serie A", ["RB", "RWB"], 94, [1999, 2002, 2005], true],
  [66, "Dani Alves", "Brazil", "Barcelona", "La Liga", ["RB", "RWB", "CM"], 90, [2009, 2011, 2015]],
  [67, "Javier Zanetti", "Argentina", "Inter Milan", "Serie A", ["RB", "LB", "RM"], 88, [1998, 2003, 2010], true],
  [68, "Maicon", "Brazil", "Inter Milan", "Serie A", ["RB", "RWB"], 88, [2008, 2009, 2010]],
  [69, "Trent Alexander-Arnold", "England", "Liverpool", "Premier League", ["RB", "RWB", "CM"], 87, [2019, 2020, 2022]],
  [70, "Kyle Walker", "England", "Manchester City", "Premier League", ["RB", "RWB", "CB"], 86, [2017, 2019, 2022]],
  [71, "Dani Carvajal", "Spain", "Real Madrid", "La Liga", ["RB", "RWB"], 87, [2014, 2017, 2022]],
  [72, "Juanfran", "Spain", "Atletico Madrid", "La Liga", ["RB", "RWB"], 84, [2014, 2016, 2017]],
  [73, "Cesar Azpilicueta", "Spain", "Chelsea", "Premier League", ["RB", "LB", "CB"], 84, [2014, 2016, 2021]],
  [74, "Branislav Ivanovic", "Serbia", "Chelsea", "Premier League", ["RB", "CB"], 84, [2010, 2012, 2015]],
  [75, "Pablo Zabaleta", "Argentina", "Manchester City", "Premier League", ["RB", "RWB"], 83, [2012, 2014, 2016]],
  [76, "Gary Neville", "England", "Manchester United", "Premier League", ["RB"], 83, [1999, 2001, 2004], true],
  [77, "Willy Sagnol", "France", "Bayern Munich", "Bundesliga", ["RB", "RWB"], 84, [2003, 2005, 2006]],
  [78, "Lilian Thuram", "France", "Juventus", "Serie A", ["RB", "CB"], 88, [1998, 2000, 2003], true],
  [79, "Joao Cancelo", "Portugal", "Manchester City", "Premier League", ["RB", "LB", "RWB"], 87, [2019, 2021, 2022]],
  [80, "Achraf Hakimi", "Morocco", "Inter Milan", "Serie A", ["RB", "RWB"], 86, [2020, 2021, 2022]],

  /*
   * =========================================================
   * LEFT BACKS
   * =========================================================
   */

  [81, "Ashley Cole", "England", "Chelsea", "Premier League", ["LB", "LWB"], 89, [2005, 2009, 2012], true],
  [82, "Marcelo", "Brazil", "Real Madrid", "La Liga", ["LB", "LWB"], 90, [2012, 2014, 2017]],
  [83, "Jordi Alba", "Spain", "Barcelona", "La Liga", ["LB", "LWB"], 87, [2012, 2015, 2019]],
  [84, "Patrice Evra", "France", "Manchester United", "Premier League", ["LB", "LWB"], 86, [2008, 2010, 2013]],
  [85, "David Alaba", "Austria", "Bayern Munich", "Bundesliga", ["LB", "CB", "CDM"], 88, [2013, 2015, 2017]],
  [86, "Andrew Robertson", "Scotland", "Liverpool", "Premier League", ["LB", "LWB"], 86, [2018, 2019, 2022]],
  [87, "Theo Hernandez", "France", "AC Milan", "Serie A", ["LB", "LWB"], 86, [2021, 2022, 2023]],
  [88, "Raphael Guerreiro", "Portugal", "Borussia Dortmund", "Bundesliga", ["LB", "CM", "LM"], 84, [2017, 2019, 2021]],
  [89, "Leighton Baines", "England", "Everton", "Premier League", ["LB", "LWB"], 84, [2011, 2013, 2015]],
  [90, "Gael Clichy", "France", "Manchester City", "Premier League", ["LB"], 82, [2012, 2014, 2016]],
  [91, "Aleksandar Kolarov", "Serbia", "Manchester City", "Premier League", ["LB", "LWB", "CB"], 84, [2012, 2014, 2016]],
  [92, "Eric Abidal", "France", "Barcelona", "La Liga", ["LB", "CB"], 85, [2008, 2010, 2011]],
  [93, "Juan Pablo Sorin", "Argentina", "Villarreal", "La Liga", ["LB", "LM"], 82, [2004, 2005], true],

  /*
   * =========================================================
   * CENTER BACKS
   * =========================================================
   */

  
  [94, "Alessio Romagnoli", "Italy", "AC Milakhgslwatrfgstyu;n", "Serie A", ["CB"], 82, [2016, 2018, 2020]],  [95, "Leonardo Bonucci", "Italy", "Juventus", "Serie A", ["CB"], 88, [2012, 2015, 2017]],
  [96, "Andrea Barzagli", "Italy", "Juventus", "Serie A", ["CB"], 86, [2012, 2015, 2017]],
  [97, "Gianluca Zambrotta", "Italy", "Juventus", "Serie A", ["RB", "LB"], 86, [2002, 2004, 2006]],
  [98, "Diego Godin", "Uruguay", "Atletico Madrid", "La Liga", ["CB"], 88, [2013, 2014, 2016]],
  [99, "Miranda", "Brazil", "Atletico Madrid", "La Liga", ["CB"], 85, [2013, 2014, 2016]],
  [100, "Diego Lugano", "Uruguay", "Fenerbahce", "Other", ["CB"], 82, [2007, 2009, 2011]],
  [101, "Thiago Silva", "Brazil", "AC Milan", "Serie A", ["CB"], 89, [2011, 2013, 2015]],
  [102, "Alex", "Brazil", "PSG", "Ligue 1", ["CB"], 84, [2012, 2014]],
  [103, "Marquinhos", "Brazil", "PSG", "Ligue 1", ["CB", "RB", "CDM"], 88, [2017, 2020, 2022]],
  [104, "Mats Hummels", "Germany", "Borussia Dortmund", "Bundesliga", ["CB"], 87, [2013, 2014, 2017]],
  [105, "Jerome Boateng", "Germany", "Bayern Munich", "Bundesliga", ["CB"], 87, [2013, 2014, 2016]],
  [106, "Per Mertesacker", "Germany", "Arsenal", "Premier League", ["CB"], 82, [2012, 2014, 2015]],
  [107, "Raphael Varane", "France", "Real Madrid", "La Liga", ["CB"], 88, [2014, 2017, 2018]],
  [108, "Pepe", "Portugal", "Real Madrid", "La Liga", ["CB"], 88, [2012, 2014, 2016]],
  [109, "Gerard Pique", "Spain", "Barcelona", "La Liga", ["CB"], 88, [2011, 2013, 2015]],
  [110, "Javier Mascherano", "Argentina", "Barcelona", "La Liga", ["CB", "CDM"], 87, [2011, 2013, 2015]],

  /*
   * =========================================================
   * GOALKEEPERS
   * =========================================================
   */

  [111, "Petr Cech", "Czech Republic", "Chelsea", "Premier League", ["GK"], 89, [2005, 2008, 2010]],
  [112, "Edwin van der Sar", "Netherlands", "Manchester United", "Premier League", ["GK"], 90, [2007, 2008, 2010], true],
  [113, "Peter Schmeichel", "Denmark", "Manchester United", "Premier League", ["GK"], 91, [1993, 1996, 1999], true],
  [114, "Oliver Kahn", "Germany", "Bayern Munich", "Bundesliga", ["GK"], 90, [2000, 2002, 2003], true],
  [115, "Oliver Kahn", "Germany", "Bayern Munich", "Bundesliga", ["GK"], 89, [1999, 2001]],
  [116, "Dida", "Brazil", "AC Milan", "Serie A", ["GK"], 87, [2003, 2005, 2007]],
  [117, "Julio Cesar", "Brazil", "Inter Milan", "Serie A", ["GK"], 87, [2009, 2010, 2011]],
  [118, "Keylor Navas", "Costa Rica", "Real Madrid", "La Liga", ["GK"], 86, [2015, 2017, 2018]],
  [119, "Thibaut Courtois", "Belgium", "Real Madrid", "La Liga", ["GK"], 89, [2019, 2022, 2023]],
  [120, "Victor Valdes", "Spain", "Barcelona", "La Liga", ["GK"], 86, [2011, 2012, 2014]],
  [121, "David de Gea", "Spain", "Manchester United", "Premier League", ["GK"], 88, [2014, 2017, 2018]],
  [122, "Hugo Lloris", "France", "Tottenham", "Premier League", ["GK"], 86, [2013, 2016, 2018]],
  [123, "Alisson Becker", "Brazil", "Liverpool", "Premier League", ["GK"], 89, [2019, 2020, 2022]],
  [124, "Ederson", "Brazil", "Manchester City", "Premier League", ["GK"], 87, [2018, 2020, 2022]],
  [125, "Emiliano Martinez", "Argentina", "Aston Villa", "Premier League", ["GK"], 86, [2021, 2022, 2023]],

  /*
   * =========================================================
   * MIDFIELDERS
   * =========================================================
   */

  [126, "Sergio Busquets", "Spain", "Barcelona", "La Liga", ["CDM", "CM"], 89, [2011, 2013, 2015, 2019]],
  [127, "Casemiro", "Brazil", "Real Madrid", "La Liga", ["CDM", "CM"], 88, [2016, 2017, 2021]],
  [128, "N'Golo Kante", "France", "Chelsea", "Premier League", ["CDM", "CM"], 89, [2016, 2017, 2021]],
  [129, "Michael Essien", "Ghana", "Chelsea", "Premier League", ["CDM", "CM"], 87, [2006, 2008, 2010]],
  [130, "Claude Makelele", "France", "Real Madrid", "La Liga", ["CDM", "CM"], 88, [2001, 2003, 2005]],
  [131, "Michael Carrick", "England", "Manchester United", "Premier League", ["CDM", "CM"], 84, [2008, 2010, 2013]],
  [132, "Roy Keane", "Ireland", "Manchester United", "Premier League", ["CDM", "CM"], 88, [1997, 1999, 2000], true],
  [133, "Patrick Vieira", "France", "Inter Milan", "Serie A", ["CDM", "CM", "CB"], 89, [2006, 2007, 2009]],
  [134, "Cesc Fabregas", "Spain", "Chelsea", "Premier League", ["CM", "CAM"], 87, [2010, 2012, 2015]],
  [135, "Mesut Ozil", "Germany", "Real Madrid", "La Liga", ["CAM", "CM"], 88, [2011, 2012, 2015]],
  [136, "Juan Mata", "Spain", "Chelsea", "Premier League", ["CAM", "CM", "LW"], 85, [2012, 2013, 2015]],
  [137, "Christian Eriksen", "Denmark", "Tottenham", "Premier League", ["CAM", "CM"], 86, [2016, 2017, 2018]],
  [138, "David Beckham", "England", "Manchester United", "Premier League", ["RM", "CM", "RW"], 89, [1999, 2001, 2003], true],
  [139, "Paul Pogba", "France", "Manchester United", "Premier League", ["CM", "CAM", "CDM"], 86, [2016, 2018, 2019]],
  [140, "Marco Verratti", "Italy", "PSG", "Ligue 1", ["CM", "CDM"], 87, [2016, 2018, 2020]],
  [141, "Thiago Alcantara", "Spain", "Bayern Munich", "Bundesliga", ["CM", "CDM"], 87, [2017, 2019, 2020]],
  [142, "Bastian Schweinsteiger", "Germany", "Bayern Munich", "Bundesliga", ["CM", "CDM"], 88, [2010, 2013, 2014]],
  [143, "Tomas Rosicky", "Czech Republic", "Arsenal", "Premier League", ["CAM", "CM"], 82, [2007, 2009, 2011]],
  [144, "Santi Cazorla", "Spain", "Arsenal", "Premier League", ["CM", "CAM", "LW"], 85, [2012, 2014, 2015]],
  [145, "Mesut Ozil", "Germany", "Arsenal", "Premier League", ["CAM", "CM"], 87, [2015, 2016, 2017]],

  /*
   * =========================================================
   * WINGERS / ATTACKERS
   * =========================================================
   */

  [146, "Angel Di Maria", "Argentina", "Real Madrid", "La Liga", ["RW", "LW", "CAM"], 89, [2012, 2014, 2015]],
  [147, "Franck Ribery", "France", "Bayern Munich", "Bundesliga", ["LW", "RW"], 90, [2012, 2013]],
  [148, "Sadio Mane", "Senegal", "Liverpool", "Premier League", ["LW", "RW", "ST"], 88, [2018, 2019, 2022]],
  [149, "Raheem Sterling", "England", "Manchester City", "Premier League", ["LW", "RW", "ST"], 87, [2017, 2019, 2021]],
  [150, "Riyad Mahrez", "Algeria", "Manchester City", "Premier League", ["RW", "LW", "CAM"], 87, [2016, 2019, 2021]],
  [151, "Heung-Min Son", "South Korea", "Tottenham", "Premier League", ["LW", "RW", "ST"], 88, [2017, 2020, 2022]],
  [152, "Luis Figo", "Portugal", "Real Madrid", "La Liga", ["RW", "RM", "CAM"], 92, [2000, 2001, 2002], true],
  [153, "Ryan Giggs", "Wales", "Manchester United", "Premier League", ["LW", "LM", "CAM"], 89, [1999, 2001, 2003], true],
  [154, "David Villa", "Spain", "Barcelona", "La Liga", ["ST", "CF", "LW"], 89, [2010, 2011, 2012]],
  [155, "Fernando Torres", "Spain", "Liverpool", "Premier League", ["ST", "CF"], 88, [2007, 2008, 2009]],
  [156, "Samuel Eto'o", "Cameroon", "Barcelona", "La Liga", ["ST", "CF", "RW"], 91, [2005, 2006, 2009], true],
  [157, "Robin van Persie", "Netherlands", "Arsenal", "Premier League", ["ST", "CF", "LW"], 89, [2011, 2012, 2013]],
  [158, "Ruud van Nistelrooy", "Netherlands", "Manchester United", "Premier League", ["ST", "CF"], 89, [2001, 2003, 2004], true],
  [159, "Michael Owen", "England", "Liverpool", "Premier League", ["ST", "CF"], 87, [1998, 1999, 2001], true],
  [160, "Gabriel Batistuta", "Argentina", "Fiorentina", "Serie A", ["ST", "CF"], 91, [1994, 1996, 1998], true],
];

/*
 * ============================================================
 * Convert raw database into the format used by the game.
 * ============================================================
 */

export const players = raw.map(
  ([
    id,
    name,
    nation,
    club,
    league,
    positions,
    base,
    seasons,
    isIcon,
  ]) =>
    createPlayer(
      id,
      name,
      nation,
      club,
      league,
      positions,
      base,
      seasons,
      isIcon
    )
);

export default players;