const express = require("express")
const bodyParser = require("body-parser")
const https = require("https");
const moment = require("moment-timezone");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let city = "City";
let temp = "";
let description = "description";
let wind = "wind";
let humidity = "humidity";
let icon = "";
let imageUrl = "";
let sunrise = "";
app.get("/", function(req, res) {

    // 
    let firstLetter = city.charAt(0).toUpperCase();
    let remainingLetters = city.slice(1);
    let capitalizedCity = firstLetter + remainingLetters;
    let date = new Date(sunrise * 1000);
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2);
    sunrise = formattedTime
    // res.render("weather");
    res.render("weather", {
        cityName : capitalizedCity, 
        temperature : temp, 
        desc : description,
        windSpeed : wind,
        humidityIntheAir : humidity,
        weatherImage : imageUrl,
        sunrise : sunrise
    });
})

app.post("/", function(req, res) {
    city = req.body.city; 
    const apiKey = "2e6cb9bfbb456491dcabc954b9143e7f";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid="+apiKey+"";
    https.get(url, function(response) {
        response.on("data", function(d) {
            const weatherData = JSON.parse(d);
            temp = Math.floor(weatherData.main.temp);
            description = weatherData.weather[0].description;
            wind = weatherData.wind.speed;
            humidity = weatherData.main.humidity;
            icon = weatherData.weather[0].icon;
            sunrise = weatherData.sys.sunrise;
            imageUrl = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
        })
        res.redirect("/")
        
    })
    
})
app.listen(process.env.port || 4000, function(req, res) {
    console.log("Server started running on port 4000");
})