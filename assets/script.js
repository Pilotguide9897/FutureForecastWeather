// API Key:
var APIKey = "e0eb50d18300e0e9f4c2b8a9758ede2a";

var cityFormEl = document.querySelector("#user-form");
cityFormEl.addEventListener("submit", citySearch);
const weatherNetwork = document.getElementById("wrapper");
const fiveDayForecastDiv = document.getElementById("fiveDayForecast");
var currentForecastDiv = document.getElementById('currentForecast');
var localStorageReset = document.getElementById('clearLocalStorage');
var savedSearchButtonsEl = document.getElementById('savedSearchButtons');

function citySearch(event){
  event.preventDefault();
  console.log("the submit button has been clicked");

  var cityName = document.querySelector("#cityName").value;
  var countryCode = document.querySelector("#countryCode").value;
  var stateCode = document.querySelector("#stateCode").value;

  if (cityName) {
    getCurrentWeather(cityName, countryCode, stateCode);
    getFutureWeather(cityName, countryCode, stateCode);
  } else {
    alert('Please enter a City Name')
  }
}

// Save search information to local storage.
function saveSearchHistory(cityName, countryCode, stateCode) {
  var searchInfo = { cityName, countryCode, stateCode };
  var savedSearches = JSON.parse(localStorage.getItem("savedSearches")) || [];
  savedSearches.push(searchInfo);
  localStorage.setItem("savedSearches", JSON.stringify(savedSearches));
}

// Create button element for saved search.
function createSavedSearchButton(cityName, countryCode, stateCode) {
  var buttonEl = document.createElement("button");
  buttonEl.textContent = `${cityName}, ${countryCode}, ${stateCode}`;
  buttonEl.addEventListener("click", function() {
    getCurrentWeather(cityName, countryCode, stateCode);
    getFutureWeather(cityName, countryCode, stateCode);
  });
  return buttonEl;
}

// Render saved search buttons
function renderSavedSearches() {
  var savedSearches = JSON.parse(localStorage.getItem("savedSearches")) || [];
  var savedSearchButtonsEl = document.querySelector("#savedSearchButtons");
  savedSearchButtonsEl.innerHTML = "";
  savedSearches.forEach(function(searchInfo) {
    var buttonEl = createSavedSearchButton(searchInfo.cityName, searchInfo.countryCode, searchInfo.stateCode);
    savedSearchButtonsEl.appendChild(buttonEl);
  });
}

// Call saveSearch() when form is submitted
var cityFormEl = document.querySelector("#user-form");
cityFormEl.addEventListener("submit", function(event) {
  event.preventDefault();
  var cityName = document.querySelector("#cityName").value;
  var countryCode = document.querySelector("#countryCode").value;
  var stateCode = document.querySelector("#stateCode").value;
  if (cityName) {
    getCurrentWeather(cityName, countryCode, stateCode);
    getFutureWeather(cityName, countryCode, stateCode);
    saveSearchHistory(cityName, countryCode, stateCode);
    renderSavedSearches();
  } else {
    alert("Please enter a City Name");
  }
});

// Render saved search buttons when page loads
renderSavedSearches();

//Current Weather Data:
var getCurrentWeather = function(cityName, countryCode, stateCode) {
  var currentWeatherRequest;

  if (countryCode && stateCode) {
    currentWeatherRequest = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + ',' + stateCode + ',' + countryCode + '&appid=' + APIKey + '&units=metric';
  } else if (countryCode) {
    currentWeatherRequest = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + ',' + countryCode + '&appid=' + APIKey + '&units=metric';
  } else {
    currentWeatherRequest = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + APIKey + '&units=metric';
  }

  fetch(currentWeatherRequest)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      displayCurrentWeather(data);
      // Display weather data
    })
    .catch(error => {
      console.log(error);
    });

    //const newTitle = document.createTextNode(cityName); // Create a new text node
    //weatherNetwork.appendChild(newTitle); // Append the new text node to the HTML element 

    //Display Weather Data - 
    var displayCurrentWeather = function(data){
      var name = data.name;
      var date = new Date(data.dt * 1000).toLocaleDateString();
      var icon = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
      var temp = "Temp: " + data.main.temp + "°C";
      var windSpeed = "Wind: " + data.wind.speed + "m/s";
      var humidity = "Humidity: " + data.main.humidity + "%";
    
      currentForecastDiv.innerHTML = "";
    
      // Create and append new HTML elements for weather data
      var cityNameElement = document.createElement('h2');
      cityNameElement.textContent = name;
      currentForecastDiv.appendChild(cityNameElement);
    
      var dateElement = document.createElement('p');
      dateElement.textContent = date;
      currentForecastDiv.appendChild(dateElement);
    
      var iconElement = document.createElement('img');
      iconElement.src = icon;
      currentForecastDiv.appendChild(iconElement);
    
      var tempElement = document.createElement('p');
      tempElement.textContent = temp;
      currentForecastDiv.appendChild(tempElement);
    
      var windElement = document.createElement('p');
      windElement.textContent = windSpeed;
      currentForecastDiv.appendChild(windElement);
    
      var humidityElement = document.createElement('p');
      humidityElement.textContent = humidity;
      currentForecastDiv.appendChild(humidityElement);
    }    
}

//5-day forecast data:
var getFutureWeather = function(cityName, countryCode, stateCode) {
  var futureWeatherRequest;

  if (countryCode && stateCode) {
    futureWeatherRequest = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + ',' + stateCode + ',' + countryCode + '&appid=' + APIKey + '&units=metric';
  } else if (countryCode) {
    futureWeatherRequest = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + ',' + countryCode + '&appid=' + APIKey + '&units=metric';
  } else {
    futureWeatherRequest = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + APIKey + '&units=metric';
  }

  fetch(futureWeatherRequest)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      fiveDayForecastDiv.innerHTML = "";
      // Filter forecast data to only include noon data
      var noonData = data.list.filter(item => {
        return new Date(item.dt_txt).getHours() === 12;
      });

      // Display weather data for noon of each day
      noonData.forEach(item => {
        // Display weather data for noon of each day
        var date = new Date(item.dt_txt).toLocaleDateString();
        var temp = "Temp: " + item.main.temp + "°C";
        var windSpeed = "Wind: " + item.wind.speed + "m/s";
        var humidity = "Humidity: " + item.main.humidity + "%";
        
        // Create a new div element for each day's forecast
        var forecastDiv = document.createElement('div');
        forecastDiv.classList.add('forecast-card');
        
    
        // Add date to the forecast card
        var dateElement = document.createElement('p');
        var date = new Date(item.dt_txt).toLocaleDateString();
        dateElement.textContent = date;
        forecastDiv.appendChild(dateElement);
    
        // Add icon to the forecast card
        var iconElement = document.createElement('img');
        var icon = 'https://openweathermap.org/img/w/' + item.weather[0].icon + '.png';
        iconElement.src = icon;
        forecastDiv.appendChild(iconElement);
    
        // Add temperature to the forecast card
        var tempElement = document.createElement('p');
        var temp = "Temp: " + item.main.temp + "°C";
        tempElement.textContent = temp;
        forecastDiv.appendChild(tempElement);
    
        // Add wind speed to the forecast card
        var windElement = document.createElement('p');
        var windSpeed = "Wind: " + item.wind.speed + "m/s";
        windElement.textContent = windSpeed;
        forecastDiv.appendChild(windElement);
    
        // Add humidity to the forecast card
        var humidityElement = document.createElement('p');
        var humidity = "Humidity: " + item.main.humidity + "%";
        humidityElement.textContent = humidity;
        forecastDiv.appendChild(humidityElement);
    
        // Append the forecast card to the parent element
        fiveDayForecastDiv.appendChild(forecastDiv);
      });

      fiveDayForecastDiv.style.display = 'flex';
      fiveDayForecastDiv.style.flexWrap = 'wrap';
      })
      .catch(error => {
      console.log(error);
    });
}

localStorageReset.addEventListener('click', function(){
  localStorage.clear();
  setTimeout(() => {
    savedSearchButtonsEl.innerHTML = "";
  }, 25);
});