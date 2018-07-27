
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

                // add date and fixture text nodes to respect paragraph elements
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

                // add date and fixture text nodes to respect paragraph elements
                liNode.appendChild(liTextNodeDate);
                liNodeFixture.appendChild(liTextNodeFixture);

                // create container div
                var gameContainerNode = document.createElement('div');

                // append paragraph elements to container div and add to page
                gameContainerNode.appendChild(liNode);
                gameContainerNode.appendChild(liNodeFixture);
                document.getElementById('last-fixtures').appendChild(gameContainerNode);
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
        }
    };
    lastGames.open("GET", concatApiString, true);
    lastGames.send();
}

getLatestResults();



function getPacificTable() {

    var pacificTable = new XMLHttpRequest();
    pacificTable.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // parse response into empty object
            var pacificTableObject = {};
            pacificTableObject = JSON.parse(pacificTable.response);

            // set var for Pacific division, loop through teams
            var pacificDivisionTeams = pacificTableObject.records[3].teamRecords;                
            for (i = 0; i < pacificDivisionTeams.length; i++){
                console.log (pacificDivisionTeams[i]);

                // create list node and text 
                var pacificTeamNameListItem = document.createElement('li');
                var pacificTeamTextNode = document.createTextNode(pacificDivisionTeams[i].team.name);
                console.log(pacificTeamTextNode);
                pacificTeamNameListItem.appendChild(pacificTeamTextNode);
                var pacificTableStandingIDString = "pacific-table-";
                var incrementByOneTogetPosition = 1;
                incrementByOneTogetPosition = incrementByOneTogetPosition + (Number([i]));
                debugger;
                pacificTableStandingIDString += incrementByOneTogetPosition;
                console.log(pacificTableStandingIDString);
                document.getElementById(pacificTableStandingIDString).appendChild(pacificTeamTextNode);

                // check if team is the canucks
                if (pacificDivisionTeams[i].team.id == 23 ){
                    console.log(pacificDivisionTeams[i].team.name)
                }
            }


            // pacificTableObject > teamRecords (loop through this array) > check if team > ID is canucks, if so append certain class. 
            // Then log games played, total points. Then log > leagueRecord > wins, losses, OT

            debugger;
        }
    }

    pacificTable.open("GET", 'https://statsapi.web.nhl.com/api/v1/standings/byDivision', true);
    pacificTable.send();
}

getPacificTable();