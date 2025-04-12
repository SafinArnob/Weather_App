const apiKey = '5642fcc283108176680d339c57073595';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + apiKey;

// DOM Elements
const cityElement = document.querySelector('.name figcaption');
const earthIcon = document.querySelector('.name i.fa-earth-americas');
const countryFlag = document.createElement('img');
countryFlag.className = 'country-flag';
earthIcon.parentNode.insertBefore(countryFlag, earthIcon.nextSibling);

const temperatureElement = document.querySelector('.temperature span');
const weatherIcon = document.querySelector('.temperature img');
const descriptionElement = document.querySelector('.description');
const cloudsElement = document.getElementById('clouds');
const humidityElement = document.getElementById('humidity');
const pressureElement = document.getElementById('pressure');
const searchForm = document.querySelector("form");
const searchInput = document.getElementById('name');
const mainElement = document.querySelector('main');

// Create time element and day/night icon
const timeElement = document.createElement('span');
timeElement.className = 'current-time';
temperatureElement.insertAdjacentElement('afterend', timeElement);

const dayNightIcon = document.createElement('i');
dayNightIcon.className = 'fa-solid fa-sun';
temperatureElement.insertAdjacentElement('afterend', dayNightIcon);

// Initially show only earth icon
countryFlag.style.display = 'none';
earthIcon.style.display = 'inline-block';
cityElement.textContent = 'Your City';
temperatureElement.textContent = '--';
descriptionElement.textContent = '--';
cloudsElement.textContent = '--';
humidityElement.textContent = '--';
pressureElement.textContent = '--';
timeElement.textContent = '';
dayNightIcon.style.display = 'none';

// Form submission handler
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const cityName = searchInput.value.trim();
    if (cityName) {
        fetchWeather(cityName);
    } else {
        showError();
    }
});

// Fetch weather data
async function fetchWeather(cityName) {
    try {
        const response = await fetch(`${apiUrl}&q=${encodeURIComponent(cityName)}`);
        const data = await response.json();
        
        console.log(data);

        if (data.cod === 200) {
            displayWeather(data);
        } else {
            showError();
            resetWeatherDisplay();
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
        showError();
        resetWeatherDisplay();
    }
}

// Display weather data
function displayWeather(data) {
    // City and country
    cityElement.textContent = data.name;
    
    // Country flag
    if (data.sys?.country) {
        countryFlag.src = `https://flagsapi.com/${data.sys.country}/flat/64.png`;
        countryFlag.alt = `${data.sys.country} flag`;
        countryFlag.style.display = 'inline-block';
        earthIcon.style.display = 'none';
    } else {
        countryFlag.style.display = 'none';
        earthIcon.style.display = 'inline-block';
    }
    
    // Temperature
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    
    // Weather icon
    const iconCode = data.weather[0]?.icon || '01d';
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = data.weather[0]?.description || 'Weather icon';
    weatherIcon.onerror = () => {
        weatherIcon.src = 'https://openweathermap.org/img/wn/01d@4x.png';
    };
    
    // Description - Capitalized first letters
    descriptionElement.textContent = data.weather[0]?.description 
        ? data.weather[0].description
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : '--';
    
    // Stats
    cloudsElement.textContent = data.clouds?.all ?? '--';
    humidityElement.textContent = data.main?.humidity ?? '--';
    pressureElement.textContent = data.main?.pressure ?? '--';
    
    // Time display
    const timezoneOffset = data.timezone / 3600; // Convert seconds to hours
    const cityTime = new Date();
    const utc = cityTime.getTime() + (cityTime.getTimezoneOffset() * 60000);
    const localTime = new Date(utc + (3600000 * timezoneOffset));
    
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    timeElement.textContent = localTime.toLocaleTimeString('en-US', options);
    
    // Day/Night icon
    const hours = localTime.getHours();
    dayNightIcon.style.display = 'inline-block';
    if (hours >= 6 && hours < 18) {
        dayNightIcon.className = 'fa-solid fa-sun';
        dayNightIcon.style.color = '#FFA500';
    } else {
        dayNightIcon.className = 'fa-solid fa-moon';
        dayNightIcon.style.color = '#4682B4';
    }
    
    searchInput.value = '';
}

function resetWeatherDisplay() {
    cityElement.textContent = 'Your City';
    temperatureElement.textContent = '--';
    descriptionElement.textContent = '--';
    cloudsElement.textContent = '--';
    humidityElement.textContent = '--';
    pressureElement.textContent = '--';
    weatherIcon.src = '';
    countryFlag.style.display = 'none';
    earthIcon.style.display = 'inline-block';
    timeElement.textContent = '';
    dayNightIcon.style.display = 'none';
}

function showError() {
    mainElement.classList.add('error');
    setTimeout(() => {
        mainElement.classList.remove('error');
    }, 1000);
}