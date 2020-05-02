const storage = require('electron-json-storage');
const { remote } = require('electron')
var path = require('path');

//body and content
const body = document.getElementById("body");
const content = document.getElementById("content");

//top left declaration
const currentLogo = document.getElementById("currentLogo");
const currentTemp = document.getElementById("currentTemp");
const currentUnit = document.getElementById("unit");
const currentDescription = document.getElementById("currentDescription");
const currentSensation = document.getElementById("currentSensation");

//top right declaration
const clock = document.getElementById("clock");
const date = document.getElementById("date");
const userLocation = document.getElementById("location");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

//main declaration
const todayMin = document.getElementById("todayMin");
const todayMax = document.getElementById("todayMax");
const todayWindSpeed = document.getElementById("todayWindSpeed");
const todayWindDirection = document.getElementById("todayWindDirection");
const todayUV = document.getElementById("todayUV");
const WindIco = document.getElementById("WindIco");

//left footer
const leftSection = document.getElementById("leftSection");

//right footer
const rightSection = document.getElementById("rightSection");

//redirect to settings folder
function goToSettings() {
    remote.getCurrentWindow().loadURL(path.join(__dirname, "settings.html"))
}

//set body background
body.style.backgroundImage = "url(../assets/background/" + Math.floor(Math.random() * 6) + ".jpg)"

//get stored data
storage.getAll(function (error, userConfig) {
    if (error) throw error;

    //configure key to the api url
    const key = "2121930d28af1097379d4ef7f8fff457";
    const lat = userConfig.coords.lat;
    const lon = userConfig.coords.lon;
    const lang = userConfig.settings.city.split(", ")[1];
    const units = userConfig.settings.tempMeasure;
    const unit = (units === "metric") ? "C" : "F";
    const url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&lang=" + lang + "&units=" + units + "&appid=" + key;

    //reload data
    update()
    function update() {
        //fetch api data
        fetch(url)
            .then(resp => resp.json())
            .then(function (data) {

                //set top left
                currentLogo.src = "../assets/icons/" + data.current.weather[0].icon + ".svg";
                currentTemp.innerHTML = Math.round(data.current.temp);
                currentUnit.innerHTML = "º" + unit;
                currentDescription.innerHTML = data.current.weather[0].description;
                currentSensation.innerHTML = Math.round(data.current.feels_like) + "º";

                //set top right
                startTime()
                function startTime() {
                    const today = new Date();
                    //clock
                    let h = today.getHours();
                    let m = today.getMinutes();
                    let s = today.getSeconds();
                    m = checkTime(m);
                    s = checkTime(s);
                    clock.innerHTML = h + ":" + m + ":" + s;
                    //date
                    const weekday = today.toLocaleString('default', { weekday: 'long' });
                    const day = today.getDate();
                    const month = today.toLocaleString('default', { month: 'long' });
                    const year = today.getFullYear();
                    date.innerHTML = weekday + "," + day + " " + month + " " + year;

                    const t = setTimeout(startTime, 500);
                }
                function checkTime(i) {
                    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
                    return i;
                }
                //location
                userLocation.innerHTML = userConfig.settings.city;

                //sunrise
                const sunriseUnix = new Date(data.current.sunrise * 1000);
                const sunriseHours = sunriseUnix.getHours();
                const sunriseHoursMinutes = "0" + sunriseUnix.getMinutes();
                const sunriseHoursSeconds = "0" + sunriseUnix.getSeconds();

                sunrise.innerHTML = sunriseHours + ':' + sunriseHoursMinutes.substr(-2) + ':' + sunriseHoursSeconds.substr(-2);

                //sunset
                const sunsetUnix = new Date(data.current.sunset * 1000);
                const sunsetHours = sunsetUnix.getHours();
                const sunsetHoursMinutes = "0" + sunsetUnix.getMinutes();
                const sunsetHoursSeconds = "0" + sunsetUnix.getSeconds();

                sunset.innerHTML = sunsetHours + ':' + sunsetHoursMinutes.substr(-2) + ':' + sunsetHoursSeconds.substr(-2);

                //set main section
                todayMin.innerHTML = Math.round(data.daily[0].temp.min) + "º";
                todayMax.innerHTML = Math.round(data.daily[0].temp.max) + "º";

                if (unit === "C") {
                    todayWindSpeed.innerHTML = Math.round(data.daily[0].wind_speed * 3.6) + " Km/h";
                } else {
                    todayWindSpeed.innerHTML = Math.round(data.daily[0].wind_speed) + " M/h";
                }

                //wind direction 
                let windDirection = data.daily[0].wind_deg;
                if (windDirection <= 45 || windDirection >= 315) {
                    //north
                    WindIco.src = "../assets/UI/Wnorth.svg"
                } else if (windDirection > 45 && windDirection < 135) {
                    //east
                    WindIco.src = "../assets/UI/Weast.svg"
                } else if (windDirection >= 135 && windDirection <= 225) {
                    //south
                    WindIco.src = "../assets/UI/Wsouth.svg"
                } else {
                    //weast
                    WindIco.src = "../assets/UI/Wweast.svg"
                }
                todayWindDirection.innerHTML = windDirection + "º";

                todayUV.innerHTML = data.daily[0].uvi

                //set hourly time update in footer left section
                let leftString = "";
                for (a = 2; a < 13; a += 2) {
                    let Lefthour = ("0" + new Date(data.hourly[a].dt * 1000).getHours()).slice(-2) + ":00";
                    let leftTemp = Math.round(data.hourly[a].temp) + "º" + unit;
                    let leftIco = data.hourly[a].weather[0].icon

                    leftString += '<div class="row"><div class="time">' + Lefthour + '</div><div class="temp-info"><div class="temp">' + leftTemp + '</div><img src="../assets/icons/' + leftIco + '.svg" alt="" /></div></div>'
                }
                leftSection.innerHTML = leftString;

                //set daily update i footer right section
                let rightString = "";
                for (let b = 1; b <= 5; b++) {
                    let rightWeekday = new Date(data.daily[b].dt * 1000).toLocaleString('default', { weekday: 'long' }).substring(0, 3);
                    let rightIco = data.daily[b].weather[0].icon;
                    let rightMax = Math.round(data.daily[b].temp.max);
                    let rightMin = Math.round(data.daily[b].temp.min);
                    rightString += '<div class="box"><div class="day" >' + rightWeekday + '</div ><img src="../assets/icons/' + rightIco + '.svg" alt="" /><div class="max-min">' + rightMax + 'º - ' + rightMin + 'º</div></div> '
                }
                rightSection.innerHTML = rightString;

                content.style.display = "initial"
            });

    }//end of update
    //30min update
    timerId = setInterval(update, 1800000);
});

