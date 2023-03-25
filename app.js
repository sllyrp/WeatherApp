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

                    // TODO: Change icon per weather

                    data.properties.periods.forEach((period, i) => {
                        const button = document.createElement("button")

                        button.id = "button" + period.name

                        button.classList.add("tableButton")

                        button.textContent = period.name

                        if (button.textContent.includes("Night") || button.textContent == "Overnight" || button.textContent == data.properties.periods[0].name || button.textContent == "Tonight") {
                            return
                        }

                        const today = new Date().getDay()

                        if (today == 0) {
                            if (button.textContent.includes("Monday")) {
                                button.classList.add("tableButtonActive")
                                button.textContent = "Today"
                            }
                        } else if (today == 1) {
                            if (button.textContent.includes("Tuesday")) {
                                button.classList.add("tableButtonActive")
                                button.textContent = "Today"
                            }
                        } else if (today == 2) {
                            if (button.textContent.includes("Wednesday")) {
                                button.classList.add("tableButtonActive")
                                button.textContent = "Today"
                            }
                        } else if (today == 3) {
                            if (button.textContent.includes("Thursday")) {
                                button.classList.add("tableButtonActive")
                                button.textContent = "Today"
                            }
                        } else if (today == 4) {
                            if (button.textContent.includes("Friday")) {
                                button.classList.add("tableButtonActive")
                                button.textContent = "Today"
                            }
                        } else if (today == 5) {
                            if (button.textContent.includes("Saturday")) {
                                button.classList.add("tableButtonActive")
                                button.textContent = "Today"
                            }
                        } else if (today == 6) {
                            if (button.textContent.includes("Sunday")) {
                                button.classList.add("tableButtonActive")
                                button.textContent = "Today"
                            }
                        }


                        button.addEventListener("click", () => {
                            document.querySelectorAll(".tableButton").forEach(button => {
                                button.classList.remove("tableButtonActive")
                            })

                            button.classList.add("tableButtonActive")

                            tempNumber.innerHTML = period.temperature + "<a id='tempUnit'>°" + period.temperatureUnit + "</a>"
                            weatherDescriptionText.textContent = period.detailedForecast
                            tempUnit.textContent = period.temperatureUnit
                            windDirectionText.textContent = period.windDirection
                            windSpeedText.textContent = period.windSpeed
                            humidityText.textContent = (period.relativeHumidity.value)
                            dewPointText.textContent =Math.round(period.dewpoint.value);

                            if (windDirectionText.length == 3) {
                                windDirectionText.classList.add("windDirectionTextThree")
                            }
                        })

                        document.querySelector("#tableButtonContainer").appendChild(button)

                        i++
                    })

                    tempNumber.innerHTML = data.properties.periods[0].temperature + "<a id='tempUnit'>°" + data.properties.periods[0].temperatureUnit + "</a>"
                    weatherDescriptionText.textContent = data.properties.periods[0].detailedForecast
                    tempUnit.textContent = data.properties.periods[0].temperatureUnit
                    windDirectionText.textContent = data.properties.periods[0].windDirection
                    windSpeedText.textContent = data.properties.periods[0].windSpeed
                    humidityText.textContent = (data.properties.periods[0].relativeHumidity.value)
                    dewPointText.textContent = Math.round(data.properties.periods[0].dewpoint.value);
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

                    errorText.textContent = "Please enter a valid location"
                })
                .then(data => {
                    if (data.length === 0) {
                        errorText.textContent = "Please enter a valid location"

                        throw new Error('No results found')
                    }

                    fetch(`https://api.weather.gov/points/${data[0].lat},${data[0].lon}`)
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            if (data.title) {
                                errorText.textContent = data.title

                                throw new Error(data.title)
                            }

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
                                    document.querySelectorAll(".tableButton").forEach(button => {
                                        button.remove()
                                    })
                
                                    // TODO: Change icon per weather

                                    data.properties.periods.forEach((period, i) => {

                                        const button = document.createElement("button")
                
                                        button.id = "button" + period.name
                
                                        button.classList.add("tableButton")
                
                                        button.textContent = period.name
                
                                        if (button.textContent.includes("Night") || button.textContent == "Overnight" || button.textContent == data.properties.periods[0].name) {
                                            return
                                        }
                
                                        const today = new Date().getDay()
                
                                        if (today == 0) {
                                            if (button.textContent.includes("Monday")) {
                                                button.classList.add("tableButtonActive")
                                                button.textContent = "Today"
                                            }
                                        } else if (today == 1) {
                                            if (button.textContent.includes("Tuesday")) {
                                                button.classList.add("tableButtonActive")
                                                button.textContent = "Today"
                                            }
                                        } else if (today == 2) {
                                            if (button.textContent.includes("Wednesday")) {
                                                button.classList.add("tableButtonActive")
                                                button.textContent = "Today"
                                            }
                                        } else if (today == 3) {
                                            if (button.textContent.includes("Thursday")) {
                                                button.classList.add("tableButtonActive")
                                                button.textContent = "Today"
                                            }
                                        } else if (today == 4) {
                                            if (button.textContent.includes("Friday")) {
                                                button.classList.add("tableButtonActive")
                                                button.textContent = "Today"
                                            }
                                        } else if (today == 5) {
                                            if (button.textContent.includes("Saturday")) {
                                                button.classList.add("tableButtonActive")
                                                button.textContent = "Today"
                                            }
                                        } else if (today == 6) {
                                            if (button.textContent.includes("Sunday")) {
                                                button.classList.add("tableButtonActive")
                                                button.textContent = "Today"
                                            }
                                        }
                
                
                                        button.addEventListener("click", () => {

                                            document.querySelectorAll(".tableButton").forEach(button => {
                                                button.classList.remove("tableButtonActive")
                                            })
                
                                            button.classList.add("tableButtonActive")
                
                                            tempNumber.innerHTML = period.temperature + "<a id='tempUnit'>°" + period.temperatureUnit + "</a>"
                                            weatherDescriptionText.textContent = period.detailedForecast
                                            tempUnit.textContent = period.temperatureUnit
                                            windDirectionText.textContent = period.windDirection
                                            windSpeedText.textContent = period.windSpeed
                                            humidityText.textContent = (period.relativeHumidity.value)
                                            dewPointText.textContent =Math.round(period.dewpoint.value);

                                            if (windDirectionText.textContent.length < 3) {
                                                windDirectionText.classList.remove("windDirectionTextThree")
                                            }

                                            if (windDirectionText.textContent.length == 3) {
                                                windDirectionText.classList.add("windDirectionTextThree")
                                            }
                                        })
                
                                        document.querySelector("#tableButtonContainer").appendChild(button)
                
                                        i++
                                    })
                
                                    tempNumber.innerHTML = data.properties.periods[0].temperature + "<a id='tempUnit'>°" + data.properties.periods[0].temperatureUnit + "</a>"
                                    weatherDescriptionText.textContent = data.properties.periods[0].detailedForecast
                                    tempUnit.textContent = data.properties.periods[0].temperatureUnit
                                    windDirectionText.textContent = data.properties.periods[0].windDirection
                                    windSpeedText.textContent = data.properties.periods[0].windSpeed
                                    humidityText.textContent = (data.properties.periods[0].relativeHumidity.value)
                                    dewPointText.textContent =Math.round(data.properties.periods[0].dewpoint.value);

                                    console.log(windDirectionText.textContent.length)

                                    if (windDirectionText.textContent.length == 3) {
                                        windDirectionText.classList.add("windDirectionTextThree")
                                    }
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
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

search.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      getWeather()
    }
  });

button.addEventListener('click', getWeather)