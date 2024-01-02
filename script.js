const apiKey = "e7c86cb8fd185b9af4f79daa8eb4efdd";

const cityInput = document.querySelector(".inputCity");
const tempElement = document.querySelector("#number");
const humidityElement = document.querySelector("#humidityLeft");
const windElement = document.querySelector("#windLeft");
const descElement = document.getElementById("climate");
const feelsLike = document.getElementById("thermalSensation");
const tempNumberRight = document.getElementById("degrees numberRight");
const windElementRight = document.getElementById("windElementRight");
const humidityElementRight = document.getElementById("humidityElementRight");
const descElementRight = document.getElementById("climateRight");
const countryElement = document.getElementById("countryName");

const dayClimatesElements = [];

for (let i = 0; i <= 4; i++) {
  const dayClimate = document.getElementById(`climates${i}`);
  dayClimatesElements.push(dayClimate);
}

const climateElements = [
  document.getElementById("climatesHourly"),
  document.getElementById("climatesHourly1"),
  document.getElementById("climatesHourly2"),
  document.getElementById("climatesHourly3"),
  document.getElementById("climatesHourly4"),
  document.getElementById("climatesHourly5"),
];

const weekElements = [];

for (let i = 0; i <= 4; i++) {
  const weekElement = document.getElementById(`week${i}`);
  weekElements.push(weekElement);
}

const getWeatherData = async (city) => {
  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  return data;
};

const forcastHourly = async (city) => {
  const forcastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  const res = await fetch(forcastURL);
  const hourly = await res.json();

  console.log(hourly);
  return hourly;
};

const showWeatherData = async (city) => {
  const data = await getWeatherData(city);
  const hourly = await forcastHourly(city);

  const climateForDays = {};
  let currentDay = null;

  hourly.list.forEach((element) => {
    const dt_txt = element.dt_txt;
    const day = dt_txt.split(" ")[0];
    if (!climateForDays[day]) {
      climateForDays[day] = [];
    }
    climateForDays[day].push(element.main.temp);
  });
  const days = Object.keys(climateForDays);

  const todayIndex = days.findIndex((day) => day === "Today");
  if (todayIndex !== -1) {
    days.splice(todayIndex, 1);
    days.unshift("Today");
  }

  days.forEach((day, index) => {
    try {
      const weekElement = document.getElementById(`week${index - 1}`);
      const climateElement = document.getElementById(`climates${index}`);

      climateElements.push(climateElement);

      if (weekElement && climateElement && climateForDays[day]?.[0]) {
        const formattedDate = new Date(day).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const dayOfWeek = formattedDate.split(",")[0];
        const climateMain = climateForDays[day][0];

        weekElement.innerText = dayOfWeek;
        climateElement.innerText = climateMain;
      }
    } catch (error) {
      console.error(`Error processing day ${day}: ${error}`);
    }
  });

  hourly.list.forEach((hourData, index) => {
    try {
      const climateElement = climateElements[index];

      if (climateElement && hourData.weather?.[0]) {
        const climateMain = hourData.weather[0].main;

        climateElement.innerText = climateMain;
      }
    } catch (error) {
      console.error(`Error processing hour ${index}: ${error}`);
    }
  });

  const dayTimeElements = [];
  for (let i = 0; i <= 4; i++) {
    const dayTime = document.getElementById(`degrees${i}`);
    dayTimeElements.push(dayTime);
    const dayIndex = days[i];
    const temperature = parseInt(climateForDays[dayIndex][0]);

    dayTime.innerText = `${temperature}º`;
  }

  const dayHoursElements = [];

  for (let i = 0; i <= 5; i++) {
    const dayHour = document.getElementById(`degreesHourly${i}`);
    dayHoursElements.push(dayHour);
  }
  for (let i = 0; i <= 5; i++) {
    dayHoursElements[i].innerText = `${parseInt(hourly.list[i].main.temp)}º`;
  }

  function updateTemperatureElements(temp, feelsLike, tempNumberRight) {
    tempElement.innerText = parseInt(temp);
    feelsLike.innerText = `Feels like ${parseInt(feelsLike)}º`;
    tempNumberRight.innerText = `${parseInt(temp)}º`;
  }
  updateTemperatureElements(
    data.main.temp,
    data.main.feels_like,
    tempNumberRight
  );

  function updateWeatherDescription(
    description,
    descElement,
    descElementRight
  ) {
    descElement.innerText = description;
    descElementRight.innerText = description;
  }
  updateWeatherDescription(
    data.weather[0].description,
    descElement,
    descElementRight
  );

  function updateHumidityElement(
    humidity,
    humidityElement,
    humidityElementRight
  ) {
    humidityElement.innerText = `${humidity} %`;
    humidityElementRight.innerText = `${humidity} %`;
  }
  updateHumidityElement(
    data.main.humidity,
    humidityElement,
    humidityElementRight
  );

  function updateWindElement(speed, windElement, windElementRight) {
    windElement.innerText = `${speed} Km/h`;
    windElementRight.innerText = `${speed} Km/h`;
  }
  updateWindElement(data.wind.speed, windElement, windElementRight);

  function updateCountryElement(country, countryElement) {
    countryElement.innerText = country;
  }

  updateCountryElement(hourly.city.country, countryElement);
};

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value;
    showWeatherData(city);
  }
});
