document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '000827bbd8aaee5a7db252840cde3619'; // Must have your own API key so change this

    document.getElementById('searchBtn').addEventListener('click', () => {
        const city = document.getElementById('cityInput').value.trim();
        console.log("City entered:", city);
        if (city) {
            getWeather(city);
            getWeatherForecast(city);
        } else {
            alert('Please enter a city name.');
        }
    });

    function getWeather(city) {
        console.log("Fetching weather for city:", city);
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
            .then(response => {
                console.log("Weather API response status:", response.status);
                if (response.status === 404) {
                    throw new Error('City not found');
                }
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                return response.json();
            })
            .then(data => {
                console.log("Weather data received:", data);
                displayWeather(data);
                document.getElementById('weatherInfo').classList.add('show');
            })
            .catch(error => {
                console.error('Error:', error.message);
                alert(`Error: ${error.message}. Please make sure the city name is correct and try again.`);
            });
    }

    function getWeatherForecast(city) {
        console.log("Fetching forecast for city:", city);
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
            .then(response => {
                console.log("Forecast API response status:", response.status);
                if (response.status === 404) {
                    throw new Error('Forecast data not found');
                }
                if (!response.ok) {
                    throw new Error('Failed to fetch forecast data');
                }
                return response.json();
            })
            .then(data => {
                console.log("Forecast data received:", data);
                displayForecast(data);
            })
            .catch(error => {
                console.error('Error fetching forecast data:', error.message);
                alert('Unable to fetch forecast data. Please try again later.');
            });
    }

    function displayWeather(data) {
        const weatherElement = document.getElementById('weatherInfo');
        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        weatherElement.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <img src="${iconUrl}" alt="${data.weather[0].description}">
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    }

    function displayForecast(data) {
        if (!data || !data.list || data.list.length === 0) {
            console.error('No forecast data available.');
            alert('No forecast data available for this city.');
            return;
        }

        const forecastElement = document.getElementById('forecast');
        forecastElement.innerHTML = '';

        data.list.forEach(item => {
            const dateTime = new Date(item.dt_txt).toLocaleString();
            const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
            const forecastInfo = `
                <div class="forecast-item">
                    <p>${dateTime}</p>
                    <img src="${iconUrl}" alt="${item.weather[0].description}">
                    <p>Temp: ${item.main.temp}°C</p>
                </div>
            `;
            forecastElement.innerHTML += forecastInfo;
        });

        forecastElement.classList.add('show');
    }
});
