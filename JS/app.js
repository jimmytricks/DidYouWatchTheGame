var nextGame = new XMLHttpRequest();
nextGame.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       
       document.getElementById("next-fixture").innerHTML = nextGame.responseText;
    }
};
nextGame.open("GET", "https://statsapi.web.nhl.com/api/v1/schedule?teamId=30&startDate=2018-01-09&endDate=2018-01-12", true);
nextGame.send();