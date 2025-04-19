const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const { city } = req.query;
  

  
  
  
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) {
    console.error("API Key is missing");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    console.log(`Fetching weather for city: ${city}`);

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    console.log("Weather API response:", weatherResponse.data);

    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    console.log("Forecast API response:", forecastResponse.data);

    const weatherData = {
      city: weatherResponse.data.name,
      temperature: weatherResponse.data.main.temp,
      condition: weatherResponse.data.weather[0].main,
      icon: weatherResponse.data.weather[0].icon,
      humidity: weatherResponse.data.main.humidity,
      windSpeed: weatherResponse.data.wind.speed,
    };

    const forecastData = forecastResponse.data.list
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .map((item) => ({
        date: item.dt_txt,
        temperature: item.main.temp,
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
      }));

    res.json({ weather: weatherData, forecast: forecastData });
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    if (error.response) {
      console.error("API error response:", error.response.data);
      if (error.response.status === 404) {
        res.status(404).json({ error: "City not found" });
      } else if (error.response.status === 401) {
        res.status(401).json({ error: "Invalid API key" });
      } else {
        res.status(500).json({ error: "Server error" });
      }
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
  
});

module.exports = router;
