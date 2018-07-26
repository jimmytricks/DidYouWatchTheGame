
function getLatestFixtures(){

// set date to today'a date
var todaysDateAndTimeObject = new Date();

// save date in ISO format / makee it a string then cut out time part
var todaysDateAndTime = todaysDateAndTimeObject.toISOString();
var todayDate = todaysDateAndTime.substring(0,10);

// set vars to concat string based on todays date
var apiStartString = "https://statsapi.web.nhl.com/api/v1/schedule?teamId=23&startDate=";
var apiEndString = "&endDate=2019-01-12";
var concatApiString = apiStartString.concat(todayDate, apiEndString);
console.log(concatApiString);

var nextGame = new XMLHttpRequest();
nextGame.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // parse response into empty object
        var nextGameObject = {};
        nextGameObject = JSON.parse(nextGame.response);

        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};

        // set date and format to local time
        function createGameDate(game){
            var nextGameLocalDate = new Date(game).toLocaleDateString('en', options);
             // set local date
             console.log(game.gameDate)
            // document.getElementById("next-date").innerHTML = nextGameLocalDate;
            var liNode = document.createElement("li");
            var listTextString = "";
            listTextString += game.gameDate;
            listTextString += game.teams.home.team.name;
            listTextString += " vs ";
            listTextString += game.teams.away.team.name;
            
            var liTextNode = document.createTextNode(listTextString);
            liNode.appendChild(liTextNode);
            document.getElementById('next-fixture').appendChild(liNode);

            
        }
       
        
        // createGameDate(nextGameObject.dates["0"].games["0"].gameDate, options);
        var game1 = nextGameObject.dates["1"].games["0"];
        var game2 = nextGameObject.dates["2"].games["0"];
        var game3 = nextGameObject.dates["3"].games["0"];
        var game4 = nextGameObject.dates["4"].games["0"];
        var remainingNextFourGames = [game1,game2,game3,game4];

        remainingNextFourGames.forEach(createGameDate);

        // set opponents
        document.getElementById("next-home").innerHTML = nextGameObject.dates["0"].games["0"].teams.home.team.name;
        document.getElementById("next-away").innerHTML = nextGameObject.dates["0"].games["0"].teams.away.team.name;

        debugger;


    //    document.getElementById("next-fixture").innerHTML = nextGame.responseText;
    }
};
nextGame.open("GET", concatApiString, true);
nextGame.send();
}

getLatestFixtures();