const apiKey = "d839e7830c194ec798072324241012";
const baseUrl = "https://api.weatherapi.com/v1";
const elements = {
  weatherContent: document.querySelector(".weather-content"),
  errorMsg: document.getElementById("error-msg"),
  spinnerHolder: document.querySelector(".spinner-holder"),
  city: document.querySelector(".city"),
  dayOne: document.querySelector("#day-1 .day"),
  dayOneMonth: document.querySelector("#day-1 .day-month"),
  dayOneDegree: document.querySelector("#day-1 .degree"),
  dayOneIcon: document.querySelector("#day-1 .weather-icon"),
  dayOneText: document.querySelector("#day-1 .text"),
  dayTwo: document.querySelector("#day-2 .day"),
  dayTwoMonth: document.querySelector("#day-2 .day-month"),
  dayTwoDegree: document.querySelector("#day-2 .degree"),
  dayTwoMinDegree: document.querySelector("#day-2 .min-degree"),
  dayTwoIcon: document.querySelector("#day-2 .weather-icon"),
  dayTwoText: document.querySelector("#day-2 .text"),
  dayThree: document.querySelector("#day-3 .day"),
  dayThreeMonth: document.querySelector("#day-3 .day-month"),
  dayThreeDegree: document.querySelector("#day-3 .degree"),
  dayThreeIcon: document.querySelector("#day-3 .weather-icon"),
  dayThreeMinDegree: document.querySelector("#day-3 .min-degree"),
  dayThreeText: document.querySelector("#day-3 .text"),
  rain: document.querySelector(".rain"),
  wind: document.querySelector(".wind"),
  compass: document.querySelector(".compass"),
  searchInput: document.getElementById("search"),
  searchBtn: document.getElementById("search-btn"),
};
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const compass = {
  N: "North",
  S: "South",
  E: "East",
  W: "West",
  NE: "North East",
  NW: "North West",
  SE: "South East",
  SW: "South West",
  WNW: "West - North West",
  NNW: "North - Nort hWest",
  NNE: "Nort - North East",
  ENE: "East - Borth East",
  ESE: "East - South East",
  SSE: "Sout - South East",
  SSW: "Sout - South West",
  WSW: "West - South West",
};
const date = new Date();
const forecastDays = {
  today: days[date.getDay()],
  day2: days[date.getDay() + 1],
  day3: days[date.getDay() + 2],
  todayNumber: date.getDate(),
  month: months[date.getMonth()],
};

init();

function init() {
  navigator.geolocation.getCurrentPosition(
    (postion) => {
      getData(`${postion.coords.latitude},${postion.coords.longitude}`);
    },
    (eror) => {
      console.log(eror);
      showError(
        "Location permission denied please allow location or search for your city!"
      );
      elements.weatherContent.classList.add("d-none");
    }
  );
}

async function getData(location) {
  elements.errorMsg.parentElement.classList.remove("d-none");
  elements.spinnerHolder.classList.remove("d-none");
  elements.weatherContent.classList.add("d-none");
  try {
    const request = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`
    );
    response = await request.json();
    if (response.error) {
      showError(response.error.message);
    }
    displayData(response);
  } catch (error) {
    console.log(error);
  }
}

function displayData(response) {
  if (response.error) {
    elements.weatherContent.classList.add("d-none");
  } else {
    elements.city.textContent = response.location.name;
    elements.dayOne.textContent = forecastDays.today;
    elements.dayOneMonth.textContent = `${forecastDays.todayNumber} ${forecastDays.month}`;
    elements.dayOneDegree.textContent = response.current.temp_c + "°c";
    elements.dayOneIcon.src = response.current.condition.icon;
    elements.dayOneText.textContent = response.current.condition.text;

    elements.dayTwo.textContent = forecastDays.day2;
    elements.dayTwoMonth.textContent = `${forecastDays.todayNumber + 1} ${
      forecastDays.month
    }`;
    elements.dayTwoDegree.textContent =
      response.forecast.forecastday[1].day.maxtemp_c + "°c";
    elements.dayTwoMinDegree.textContent =
      response.forecast.forecastday[1].day.mintemp_c + "°c";
    elements.dayTwoIcon.src =
      response.forecast.forecastday[1].day.condition.icon;
    elements.dayTwoText.textContent =
      response.forecast.forecastday[1].day.condition.text;
    null;
    elements.dayThree.textContent = forecastDays.day3;
    elements.dayThreeMonth.textContent = `${forecastDays.todayNumber + 2} ${
      forecastDays.month
    }`;
    elements.dayThreeDegree.textContent =
      response.forecast.forecastday[2].day.maxtemp_c + "°c";
    elements.dayThreeMinDegree.textContent =
      response.forecast.forecastday[2].day.mintemp_c + "°c";
    elements.dayThreeIcon.src =
      response.forecast.forecastday[2].day.condition.icon;
    elements.dayThreeText.textContent =
      response.forecast.forecastday[2].day.condition.text;
    elements.rain.append(`${response.current.humidity}%`);
    elements.wind.append(`${response.current.wind_kph}km/h`);
    elements.compass.append(compass[response.current.wind_dir]);
    elements.errorMsg.parentElement.classList.add("d-none");
    elements.weatherContent.classList.remove("d-none");
    elements.spinnerHolder.classList.add("d-none");
  }
}
function showError(msg) {
  elements.spinnerHolder.classList.add("d-none");
  elements.errorMsg.parentElement.classList.remove("d-none");
  elements.errorMsg.textContent = msg;
}

elements.searchBtn.addEventListener("click", () => {
  if (elements.searchInput.value) {
    getData(elements.searchInput.value);
  }
});

elements.searchInput.addEventListener("input", (e) => {
  if (!e.target.value) {
    init();
  }
});
