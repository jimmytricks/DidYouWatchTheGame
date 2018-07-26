
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
            var game1 = nextGameObject.dates["1"].games["0"];
            var game2 = nextGameObject.dates["2"].games["0"];
            var game3 = nextGameObject.dates["3"].games["0"];
            var game4 = nextGameObject.dates["4"].games["0"];
            var nextFourGames = [game1, game2, game3, game4];
            nextFourGames.forEach(createGameDate);

            debugger;

        }
    };
    nextGame.open("GET", concatApiString, true);
    nextGame.send();
}

getLatestFixtures();