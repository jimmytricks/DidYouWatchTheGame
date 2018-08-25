const CONFIG = {
    API_URL: "https://statsapi.web.nhl.com/",
    API_VERSION_PATH: "api/v1/",
    ENDPOINTS: {
        SCHEDULE: "schedule",
        STANDINGS_BY_DIVISION: "standings/byDivision"
    }
}

// Returns the current date in the format yyyy-dd-mm
function getCurrentDateForUrl() {
    const now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1; // January is 0!
    const yyyy = now.getFullYear();

    // Add leading zeros if day or month is below 10
    if (dd < 10) { dd = `0${dd}`; }
    if (mm < 10) { mm = `0${mm}`; }

    return `${yyyy}-${mm}-${dd}`;
}

// Log request response error
function logError(error) {
    console.error('Looks like there was a problem: \n', error);
}

// Validate request response
function validateResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// Process the response and return JSON
function readResponseAsJSON(response) {
    return response.json();
}

// Perform fetch of a provided URL and executes callback function on completion
function fetchJSON(pathToResource, callback) {
    fetch(pathToResource)
        .then(validateResponse)
        .then(readResponseAsJSON)
        .then(callback)
        .catch(logError);
}

// Get latest fixtures
function getLatestFixtures(teamID) {
    function onRequestedPreviousFixtures(result) {
        if (!result) { return; }
        let nextGameObject = result

        // get next 4 fixtures
        function createGameDate(game) {
            // format date 
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            const gameDateFormatted = new Date(game.gameDate).toLocaleDateString('en', options);

            // create paragraph elements
            const pNode = document.createElement("p");
            const pNodeFixture = document.createElement("p");

            // create string to go into paragraph elements for both date and fixtures
            const textStringDate = "" + gameDateFormatted;

            const textStringFixture = "" + game.teams.home.team.name + " vs " + game.teams.away.team.name;

            // create text node with date and fixture strings
            const textNodeDate = document.createTextNode(textStringDate);
            const textNodeFixture = document.createTextNode(textStringFixture);

            // add date and fixture text nodes to respective paragraph elements
            pNode.appendChild(textNodeDate);
            pNodeFixture.appendChild(textNodeFixture);

            // create container div
            const gameContainerNode = document.createElement('div');

            // append paragraph elements to container div and add to page
            gameContainerNode.appendChild(pNode);
            gameContainerNode.appendChild(pNodeFixture);
            document.getElementById('next-fixture').appendChild(gameContainerNode);
        }

        // set game variables, run create game date function
        const game1 = nextGameObject.dates["0"].games["0"];
        const game2 = nextGameObject.dates["1"].games["0"];
        const game3 = nextGameObject.dates["2"].games["0"];
        const game4 = nextGameObject.dates["3"].games["0"];
        const nextFourGames = [game1, game2, game3, game4];
        nextFourGames.forEach(createGameDate);
    };

    // set date to today's date
    const dateToday = getCurrentDateForUrl();

    // create url string (TODO: Add params support to fetchJSON to avoid param concatenation)
    const fixturesURL = `${CONFIG.API_URL}${CONFIG.API_VERSION_PATH}${CONFIG.ENDPOINTS.SCHEDULE}?teamId=${teamID}&startDate=${dateToday}&endDate=2019-01-12`

    fetchJSON(fixturesURL, onRequestedPreviousFixtures);
}

// get last 4 results
function getLatestResults(teamID) {
    function onRequestedLatestResults(result) {
        let lastGameObject = result;

        // pass in element plus index for using as html id
        function createGameDate(game, index) {
            // format date 
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            const gameDateFormatted = new Date(game.gameDate).toLocaleDateString('en', options);

            // create paragraph elements
            const pNode = document.createElement("p");
            const pNodeFixture = document.createElement("p");
            const pNodeResult = document.createElement("p");

            // create string to go into paragraph elements for date, fixtures, results
            const textStringDate = "" + gameDateFormatted;

            let textStringResult = ""

            // set vars to use in if statement below
            const hockeyTeamID = game.teams.home.team.id;
            const homeTeamScore = game.teams.home.score;
            const awayTeamScore = game.teams.away.score;

            // check for a draw
            if (homeTeamScore === awayTeamScore) {
                textStringResult = "Draw " + game.teams.home.score + ' - ' + game.teams.away.score;
            }

            // check if home team is the current team
            if (hockeyTeamID == teamID) {
                // if current team home score more than away, prefix with win if not loss
                if (homeTeamScore > awayTeamScore) {
                    textStringResult = "Win " + game.teams.home.score + ' - ' + game.teams.away.score;
                } else {
                    textStringResult = "Loss " + game.teams.home.score + ' - ' + game.teams.away.score;
                }
                // if current team are away team
            } else {
                // prefix with win if higher score, if not loss
                if (homeTeamScore < awayTeamScore) {
                    textStringResult = "Win " + game.teams.away.score + ' - ' + game.teams.home.score;
                } else {
                    textStringResult = "Loss " + game.teams.away.score + ' - ' + game.teams.home.score;
                }
            }

            const textStringFixture = "" + game.teams.home.team.name + ' vs ' + game.teams.away.team.name;

            // create text node with date and fixture strings
            const textNodeDate = document.createTextNode(textStringDate);
            const textNodeFixture = document.createTextNode(textStringFixture);
            const textStringEndResult = document.createTextNode(textStringResult);

            // add date and fixture text nodes to respective paragraph elements
            pNode.appendChild(textNodeDate);
            pNodeFixture.appendChild(textNodeFixture);
            pNodeResult.appendChild(textStringEndResult);

            // add class to score element for styling
            pNodeResult.classList.add("result-score");

            //create container div for result and score, add class and append result to it
            const scoreAndHighlightContainer = document.createElement("div");
            const uniqueContainerID = "score-highlight-container-" + index;
            scoreAndHighlightContainer.setAttribute("id", uniqueContainerID);
            scoreAndHighlightContainer.appendChild(pNodeResult);

            // create container li
            const gameContainerNode = document.createElement('li');

            // append paragraph elements to container li and add to page
            gameContainerNode.appendChild(pNode);
            gameContainerNode.appendChild(pNodeFixture);
            gameContainerNode.appendChild(scoreAndHighlightContainer);


            // add to dynamic html ID using index, then append to LI element
            const gameContainerNodeIDString = "last-fixture-" + index;
            document.getElementById(gameContainerNodeIDString).appendChild(gameContainerNode);
        }

        // get the the last 4 games
        let lastFourGamesArray = lastGameObject.dates;
        lastFourGamesArray = lastFourGamesArray.slice(-4).reverse();

        // set game variables, run create game date function
        const game1 = lastFourGamesArray["0"].games["0"];
        const game2 = lastFourGamesArray["1"].games["0"];
        const game3 = lastFourGamesArray["2"].games["0"];
        const game4 = lastFourGamesArray["3"].games["0"];
        const nextFourGames = [game1, game2, game3, game4];
        nextFourGames.forEach(createGameDate);

        // run get highlights function
        nextFourGames.forEach(getHighlights);
    };

    // set date to today's date
    const dateToday = getCurrentDateForUrl();

    // create url string (TODO: Add params support to fetchJSON to avoid param concatenation)
    const resultsURL = `${CONFIG.API_URL}${CONFIG.API_VERSION_PATH}${CONFIG.ENDPOINTS.SCHEDULE}?teamId=${teamID}&startDate=2018-01-01&endDate=${dateToday}`

    // Get latest results from API and process
    fetchJSON(resultsURL, onRequestedLatestResults);
}

// get highlights from last results
function getHighlights(highlights, index) {
    function onRequestedHighlights(result) {
        let highlightObject = result;

        // get link
        const extendedHighlightLink = highlightObject.media.epg[2].items[0].playbacks[9].url;

        // create a link element to hold highlight URL
        const a = document.createElement('a');
        const aText = document.createTextNode('View Highlights');
        a.appendChild(aText);
        a.title = 'View game highlights';
        a.setAttribute('target', '_blank');
        a.href = extendedHighlightLink;

        // add the a element to container with correct score
        const highlightContainerNodeIDString = "score-highlight-container-" + index;
        document.getElementById(highlightContainerNodeIDString).appendChild(a);
    };

    // access api link containing highlights info
    const contentLinkUrl = CONFIG.API_URL + highlights['content']['link'];

    // Get content from API and process
    fetchJSON(contentLinkUrl, onRequestedHighlights);
};

function getDivisionTable(teamID) {
    function onRequestedDivisionTable(result) {
        let divisionTableObject = result;
        let divisionNumber;

        // check which division the current team ID belongs to by looping through each
        function checkWhichDivision(teamID) {
            for (e = 0; e < divisionTableObject.records.length; e++) {
                for (a = 0; a < divisionTableObject.records[e].teamRecords.length; a++) {
                    if (teamID === divisionTableObject.records[e].teamRecords[a].team.id) {
                        document.getElementById('division-table-name').innerText = divisionTableObject.records[e].division.name;

                        // set division number to the iteration / index of correct array
                        divisionNumber = e;

                        // if division is central, remove 8th place from table
                        if (divisionNumber == 2) {
                            const hideExtraDivPosition = document.getElementById('division-table-8');
                            hideExtraDivPosition.style.display = 'none';
                        }
                    }
                }
            }
        }
        checkWhichDivision(teamID);

        const divisionTeams = divisionTableObject.records[divisionNumber].teamRecords;
        for (i = 0; i < divisionTeams.length; i++) {

            // create list node and text, append text to node
            const divisionTeamNameListItem = document.createElement('LI');

            const divisionTeamTextNode = document.createTextNode(divisionTeams[i].team.name);
            divisionTeamNameListItem.appendChild(divisionTeamTextNode);

            // create string to grab league placing IDS
            let divisionTableStandingIDString = "division-table-";

            // increment by one for each league position, force it to a number. Increment one per for loop
            let incrementByOneTogetPosition = 1;
            incrementByOneTogetPosition = incrementByOneTogetPosition + (Number([i]));

            //  append the ID number onto table, add text node
            divisionTableStandingIDString += incrementByOneTogetPosition;
            document.getElementById(divisionTableStandingIDString).appendChild(divisionTeamNameListItem);

            // check if team is the canucks, add class to parent UL element for styling
            if (divisionTeams[i].team.id == teamID) {
                document.getElementById(divisionTableStandingIDString).className = 'currentteam-standing';
            }

            // add league points to standing table
            function addLeaguePoints(leaguePoints) {

                // create list node and text, append text to node
                const divisionTeamPointsListItem = document.createElement('LI');
                const divisionTeamPointsTextNode = document.createTextNode(divisionTeams[i][leaguePoints]);
                divisionTeamPointsListItem.appendChild(divisionTeamPointsTextNode);

                // create string to grab league placing IDS
                let divisionTableStandingIDString = "division-table-";

                // increment by one for each league position, force it to a number. Increment one per for loop
                let incrementByOneTogetPosition = 1;
                incrementByOneTogetPosition = incrementByOneTogetPosition + (Number([i]));

                //  append the ID number onto table, add text node
                divisionTableStandingIDString += incrementByOneTogetPosition;
                document.getElementById(divisionTableStandingIDString).appendChild(divisionTeamPointsListItem);
            }

            addLeaguePoints('points');

            //  add league stats, wins, losses and OT to table
            function addLeagueStats(leagueStats) {

                // create list node and text, append text to node
                const divisionTeamPointsListItem = document.createElement('LI');
                const divisionTeamPointsTextNode = document.createTextNode(divisionTeams[i].leagueRecord[leagueStats]);
                divisionTeamPointsListItem.appendChild(divisionTeamPointsTextNode);

                // create string to grab league placing IDS
                let divisionTableStandingIDString = "division-table-";

                // increment by one for each league position, force it to a number. Increment one per for loop
                let incrementByOneTogetPosition = 1;
                incrementByOneTogetPosition = incrementByOneTogetPosition + (Number([i]));

                //  append the ID number onto table, add text node
                divisionTableStandingIDString += incrementByOneTogetPosition;
                document.getElementById(divisionTableStandingIDString).appendChild(divisionTeamPointsListItem);
            }

            addLeagueStats('wins');
            addLeagueStats('losses');
            addLeagueStats('ot');
        }
    }

    // Create URL string
    let divisionTableURL = `${CONFIG.API_URL}${CONFIG.API_VERSION_PATH}${CONFIG.ENDPOINTS.STANDINGS_BY_DIVISION}`

    // Get division table data from API
    fetchJSON(divisionTableURL, onRequestedDivisionTable);
}

// Reset the DOM for app re-initialisation
function resetInfo() {
    // function to reset the values to default
}

// Initialise the app using the currently selected team
function init() {
    const currentTeamSelected = Number(document.getElementById("team-selector").value);
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
document.addEventListener('DOMContentLoaded', function () {
    init();
});
