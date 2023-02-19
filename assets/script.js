// API Key:
var APIKey = "e0eb50d18300e0e9f4c2b8a9758ede2a";

var cityFormEl = document.querySelector("#user-form");
cityFormEl.addEventListener("submit", citySearch);
var cityListEl = document.querySelector("#cityList");

function citySearch(event){
  event.preventDefault();
  console.log("the submit button has been clicked");

  var cityName = document.querySelector("#cityName").value;

  if (cityName) {
    getLonLat(cityName);
  } else {
    alert('Please enter a City Name')
  }
}

//Function to get the lon and lat data for the later API call.
var getLonLat = function(cityName) {
  console.log(cityName);
  var locationRequest = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + APIKey;

  fetch(locationRequest)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      console.log(`Found ${data.length} potential matches:`);
      console.log(data);
      displayCities(data);
    })
    .catch(error => {
      console.log(error);
    });
}

var displayCities = function(data) {

for (var i = 0; i < data.length; i++) {
  var city = data[i].name;
  var state = data[i].state || "";
  var country = data[i].country;
  var lat = data[i].lat;
  var lon = data[i].lon;

  var cityEl = document.createElement("div");
  cityEl.classList = "list-item flex-row justify-space-between align-center";
  var cityElText =
    city + "/" + state + "/" + country + "/" + lat + "/" + lon;
  cityEl.textContent = cityElText;

  
  cityEl.addEventListener("click", function() {
    var latLon = this.textContent.split("/");
    getCurrentWeather(latLon[3], latLon[4]);
    getFutureWeather(latLon[3], latLon[4]);
  });

  cityListEl.appendChild(cityEl);
}
}

//Current Weather Data:
https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

var getCurrentWeather = function(lat, lon) {
  var currentWeatherRequest = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + APIKey;

  fetch(currentWeatherRequest)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Display weather data
    })
    .catch(error => {
      console.log(error);
    });
}

//5-day forecast data:
var getFutureWeather = function(lat, lon) {
  var futureWeatherRequest = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + APIKey;

  fetch(futureWeatherRequest)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Display weather data
    })
    .catch(error => {
      console.log(error);
    });
}

