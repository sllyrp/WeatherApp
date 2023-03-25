const button = document.querySelector("#weather")
const search = document.querySelector("#search")
const errorText = document.querySelector("#error")
const tempNumber = document.querySelector("#tempText")
const weatherDescriptionText = document.querySelector("#weatherDescriptionText")
const tempUnit = document.querySelector("#tempUnit")
const windDirectionText = document.querySelector("#windDirectionText")
const windSpeedText = document.querySelector("#windSpeedText")
const humidityText = document.querySelector("#humidityText")
const dewPointText = document.querySelector("#dewPointText")

const apiKey = 'your-api-key';
const lat = 'your-latitude';
const lon = 'your-longitude';
const url = `https://api.weather.gov/points/39.7456,-97.0892`;

// Get the user's location using the Geolocation API
navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;

    // Use the latitude and longitude to fetch the weather data from the NWS API
    const url = `https://api.weather.gov/points/${latitude},${longitude}`;
    fetch(url, {
        headers: {
            'User-Agent': 'your-app-name'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            fetch(data.properties.forecast, {
                headers: {
                    'User-Agent': 'your-app-name'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data) 

                    // TODO: Change icon per weather

                    tempNumber.innerHTML = data.properties.periods[0].temperature + "<a id='tempUnit'>°" + data.properties.periods[0].temperatureUnit + "</a>"
                    weatherDescriptionText.textContent = data.properties.periods[0].detailedForecast
                    tempUnit.textContent = data.properties.periods[0].temperatureUnit
                    windDirectionText.textContent = data.properties.periods[0].windDirection
                    windSpeedText.textContent = data.properties.periods[0].windSpeed
                    humidityText.textContent = (data.properties.periods[0].relativeHumidity.value)
                    dewPointText.textContent =Math.round(data.properties.periods[0].dewpoint.value);
                })
        })
})

function getWeather() {
    errorText.textContent = "‍"

    if (search.value.trim().split(" ")[0]) {
        if (!search.value.includes(".")) {
            const searchValue = search.value.replace(/\s+/g, "+")

            fetch(`https://geocode.maps.co/search?q=${searchValue}`)

                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }
                    return response.json()

                    // change errorText to show error

                    errorText.textContent = "Please enter a valid location"
                })
                .then(data => {
                    if (data.length === 0) {
                        errorText.textContent = "Please enter a valid location"

                        throw new Error('No results found')
                    }

                    console.log(data)

                    fetch(`https://api.weather.gov/points/${data[0].lat},${data[0].lon}`)
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            if (data.title) {
                                errorText.textContent = data.title

                                throw new Error(data.title)
                            }

                            // Process the API response data
                            console.log(data);

                            fetch(data.properties.forecast, {
                                headers: {
                                    'User-Agent': 'your-app-name'
                                }
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    console.log(data) 
                
                                    // TODO: Change icon per weather
                
                                    tempNumber.innerHTML = data.properties.periods[0].temperature + "<a id='tempUnit'>°" + data.properties.periods[0].temperatureUnit + "</a>"
                                    weatherDescriptionText.textContent = data.properties.periods[0].detailedForecast
                                    tempUnit.textContent = data.properties.periods[0].temperatureUnit
                                    windDirectionText.textContent = data.properties.periods[0].windDirection
                                    windSpeedText.textContent = data.properties.periods[0].windSpeed
                                    humidityText.textContent = (data.properties.periods[0].relativeHumidity.value)
                                    dewPointText.textContent =Math.round(data.properties.periods[0].dewpoint.value);
                                })
                        })
                })
            return
        }

        fetch(`https://api.weather.gov/points/${search.value.trim().split(" ")[0]},${search.value.trim().split(" ")[1]}`, {
            headers: {
                'User-Agent': 'your-app-name'
            }
        })
            .then(response => {
                if (!response.ok) {
                    if (response.title) {
                        throw new Error(response.title)
                    }
                }
                return response.json();
            })
            .then(data => {
                if (data.title) {
                    errorText.textContent = data.title

                    throw new Error(data.title)
                }

                // Process the API response data
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

button.addEventListener('click', getWeather)