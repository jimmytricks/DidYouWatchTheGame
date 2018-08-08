
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
                var liNode = document.createElement("p");
                var liNodeFixture = document.createElement("p");

                // create string to go into paragraph elements for both date and fixtures
                var listTextStringDate = "";
                listTextStringDate += gameDateFormatted;

                var listTextStringFixture = "";
                listTextStringFixture += game.teams.home.team.name;
                listTextStringFixture += " vs ";
                listTextStringFixture += game.teams.away.team.name;

                // create text node with date and fixture strings
                var liTextNodeDate = document.createTextNode(listTextStringDate);
                var liTextNodeFixture = document.createTextNode(listTextStringFixture);

                // add date and fixture text nodes to respective paragraph elements
                liNode.appendChild(liTextNodeDate);
                liNodeFixture.appendChild(liTextNodeFixture);

                // create container div
                var gameContainerNode = document.createElement('div');

                // append paragraph elements to container div and add to page
                gameContainerNode.appendChild(liNode);
                gameContainerNode.appendChild(liNodeFixture);
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

            // define a last fixture counter, starting on 1 to match html element
            var lastFixtureCounter = 1;

            function createGameDate(game) {

                // increment by one each time it loops
                lastFixtureCounter + 1;
            

                // format date 
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                var gameDateFormatted = new Date(game.gameDate).toLocaleDateString('en', options);

                // create paragraph elements
                var liNode = document.createElement("p");
                var liNodeFixture = document.createElement("p");
                var liNodeResult = document.createElement("p");

                // create string to go into paragraph elements for both date and fixtures
                var listTextStringDate = "";
                listTextStringDate += gameDateFormatted;

                var listTextStringFixture = "";
                listTextStringFixture += game.teams.home.team.name;
                listTextStringFixture += " vs ";
                listTextStringFixture += game.teams.away.team.name;

                var listTextStringResult = "";
                listTextStringResult += game.teams.home.score;
                listTextStringResult += " - ";
                listTextStringResult += game.teams.away.score;

                // create text node with date and fixture strings
                var liTextNodeDate = document.createTextNode(listTextStringDate);
                var liTextNodeFixture = document.createTextNode(listTextStringFixture);
                var liTextStringResult = document.createTextNode(listTextStringResult);

                // add date and fixture text nodes to respect paragraph elements
                liNode.appendChild(liTextNodeDate);
                liNodeFixture.appendChild(liTextNodeFixture);
                liNodeResult.appendChild(liTextStringResult);

                // create container div
                var gameContainerNode = document.createElement('li');

                // append paragraph elements to container div and add to page
                gameContainerNode.appendChild(liNode);
                gameContainerNode.appendChild(liNodeFixture);
                gameContainerNode.appendChild(liNodeResult);

                // create string to grab league placing IDS                
                var gameContainerNodeIDString = "last-fixture-" + (Number(lastFixtureCounter));               
                document.getElementById(gameContainerNodeIDString).appendChild(gameContainerNode);
            }

            
            var lastFiveGamesArray = lastGameObject.dates;
            lastFiveGamesArray = lastFiveGamesArray.slice(-5).reverse();
            // set game variables, run create game date function
            var game1 = lastFiveGamesArray["0"].games["0"];
            var game2 = lastFiveGamesArray["1"].games["0"];
            var game3 = lastFiveGamesArray["2"].games["0"];
            var game4 = lastFiveGamesArray["3"].games["0"];
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

// set highlight counter to select correct html element
var lastHighlightCounter = 0;

// get highlights from last results
function getHighlights(highlights) {

    // access api link containing highlights info
    var getContentLink = 'https://statsapi.web.nhl.com' + highlights['content']['link'];

    // increment counter so each highlight is in correct list item
    

    var getEachHighlight = new XMLHttpRequest();
    getEachHighlight.onreadystatechange = function () {
        lastHighlightCounter + 1;
        if (this.readyState == 4 && this.status == 200) {
            // parse response into empty object
            var highlightObject = {};
            highlightObject = JSON.parse(getEachHighlight.response);
            
            var extendedHighlightLink = highlightObject.media.epg[2].items[0].playbacks[9].url;

            var liHighlightNode = document.createTextNode(extendedHighlightLink);
            var liHighlightLINode = document.createElement('li');        

            var highlightContainerNodeIDString = "last-fixture-" + (Number(lastHighlightCounter));
            debugger;
            liHighlightLINode.appendChild(liHighlightNode);
          
                document.getElementById(highlightContainerNodeIDString).appendChild(liHighlightLINode);
           
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

                // check if team is the canucks, if so add class
                if (pacificDivisionTeams[i].team.id == 23) {
                    pacificTeamNameListItem.className = 'canucks-standing';
                }

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