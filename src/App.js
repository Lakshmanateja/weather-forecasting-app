import React, { useState,useEffect } from "react";
import Navbar from "../src/components/navbar";
import MainWeatherCard from "../src/components/mainweathercard";
import FiveDayForecast from "../src/components/fiveday";
import TodayHighlights from "../src/components/todayhighlights";
import './App.css';

import axios from "axios";

const WeatherDashboard = () => {

  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('London');
  const [airQualityData, setAirQualityData] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchWeatherData(city);
  }, [city, unit]);

  const fetchAirQualityData = (lat, lon) => {
    const API_KEY = '33eb44102688625565a10df87f403860';
    axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
      .then(response => {
        setAirQualityData(response.data.list[0]);
      })
      .catch(error => console.error('Error fetching the air quality data:', error));
  };

  const fetchWeatherData = (city) => {
    const API_KEY = '33eb44102688625565a10df87f403860';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
      .then(response => {
        if (!response.ok) {
            throw new Error("City not found");
        }
        return response.json();
      })
      .then(data => {
        setWeatherData(data);
        setErrorMessage("");
        console.log(JSON.stringify(data));
        fetchAirQualityData(data.coord.lat, data.coord.lon); 
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
        .then(response => {
          setFiveDayForecast(response.data);
        })
        .catch(error => console.error('Error fetching the 5-day forecast data:', error));
    
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        setErrorMessage("City not found. Please try again.");
        setWeatherData(null);
        setFiveDayForecast(null)
    });
  };

  const handleSearch = (searchedCity) => {
    setCity(searchedCity); 
  };

  const toggleUnit = () => {
    setUnit(prevUnit => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };


  return (
    <div className="dashboard">
      <Navbar onSearch={handleSearch} toggleUnit={toggleUnit}/>
      {errorMessage && (
        <div className="error-message" style={{ color: 'red', textAlign: 'center', margin: '20px 0' }}>
            {errorMessage}
        </div>
    )}
      {weatherData && airQualityData &&  (
        <div className="main-content" style={{ display: "flex", padding: "30px", gap: "20px" }}>
          <div className="weather-card" style={{ flex: "1", marginRight: "10px" }}>
            <MainWeatherCard weatherData={weatherData} unit={unit}/>
            <p style={{ fontWeight: "700", fontSize: "20px", marginTop: "20px" }}>5 Days Forecast</p>
            {fiveDayForecast && <FiveDayForecast forecastData={fiveDayForecast} unit={unit}/>}
          </div>
          <div className="highlights-card" style={{ display: "flex", flexDirection: "column", flex: "0.5", gap: "20px", marginRight: "100px" }}>
            <TodayHighlights weatherData={weatherData} airQualityData={airQualityData} unit={unit} />
            
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;