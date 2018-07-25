
// set date to today'a date
var todaysDateAndTimeObject = new Date();
var todaysDateAndTime = todaysDateAndTimeObject.toISOString();
var todayDate = todaysDateAndTime.substring(0,10);
console.log(todayDate);


var apiStartString = "https://statsapi.web.nhl.com/api/v1/schedule?teamId=30&startDate=";
var apiEndString = "&endDate=2019-01-12";
var concatApiString = apiStartString.concat(todayDate, apiEndString);
console.log(concatApiString);

var nextGame = new XMLHttpRequest();
nextGame.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       




       document.getElementById("next-fixture").innerHTML = nextGame.responseText;
    }
};
nextGame.open("GET", concatApiString, true);
nextGame.send();