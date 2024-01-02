const apiKey = "e7c86cb8fd185b9af4f79daa8eb4efdd"

const cityInput = document.querySelector(".inputCity");

const tempElement = document.querySelector("#number");
const humidityElement = document.querySelector("#humidityLeft");
const windElement = document.querySelector("#windLeft");
const descElement = document.getElementById('climate');
const feelsLike = document.getElementById('thermalSensation');
const tempNumberRight = document.getElementById('degrees numberRight');
const windElementRight = document.getElementById('windElementRight');
const humidityElementRight = document.getElementById('humidityElementRight');
const descElementRight = document.getElementById('climateRight');

const countryElement = document.getElementById('countryName');

const dayTime = document.getElementById('degrees');
const dayTime1 = document.getElementById('degrees1');
const dayTime2 = document.getElementById('degrees2');
const dayTime3 = document.getElementById('degrees3');
const dayTime4 = document.getElementById('degrees4');
const dayTime5 = document.getElementById('degrees5');

const dayClimates = document.getElementById('climates0');
const dayClimates1 = document.getElementById('climates1');
const dayClimates2 = document.getElementById('climates2');
const dayClimates3 = document.getElementById('climates3');
const dayClimates4 = document.getElementById('climates4');


const dayHours = document.getElementById('degreesHourly');
const dayHours1 = document.getElementById('degreesHourly1');
const dayHours2 = document.getElementById('degreesHourly2');
const dayHours3 = document.getElementById('degreesHourly3');
const dayHours4 = document.getElementById('degreesHourly4');
const dayHours5 = document.getElementById('degreesHourly5');

const climateElements = [
    document.getElementById('climatesHourly'),
    document.getElementById('climatesHourly1'),
    document.getElementById('climatesHourly2'),
    document.getElementById('climatesHourly3'),
    document.getElementById('climatesHourly4'),
    document.getElementById('climatesHourly5')
];

const week = document.getElementById('week0');
const week1 = document.getElementById('week1');
const week2 = document.getElementById('week2');
const week3 = document.getElementById('week3');
const week4 = document.getElementById('week4');






const getWeatherData = async(city) => {

    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    const res = await fetch(apiWeatherURL)
    const data = await res.json();

    return data;
}

const forcastHourly = async(city) => {
    const forcastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const res = await fetch(forcastURL)
    const hourly = await res.json();
    
    console.log(hourly);
    return hourly;
}

const showWeatherData = async (city) => {
    const data = await getWeatherData(city);
    const hourly = await forcastHourly(city);

    const climateForDays = {};
    let currentDay = null;
    
    

    hourly.list.forEach(element => {
        const dt_txt = element.dt_txt;
        const day = dt_txt.split(" ")[0];
        if (!climateForDays[day]) {
            climateForDays[day] = [];
        }
        climateForDays[day].push(element.main.temp);

    });
    const days = Object.keys(climateForDays);

    const todayIndex = days.findIndex(day => day === 'Today');
    if (todayIndex !== -1) {
        days.splice(todayIndex, 1);
        days.unshift('Today');
    }
    

    days.forEach((day, index) => {
        try {
            const weekElement = document.getElementById(`week${index - 1}`);
            const climateElement = document.getElementById(`climates${index}`);
        
            climateElements.push(climateElement);
        
            if (weekElement && climateElement && climateForDays[day]?.[0]) {
                const formattedDate = new Date(day).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' });
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





    dayTime.innerText = `${parseInt(climateForDays[days[0]][0])}º`;
    dayTime1.innerText = `${parseInt(climateForDays[days[1]][0])}º`;
    dayTime2.innerText = `${parseInt(climateForDays[days[2]][0])}º`;
    dayTime3.innerText = `${parseInt(climateForDays[days[3]][0])}º`;
    dayTime4.innerText = `${parseInt(climateForDays[days[4]][0])}º`;

    dayHours.innerText = `${parseInt(hourly.list[0].main.temp)}º`;
    dayHours1.innerText = `${parseInt(hourly.list[1].main.temp)}º`;
    dayHours2.innerText = `${parseInt(hourly.list[2].main.temp)}º`;
    dayHours3.innerText = `${parseInt(hourly.list[3].main.temp)}º`;
    dayHours4.innerText = `${parseInt(hourly.list[4].main.temp)}º`;
    dayHours5.innerText = `${parseInt(hourly.list[4].main.temp)}º`;



    tempElement.innerText = parseInt(data.main.temp);
    descElement.innerText = data.weather[0].description;
    humidityElement.innerText = `${data.main.humidity} %`;
    windElement.innerText = `${data.wind.speed} Km/h`;
    feelsLike.innerText = `Feels like ${parseInt(data.main.feels_like)}º`;
    tempNumberRight.innerText = `${parseInt(data.main.temp)}º`;
    windElementRight.innerText = `${data.wind.speed} Km/h`;
    humidityElementRight.innerText = `${data.main.humidity} %`
    descElementRight.innerText = data.weather[0].description;
    countryElement.innerText = hourly.city.country;
}

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter"){
        const city = cityInput.value;
        showWeatherData(city);
    }
})

