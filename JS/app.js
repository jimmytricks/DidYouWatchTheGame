// Application configuration constants
const CONFIG = {
  API_URL: "https://statsapi.web.nhl.com/",
  API_VERSION_PATH: "api/v1/",
  ENDPOINTS: {
    SCHEDULE: "schedule",
    STANDINGS_BY_DIVISION: "standings/byDivision"
  }
};

// Get latest fixtures
function getLatestFixtures(teamID) {
  function onRequestedFixtureResponse(nextGameObject) {
    function createFixture(game) {
      // Get data from game object
      const gameDateFormatted = formatDateToString(game.gameDate);
      const textStringFixture = `${game.teams.home.team.name} vs ${
        game.teams.away.team.name
      }`;

      // create paragraph elements
      const pNode = createElementWithText("p", gameDateFormatted);
      const pNodeFixture = createElementWithText("p", textStringFixture);

      // create container div
      const gameContainerNode = document.createElement("div");

      // append paragraph elements to container div
      appendChildrenToElement(gameContainerNode, [pNode, pNodeFixture]);

      // add container to page
      document.getElementById("next-fixture").appendChild(gameContainerNode);
    }

    // get next 4 game fixtures
    const game1 = nextGameObject.dates["0"].games["0"];
    const game2 = nextGameObject.dates["1"].games["0"];
    const game3 = nextGameObject.dates["2"].games["0"];
    const game4 = nextGameObject.dates["3"].games["0"];
    const nextFourGames = [game1, game2, game3, game4];
    nextFourGames.forEach(createFixture);
  }

  // set date to today's date
  const dateToday = getCurrentDateForUrl();

  // create url object with path and get parameters
  const fixturesURL = {
    path: `${CONFIG.API_URL}${CONFIG.API_VERSION_PATH}${
      CONFIG.ENDPOINTS.SCHEDULE
    }`,
    params: {
      teamId: teamID,
      startDate: dateToday,
      endDate: "2019-01-12"
    }
  };

  fetchJSON(fixturesURL, onRequestedFixtureResponse);
}

// get last 4 results
function getLatestResults(teamID) {
  function onRequestedLatestResultsResponse(lastGameObject) {
    // pass in element plus index for using as html id
    function createLatestResult(game, index) {
      const gameDateFormatted = formatDateToString(game.gameDate);

      let textStringResult = "";
      const hockeyTeamID = game.teams.home.team.id;
      const homeTeamScore = game.teams.home.score;
      const awayTeamScore = game.teams.away.score;

      // check for a draw
      if (homeTeamScore === awayTeamScore) {
        textStringResult = "Draw " + homeTeamScore + " - " + awayTeamScore;
      }

      // check if home team is the current team
      if (hockeyTeamID == teamID) {
        // if current team home score more than away, prefix with win if not loss
        if (homeTeamScore > awayTeamScore) {
          textStringResult = `Win ${homeTeamScore} - ${awayTeamScore}`;
        } else {
          textStringResult = `Loss ${homeTeamScore} - ${awayTeamScore}`;
        }
        // if current team are away team
      } else {
        // prefix with win if higher score, if not loss
        if (homeTeamScore < awayTeamScore) {
          textStringResult = `Win ${awayTeamScore} - ${homeTeamScore}`;
        } else {
          textStringResult = `Loss ${awayTeamScore} - ${homeTeamScore}`;
        }
      }

      const textStringFixture = `${game.teams.home.team.name} vs ${
        game.teams.away.team.name
      }`;

      // create paragraph elements with text
      const pNode = createElementWithText("p", gameDateFormatted);
      const pNodeFixture = createElementWithText("p", textStringFixture);
      const pNodeResult = createElementWithText("p", textStringResult);

      // add class to score element for styling
      pNodeResult.classList.add("result-score");

      //create container div for result and score, add class and append result to it
      const scoreAndHighlightContainer = document.createElement("div");
      const uniqueContainerID = `score-highlight-container-${index}`;
      scoreAndHighlightContainer.setAttribute("id", uniqueContainerID);
      scoreAndHighlightContainer.appendChild(pNodeResult);

      // create container li
      const gameContainerNode = document.createElement("li");

      // append paragraph elements to container li and add to page
      gameContainerNode.appendChild(pNode);
      gameContainerNode.appendChild(pNodeFixture);
      gameContainerNode.appendChild(scoreAndHighlightContainer);

      // add to dynamic html ID using index, then append to LI element
      const gameContainerNodeIDString = `last-fixture-${index}`;
      document
        .getElementById(gameContainerNodeIDString)
        .appendChild(gameContainerNode);
    }

    // get the the last 4 games
    let lastFourGamesArray = lastGameObject.dates.slice(-4).reverse();

    // set game variables, run create game date function
    const game1 = lastFourGamesArray["0"].games["0"];
    const game2 = lastFourGamesArray["1"].games["0"];
    const game3 = lastFourGamesArray["2"].games["0"];
    const game4 = lastFourGamesArray["3"].games["0"];
    const nextFourGames = [game1, game2, game3, game4];
    nextFourGames.forEach(createLatestResult);

    // run get highlights function
    nextFourGames.forEach(getHighlights);
  }

  // set date to today's date
  const dateToday = getCurrentDateForUrl();

  // create url object with path and get parameters
  const resultsURL = {
    path: `${CONFIG.API_URL}${CONFIG.API_VERSION_PATH}${
      CONFIG.ENDPOINTS.SCHEDULE
    }`,
    params: {
      teamId: teamID,
      startDate: "2018-01-01",
      endDate: dateToday
    }
  };

  // Get latest results from API and process
  fetchJSON(resultsURL, onRequestedLatestResultsResponse);
}

// get highlights from last results
function getHighlights(highlights, index) {
  function onRequestedHighlightsResponse(highlightObject) {
    // get link
    const extendedHighlightLink =
      highlightObject.media.epg[2].items[0].playbacks[9].url;

    // create a link element to hold highlight URL
    const a = createElementWithText("a", "View Highlights");
    a.title = "View game highlights";
    a.setAttribute("target", "_blank");
    a.href = extendedHighlightLink;

    // add the a element to container with correct score
    const highlightContainerNodeIDString = `score-highlight-container-${index}`;
    document.getElementById(highlightContainerNodeIDString).appendChild(a);
  }

  // access api link containing highlights info
  const contentLinkUrl = CONFIG.API_URL + highlights["content"]["link"];

  // Get content from API and process
  fetchJSON(contentLinkUrl, onRequestedHighlightsResponse);
}

function getDivisionTable(teamID) {
  function onRequestedDivisionTableResponse(result) {
    let divisionTableObject = result;
    let divisionNumber;

    // check which division the current team ID belongs to by looping through each
    function checkWhichDivision(teamID, records) {
      for (let e = 0; e < records.length; e++) {
        for (a = 0; a < records[e].teamRecords.length; a++) {
          if (teamID === records[e].teamRecords[a].team.id) {
            document.getElementById("division-table-name").innerText =
              records[e].division.name;

            // set division number to the iteration / index of correct array
            divisionNumber = e;

            // if division is central, remove 8th place from table
            if (divisionNumber == 2) {
              const hideExtraDivPosition = document.getElementById(
                "division-table-8"
              );
              hideExtraDivPosition.style.display = "none";
            }
          }
        }
      }
    }
    checkWhichDivision(teamID, divisionTableObject.records);

    const divisionTeams =
      divisionTableObject.records[divisionNumber].teamRecords;
    for (let i = 0; i < divisionTeams.length; i++) {
      // create list node and text, append text to node
      const divisionTeamNameListItem = createElementWithText(
        "li",
        divisionTeams[i].team.name
      );

      // create string to grab league placing IDS
      const divisionTableStandingIDString = `division-table-${i + 1}`;

      document
        .getElementById(divisionTableStandingIDString)
        .appendChild(divisionTeamNameListItem);

      // check if team is the canucks, add class to parent UL element for styling
      if (divisionTeams[i].team.id == teamID) {
        document.getElementById(divisionTableStandingIDString).className =
          "currentteam-standing";
      }

      // add league points to standing table
      function addLeaguePoints(leaguePoints) {
        // create list node and text, append text to node
        const divisionTeamPointsListItem = createElementWithText(
          "li",
          divisionTeams[i][leaguePoints]
        );

        // create string to grab league placing IDS
        const divisionTableStandingIDString = `division-table-${i + 1}`;

        document
          .getElementById(divisionTableStandingIDString)
          .appendChild(divisionTeamPointsListItem);
      }

      addLeaguePoints("points");

      //  add league stats, wins, losses and OT to table
      function addLeagueStats(leagueStats) {
        // create list node and text, append text to node
        const divisionTeamPointsListItem = document.createElement("li");
        const divisionTeamPointsTextNode = document.createTextNode(
          divisionTeams[i].leagueRecord[leagueStats]
        );
        divisionTeamPointsListItem.appendChild(divisionTeamPointsTextNode);

        // create string to grab league placing IDS
        const divisionTableStandingIDString = `division-table-${i + 1}`;

        document
          .getElementById(divisionTableStandingIDString)
          .appendChild(divisionTeamPointsListItem);
      }

      addLeagueStats("wins");
      addLeagueStats("losses");
      addLeagueStats("ot");
    }
  }

  // Create URL string
  let divisionTableURL = `${CONFIG.API_URL}${CONFIG.API_VERSION_PATH}${
    CONFIG.ENDPOINTS.STANDINGS_BY_DIVISION
  }`;

  // Get division table data from API
  fetchJSON(divisionTableURL, onRequestedDivisionTableResponse);
}

// Reset the DOM for app re-initialisation
function resetInfo() {
  // function to reset the values to default
}

// Initialise the app using the currently selected team
function init() {
  const currentTeamSelected = Number(
    document.getElementById("team-selector").value
  );
  runApp(currentTeamSelected);
}

// Run application
function runApp(teamID) {
  resetInfo();
  getLatestFixtures(teamID);
  getLatestResults(teamID);
  getDivisionTable(teamID);
}

// Trigger running of app when DOM loaded (might not need this event wrapper)
document.addEventListener("DOMContentLoaded", function() {
  init();
});
