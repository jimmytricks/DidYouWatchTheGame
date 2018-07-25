
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

        // set date and format to local time
        var nextGameLocalDate = new Date(nextGameObject.dates["0"].games["0"].gameDate)
        nextGameLocalDate.toLocaleDateString();
        
        // set local date
        document.getElementById("next-date").innerHTML = nextGameLocalDate;

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