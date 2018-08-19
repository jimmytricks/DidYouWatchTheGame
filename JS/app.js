function getLatestFixtures() {

    // set date to today'a date
    var todaysDateAndTimeObject = new Date();

    // save date in ISO format / makee it a string then cut out time part
    var todaysDateAndTime = todaysDateAndTimeObject.toISOString();
    var todayDate = todaysDateAndTime.substring(0, 10);

    // set vars to concat string based on todays date
    var apiStartString = "https://statsapi.web.nhl.com/api/v1/schedule?teamId=23&startDate=";
    var apiEndString = "&endDate=2019-01-12";
    var concatApiString = apiStartString.concat(todayDate, apiEndString);
    console.log(concatApiString);

    var nextGame = new XMLHttpRequest();
    nextGame.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // parse response into empty object
            var nextGameObject = {};
            nextGameObject = JSON.parse(nextGame.response);

            // get next 4 fixtures
            function createGameDate(game) {

                // format date 
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                var gameDateFormatted = new Date(game.gameDate).toLocaleDateString('en', options);

                // create paragraph elements
                var pNode = document.createElement("p");
                var pNodeFixture = document.createElement("p");

                // create string to go into paragraph elements for both date and fixtures
                var textStringDate = "" + gameDateFormatted;

                var textStringFixture = "" + game.teams.home.team.name + " vs " + game.teams.away.team.name;

                // create text node with date and fixture strings
                var textNodeDate = document.createTextNode(textStringDate);
                var textNodeFixture = document.createTextNode(textStringFixture);

                // add date and fixture text nodes to respective paragraph elements
                pNode.appendChild(textNodeDate);
                pNodeFixture.appendChild(textNodeFixture);

                // create container div
                var gameContainerNode = document.createElement('div');

                // append paragraph elements to container div and add to page
                gameContainerNode.appendChild(pNode);
                gameContainerNode.appendChild(pNodeFixture);
                document.getElementById('next-fixture').appendChild(gameContainerNode);
            }

            // set game variables, run create game date function
            var game1 = nextGameObject.dates["0"].games["0"];
            var game2 = nextGameObject.dates["1"].games["0"];
            var game3 = nextGameObject.dates["2"].games["0"];
            var game4 = nextGameObject.dates["3"].games["0"];
            var nextFourGames = [game1, game2, game3, game4];
            nextFourGames.forEach(createGameDate);
        }
    };
    nextGame.open("GET", concatApiString, true);
    nextGame.send();
}
getLatestFixtures();

// get last 4 results
function getLatestResults() {

    // set date to today'a date
    var todaysDateAndTimeObject = new Date();

    // save date in ISO format / makee it a string then cut out time part
    var todaysDateAndTime = todaysDateAndTimeObject.toISOString();
    var todayDate = todaysDateAndTime.substring(0, 10);

    // set vars to concat string based on todays date
    var apiStartString = "https://statsapi.web.nhl.com/api/v1/schedule?teamId=23&startDate=2018-01-01&endDate=";
    var concatApiString = apiStartString.concat(todayDate);
    console.log(concatApiString);


    var lastGames = new XMLHttpRequest();
    lastGames.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // parse response into empty object
            var lastGameObject = {};
            lastGameObject = JSON.parse(lastGames.response);

            // pass in element plus index for using as html id
            function createGameDate(game, index) {

                // format date 
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                var gameDateFormatted = new Date(game.gameDate).toLocaleDateString('en', options);

                // create paragraph elements
                var pNode = document.createElement("p");
                var pNodeFixture = document.createElement("p");
                var pNodeResult = document.createElement("p");

                // create string to go into paragraph elements for date, fixtures, results
                var textStringDate = "" + gameDateFormatted;

                var textStringResult = ""

                // set vars to use in if statement below
                var canucksID = game.teams.home.team.id;
                var homeTeamScore = game.teams.home.score;
                var awayTeamScore = game.teams.away.score;

                // check for a draw
                if (homeTeamScore === awayTeamScore) {
                    textStringResult = "Draw " + game.teams.home.score + ' - ' + game.teams.away.score;
                }

                // check if home team is the canucks
                if (canucksID == 22) {
                    // if canucks home score more than away, prefix with win if not loss
                    if (homeTeamScore > awayTeamScore) {
                        textStringResult = "Win " + game.teams.home.score + ' - ' + game.teams.away.score;
                    } else {
                        textStringResult = "Loss " + game.teams.home.score + ' - ' + game.teams.away.score;
                    }
                    // if canucks are away team
                } else {
                    // prefix with win if higher score, if not loss
                    if (homeTeamScore < awayTeamScore) {
                        textStringResult = "Win " + game.teams.away.score + ' - ' + game.teams.home.score;
                    } else {
                        textStringResult = "Loss " + game.teams.away.score + ' - ' + game.teams.home.score;
                    }
                }

                var textStringFixture = "" + game.teams.home.team.name + ' vs ' + game.teams.away.team.name;


                // create text node with date and fixture strings
                var textNodeDate = document.createTextNode(textStringDate);
                var textNodeFixture = document.createTextNode(textStringFixture);
                var textStringResult = document.createTextNode(textStringResult);

                // add date and fixture text nodes to respective paragraph elements
                pNode.appendChild(textNodeDate);
                pNodeFixture.appendChild(textNodeFixture);
                pNodeResult.appendChild(textStringResult);

                // add class to score element for styling
                pNodeResult.classList.add("result-score");

                //create container div for result and score, add class and append result to it
                var scoreAndHighlightContainer = document.createElement("div");
                var uniqueContainerID = "score-highlight-container-" + index;
                scoreAndHighlightContainer.setAttribute("id", uniqueContainerID);
                scoreAndHighlightContainer.appendChild(pNodeResult);

                // create container li
                var gameContainerNode = document.createElement('li');

                // append paragraph elements to container li and add to page
                gameContainerNode.appendChild(pNode);
                gameContainerNode.appendChild(pNodeFixture);
                gameContainerNode.appendChild(scoreAndHighlightContainer);


                // add to dynamic html ID using index, then append to LI element
                var gameContainerNodeIDString = "last-fixture-" + index;
                document.getElementById(gameContainerNodeIDString).appendChild(gameContainerNode);
            }

            // get the the last 4 games
            var lastFourGamesArray = lastGameObject.dates;
            lastFourGamesArray = lastFourGamesArray.slice(-4).reverse();

            // set game variables, run create game date function
            var game1 = lastFourGamesArray["0"].games["0"];
            var game2 = lastFourGamesArray["1"].games["0"];
            var game3 = lastFourGamesArray["2"].games["0"];
            var game4 = lastFourGamesArray["3"].games["0"];
            var nextFourGames = [game1, game2, game3, game4];
            nextFourGames.forEach(createGameDate);

            // run get highlights function
            nextFourGames.forEach(getHighlights);
        }
    };
    lastGames.open("GET", concatApiString, true);

    lastGames.send();
}
getLatestResults();



// get highlights from last results
function getHighlights(highlights, index) {

    // access api link containing highlights info
    var getContentLink = 'https://statsapi.web.nhl.com' + highlights['content']['link'];

    var getEachHighlight = new XMLHttpRequest();
    getEachHighlight.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // parse response into empty object
            var highlightObject = {};
            highlightObject = JSON.parse(getEachHighlight.response);

            // get link
            var extendedHighlightLink = highlightObject.media.epg[2].items[0].playbacks[9].url;

            // create a link element to hold highlight URL
            var a = document.createElement('a');
            var aText = document.createTextNode('View Highlights');
            a.appendChild(aText);
            a.title = 'View game highlights';
            a.setAttribute('target', '_blank');
            a.href = extendedHighlightLink;

            // add the a element to container with correct score
            var highlightContainerNodeIDString = "score-highlight-container-" + index;
            document.getElementById(highlightContainerNodeIDString).appendChild(a);

        }
    };
    getEachHighlight.open("GET", getContentLink, true);
    getEachHighlight.send();
};



function getPacificTable() {

    var pacificTable = new XMLHttpRequest();
    pacificTable.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // parse response into empty object
            var pacificTableObject = {};
            pacificTableObject = JSON.parse(pacificTable.response);

            // set var for Pacific division, loop through teams
            var pacificDivisionTeams = pacificTableObject.records[3].teamRecords;
            for (i = 0; i < pacificDivisionTeams.length; i++) {

                // create list node and text, append text to node
                var pacificTeamNameListItem = document.createElement('LI');

                var pacificTeamTextNode = document.createTextNode(pacificDivisionTeams[i].team.name);
                pacificTeamNameListItem.appendChild(pacificTeamTextNode);

                // create string to grab league placing IDS
                var pacificTableStandingIDString = "pacific-table-";

                // increment by one for each league position, force it to a number. Increment one per for loop
                var incrementByOneTogetPosition = 1;
                incrementByOneTogetPosition = incrementByOneTogetPosition + (Number([i]));

                //  append the ID number onto table, add text node
                pacificTableStandingIDString += incrementByOneTogetPosition;
                document.getElementById(pacificTableStandingIDString).appendChild(pacificTeamNameListItem);

                // check if team is the canucks, add class to parent UL element for styling
                if (pacificDivisionTeams[i].team.id == 23) {
                    document.getElementById(pacificTableStandingIDString).className = 'canucks-standing';
                }

                // add league points to standing table
                function addLeaguePoints(leaguePoints) {

                    // create list node and text, append text to node
                    var pacificTeamPointsListItem = document.createElement('LI');
                    var pacificTeamPointsTextNode = document.createTextNode(pacificDivisionTeams[i][leaguePoints]);
                    pacificTeamPointsListItem.appendChild(pacificTeamPointsTextNode);

                    // create string to grab league placing IDS
                    var pacificTableStandingIDString = "pacific-table-";

                    // increment by one for each league position, force it to a number. Increment one per for loop
                    var incrementByOneTogetPosition = 1;
                    incrementByOneTogetPosition = incrementByOneTogetPosition + (Number([i]));

                    //  append the ID number onto table, add text node
                    pacificTableStandingIDString += incrementByOneTogetPosition;
                    document.getElementById(pacificTableStandingIDString).appendChild(pacificTeamPointsListItem);
                }

                addLeaguePoints('points');

                //  add league stats, wins, losses and OT to table
                function addLeagueStats(leagueStats) {

                    // create list node and text, append text to node
                    var pacificTeamPointsListItem = document.createElement('LI');
                    var pacificTeamPointsTextNode = document.createTextNode(pacificDivisionTeams[i].leagueRecord[leagueStats]);
                    pacificTeamPointsListItem.appendChild(pacificTeamPointsTextNode);

                    // create string to grab league placing IDS
                    var pacificTableStandingIDString = "pacific-table-";

                    // increment by one for each league position, force it to a number. Increment one per for loop
                    var incrementByOneTogetPosition = 1;
                    incrementByOneTogetPosition = incrementByOneTogetPosition + (Number([i]));

                    //  append the ID number onto table, add text node
                    pacificTableStandingIDString += incrementByOneTogetPosition;
                    document.getElementById(pacificTableStandingIDString).appendChild(pacificTeamPointsListItem);
                }

                addLeagueStats('wins');
                addLeagueStats('losses');
                addLeagueStats('ot');
            }
        }
    }

    pacificTable.open("GET", 'https://statsapi.web.nhl.com/api/v1/standings/byDivision', true);
    pacificTable.send();
}

getPacificTable();