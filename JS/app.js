// Set config vars
const CONFIG = {
  API_URL: "https://statsapi.web.nhl.com/",
  API_VERSION_PATH: "api/v1/",
  ENDPOINTS: {
    SCHEDULE: "schedule",
    STANDINGS_BY_DIVISION: "standings/byDivision"
  },
  ELEMENTS: {
    TITLE_PRE_TEXT: 'Did You Watch The Game?',
    TITLE_POST_TEXT: ' Fixtures, Results and Highlights'
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

      // create container div, add class
      const gameContainerNode = document.createElement("div");
      gameContainerNode.classList.add('fixture-container');

      // append paragraph elements to container div
      appendChildrenToElement(gameContainerNode, [pNode, pNodeFixture]);

      // add container to page
      document.getElementById("next-fixture").appendChild(gameContainerNode);
    }

    // get next 4 game fixtures, if no fixtures say message no upcoming fixtures
    
    if (nextGameObject.totalGames === 0) {
      document.getElementById('no-fixtures').style.display = 'inline';
    } else {
    const game1 = nextGameObject.dates["0"].games["0"];
    const game2 = nextGameObject.dates["1"].games["0"];
    const game3 = nextGameObject.dates["2"].games["0"];
    const game4 = nextGameObject.dates["3"].games["0"];
    const nextFourGames = [game1, game2, game3, game4];
    nextFourGames.forEach(createFixture);
    }
  }

  // set date to today's date
  const dateToday = getCurrentDateForUrl();

  // set future date to a year in advance
  const dateTodayPlusOneYear = getCurrentDateForUrlPlusOneYear();

  // create url object with path and get parameters
  const fixturesURL = {
    path: `${CONFIG.API_URL}${CONFIG.API_VERSION_PATH}${
      CONFIG.ENDPOINTS.SCHEDULE
      }`,
    params: {
      teamId: teamID,
      startDate: dateToday,
      endDate: dateTodayPlusOneYear
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

      // get game state
      let getGameState = game.status.detailedState;
      let scheduled, preGame, inProgress = false;

      // if game hasn't started yet
      if (getGameState === "Scheduled" || getGameState === "Pre-Game") {
        if (getGameState === "Scheduled") {
          scheduled = true;
          createScoringString();
          createScoringElements();
        } else {
          preGame = true;
          createScoringString();
          createScoringElements();
        }
        // code to execute

      } else {
      
        if (getGameState === "In Progress" || getGameState === "In Progress - Critical" ) {
          inProgress = true;
          createScoringString();
          createScoringElements();

        } else {
          createScoringString();
          createScoringElements();
        }

        let = textStringFixture, textStringResult;
      }
      function createScoringString() {
        const hockeyTeamID = game.teams.home.team.id;
        const homeTeamScore = game.teams.home.score;
        const awayTeamScore = game.teams.away.score;

        // check for a draw
        if (homeTeamScore === awayTeamScore) {
          textStringResult = "Draw " + homeTeamScore + " - " + awayTeamScore;
        } else {

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
        }

        textStringFixture = `${game.teams.home.team.name} vs ${
          game.teams.away.team.name
          }`;
      }

      function createScoringElements() {
        // create paragraph elements with text
        const pNode = createElementWithText("p", gameDateFormatted);
        const pNodeFixture = createElementWithText("p", textStringFixture);
        const pNodeResult = createElementWithText("p", textStringResult);

        // add class to score element for styling
        pNodeResult.classList.add("result-score");

        //create container div for result and score, add ID + class and append result to it
        const scoreAndHighlightContainer = document.createElement("div");
        const uniqueContainerID = `score-highlight-container-${index}`;
        const uniqueContainerClass = `score-highlight-container`;
        scoreAndHighlightContainer.setAttribute("id", uniqueContainerID);
        scoreAndHighlightContainer.setAttribute("class", uniqueContainerClass)
        scoreAndHighlightContainer.appendChild(pNodeResult);

        // if pregame or scheduled, amend text
        if (preGame == true || scheduled == true || inProgress == true ){
          if (preGame == true){
            scoreAndHighlightContainer.setAttribute("class", 'score-highlight-container pregame-exception')
          } else if (scheduled == true ) {
            scoreAndHighlightContainer.setAttribute("class", 'score-highlight-container scheduled-exception')
          } else if (inProgress == true) {
            scoreAndHighlightContainer.setAttribute("class", 'score-highlight-container inprogress-exception')
          }
        }

        // create container li
        const gameContainerNode = document.createElement("li");
        gameContainerNode.classList.add('result-container');

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

  // set future date to a year in advance
  const dateTodayMinusOneYear = getCurrentDateForUrlMinusOneYear();


  // create url object with path and get parameters
  const resultsURL = {
    path: `${CONFIG.API_URL}${CONFIG.API_VERSION_PATH}${
      CONFIG.ENDPOINTS.SCHEDULE
      }`,
    params: {
      teamId: teamID,
      startDate: dateTodayMinusOneYear,
      endDate: dateToday
    }
  };

  // Get latest results from API and process
  fetchJSON(resultsURL, onRequestedLatestResultsResponse);
}

// get highlights from last results
function getHighlights(highlights, index) {
  function onRequestedHighlightsResponse(highlightObject) {

    let eachGame = highlightObject.media.epg[2];

    // check to see if the game has an items array with a length, if not it means highlights not currently available
    if (!eachGame.items.length > 0) {
      const a = createElementWithText("p", "Highlights TBA");
      a.title = "Game Highlights Not Yet Available";
      a.setAttribute("class", "tba-highlight");

      // add the a element to container with correct score
      const highlightContainerNodeIDString = `score-highlight-container-${index}`;
      document.getElementById(highlightContainerNodeIDString).appendChild(a);
    } else {

      // URL of highlights
      let extendedHighlightLink = highlightObject.media.epg[3].items[0].playbacks[3].url;

      // create a link element to hold highlight URL
      const a = createElementWithText("a", "View Highlights");
      a.title = "View game highlights";
      a.setAttribute("target", "_blank");
      a.href = extendedHighlightLink;


      // add the a element to container with correct score
      const highlightContainerNodeIDString = `score-highlight-container-${index}`;
      document.getElementById(highlightContainerNodeIDString).appendChild(a);
    }
  }

  // access api link containing highlights info
  const contentLinkUrl = CONFIG.API_URL + highlights["content"]["link"];

  // Get content from API and process
  fetchJSON(contentLinkUrl, onRequestedHighlightsResponse);
}

// get the right division information and set team name to the DOM title
function getDivisionTableAndSetTeamName(teamID) {
  function onRequestedDivisionTableResponse(divisionTableObject) {
    let divisionNumber;

    // check which division the current team ID belongs to by looping through each
    function checkWhichDivision(teamID, records) {
      for (let e = 0; e < records.length; e++) {
        for (let a = 0; a < records[e].teamRecords.length; a++) {
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

    const divisionTeams = divisionTableObject.records[divisionNumber].teamRecords;
    for (let i = 0; i < divisionTeams.length; i++) {
      // create list node and text, append text to node
      const divisionTeamNameListItem = createElementWithText("li", divisionTeams[i].team.name);
      divisionTeamNameListItem.classList.add('league-stats');

      // create string to grab league placing IDS
      const divisionTableStandingIDString = `division-table-${i + 1}`;

      document.getElementById(divisionTableStandingIDString).appendChild(divisionTeamNameListItem);

      // check if team is the current selected team, add class to parent UL element for styling, also set title to correct team name
      if (divisionTeams[i].team.id == teamID) {
        document.getElementById(divisionTableStandingIDString).className = "currentteam-standing";

        // set team name in DOM title              
        document.title = `${CONFIG.ELEMENTS.TITLE_PRE_TEXT} ${divisionTeams[i].team.name} ${CONFIG.ELEMENTS.TITLE_POST_TEXT}`;
      }

      // add league points to standing table
      function addLeaguePoints(leaguePoints) {
        // create list node and text, append text to node
        const divisionTeamPointsListItem = createElementWithText("li",divisionTeams[i][leaguePoints]);
        divisionTeamPointsListItem.classList.add('league-stats');

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
        const divisionTeamPointsTextNode = document.createTextNode(divisionTeams[i].leagueRecord[leagueStats]);
        divisionTeamPointsListItem.appendChild(divisionTeamPointsTextNode);
        divisionTeamPointsListItem.classList.add('league-stats');

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

// set the select HTML select option to match team ID
function setSelectID(teamID) {
  document.getElementById("team-selector").value = teamID;
}

// reset the DOM ready for next team load
function resetDOM() {

  function resetFixtures(){
    deleteNodeByClassName('fixture-container');
  }

  function resetResults(){
    deleteNodeByClassName('result-container');
  }

  function resetTable(){
    deleteNodeByClassName('league-stats');

    // remove the current team class fr highlighting in table
    var removeClassCurrentTeam = document.getElementsByClassName('currentteam-standing');
    removeClassCurrentTeam[0].classList.remove('currentteam-standing');
  }

  resetFixtures();
  resetResults();
  resetTable();
}

// Initialise the app
function init() {
  // set team ID to select option's value
  const currentTeamSelected = Number(
    document.getElementById("team-selector").value
  );

  // save hash ID of browser URL 
  let hashID = window.location.hash;


  // if select option is not 'select a team' run with that number
  if (currentTeamSelected !== 0) {
    runApp(currentTeamSelected);

    // add the hash to URL, to allow for bookmarking etc
    window.location.hash = currentTeamSelected;
  }

  // If there is hash ID present in URL, use this for team ID
  else if (hashID) {

    // convert ID in url to number (remove the hash)
    teamIDFromHash = convertHashToID(hashID);
    runApp(teamIDFromHash);
  }
  else {
    // run with Canucks as a default
    runApp(23);
    window.location.hash = 23;
  }
}

// Run application
function runApp(teamID) {
  getLatestFixtures(teamID);
  getLatestResults(teamID);
  getDivisionTableAndSetTeamName(teamID);
  updateTeamColours(teamID);
  setSelectID(teamID);
}

// if select is used, reload page and run as usual
function initSelect() {
  resetDOM();
  init();
}

// Trigger running of app when DOM loaded (might not need this event wrapper)
document.addEventListener("DOMContentLoaded", function () {
  init();
});

