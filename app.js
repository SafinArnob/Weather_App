const apiKey = '5642fcc283108176680d339c57073595';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + apiKey;

// DOM Elements
const elements = {
    city: document.querySelector('.weather-result figcaption'),
    earthIcon: document.querySelector('.fa-earth-americas'),
    countryFlag: document.querySelector('.country-flag'),
    tempValue: document.querySelector('.temp-value'),
    weatherIcon: document.querySelector('.weather-icon'),
    description: document.querySelector('.description'),
    clouds: document.getElementById('clouds'),
    humidity: document.getElementById('humidity'),
    pressure: document.getElementById('pressure'),
    searchForm: document.querySelector('form'),
    searchInput: document.getElementById('name'),
    currentTime: document.querySelector('.current-time'),
    dayNightIcon: document.querySelector('.day-night-icon'),
    weatherCard: document.querySelector('.weather-card')
};

// Initialize app
function initApp() {
    elements.countryFlag.classList.add('d-none');
    elements.earthIcon.classList.remove('d-none');
    elements.city.textContent = 'Your City';
    elements.tempValue.textContent = '--°C'; // Changed to include °C
    elements.description.textContent = '--';
    elements.clouds.textContent = '--';
    elements.humidity.textContent = '--';
    elements.pressure.textContent = '--';
    elements.currentTime.textContent = '--:--';
    elements.dayNightIcon.className = 'day-night-icon fas fa-sun fa-3x';
    elements.weatherIcon.src = 'https://openweathermap.org/img/wn/10d@4x.png';
}

// Form submission
elements.searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cityName = elements.searchInput.value.trim();
    if (cityName) {
        try {
            // Add loading animation
            elements.tempValue.classList.add('temp-changing');
            elements.weatherIcon.classList.add('icon-changing');
            
            const response = await fetch(`${apiUrl}&q=${encodeURIComponent(cityName)}`);
            const data = await response.json();
            
            if (data.cod === 200) {
                updateWeatherUI(data);
            } else {
                showError();
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            showError();
        }
    }
});

// Update UI with animations
function updateWeatherUI(data) {
    // Trigger animations
    elements.tempValue.classList.add('temp-changing');
    elements.weatherIcon.classList.add('icon-changing');
    
    // Update content after animation starts
    setTimeout(() => {
        elements.city.textContent = data.name;
        elements.tempValue.textContent = `${Math.round(data.main.temp)}°C`;
        elements.description.textContent = data.weather[0]?.description || '--';
        elements.clouds.textContent = data.clouds?.all ?? '--';
        elements.humidity.textContent = data.main?.humidity ?? '--';
        elements.pressure.textContent = data.main?.pressure ?? '--';
        
        // Country flag
        if (data.sys?.country) {
            elements.countryFlag.src = `https://flagsapi.com/${data.sys.country}/flat/64.png`;
            elements.countryFlag.alt = `${data.sys.country} flag`;
            elements.countryFlag.classList.remove('d-none');
            elements.earthIcon.classList.add('d-none');
        } else {
            elements.countryFlag.classList.add('d-none');
            elements.earthIcon.classList.remove('d-none');
        }
        
        // Weather icon
        const iconCode = data.weather[0]?.icon || '01d';
        elements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        
        // Time and day/night
        const timezoneOffset = data.timezone / 3600;
        const cityTime = new Date();
        const utc = cityTime.getTime() + (cityTime.getTimezoneOffset() * 60000);
        const localTime = new Date(utc + (3600000 * timezoneOffset));
        
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        elements.currentTime.textContent = localTime.toLocaleTimeString('en-US', options);
        
        const hours = localTime.getHours();
        elements.dayNightIcon.className = hours >= 6 && hours < 18 
            ? 'day-night-icon fas fa-sun fa-3x' 
            : 'day-night-icon fas fa-moon fa-3x';
        
        // Remove animation classes
        elements.tempValue.classList.remove('temp-changing');
        elements.weatherIcon.classList.remove('icon-changing');
    }, 100);
    
    elements.searchInput.value = '';
}

// Error handling
function showError() {
    elements.weatherCard.classList.add('error-animation');
    setTimeout(() => {
        elements.weatherCard.classList.remove('error-animation');
    }, 300);
}

// Initialize the app
initApp();