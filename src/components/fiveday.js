import React from "react";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloudIcon from '@mui/icons-material/Cloud';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const FiveDayForecast = ({ forecastData, unit }) => {
    const dayInAWeek = new Date().getDay();
    const adjustedDayIndex = (dayInAWeek + 6) % 7;
    const forecastDays = WEEK_DAYS.slice(adjustedDayIndex).concat(WEEK_DAYS.slice(0, adjustedDayIndex));

    const renderTemperatureIcon = (temperatureCelsius) => {
        if (temperatureCelsius > 23) {
            return <WbSunnyIcon style={{ fontSize: '2rem', color: 'orange' }} />;
        } else if (temperatureCelsius < 10) {
            return <AcUnitIcon style={{ fontSize: '2rem', color: 'blue' }} />;
        } else {
            return <CloudIcon style={{ fontSize: '2rem', color: 'gray' }} />;
        }
    };

    const displayTemperature = (temperature) => {
        if (unit === 'metric') {
            return `${Math.round(temperature)}°C`;
        } else {
            const temperatureFahrenheit = (temperature * 9/5) + 32;
            return `${Math.round(temperatureFahrenheit)}°F`;
        }
    };

    return (
        <div className="five-day-forecast"
            style={{
                backgroundColor: "#4B5563",
                color: "white",
                borderRadius: "0.5rem",
                width: "500px",
                padding: "20px",
            }}
        >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: "left", padding: "6px" }}>Day</th>
                        <th style={{ textAlign: "right", padding: "5px" }}>Temp (°C)</th>
                        <th style={{ textAlign: "right", padding: "5px" }}>Min Temp (°C)</th>
                        <th style={{ textAlign: "right", padding: "5px" }}>Max Temp (°C)</th>
                        <th style={{ textAlign: "left", padding: "5px" }}>Description</th>
                        <th style={{ textAlign: "center", padding: "5px" }}>Icon</th>
                    </tr>
                </thead>
                <tbody>
                    {forecastData.list.slice(0, 5).map((item, index) => {
                        const day = forecastDays[index];

                        const temperature = displayTemperature(Math.round(item.main.temp));
                        const minTemperature = displayTemperature(Math.round(item.main.temp_min));
                        const maxTemperature = displayTemperature(Math.round(item.main.temp_max));

                        return (
                            <tr key={index} style={{ borderBottom: "1px solid white" }}>
                                <td style={{ padding: "5px" }}>{day}</td>
                                <td style={{ padding: "5px", textAlign: "center" }}>
                                    {temperature}
                                </td>
                                <td style={{ padding: "5px", textAlign: "center" }}>
                                    {minTemperature}
                                </td>
                                <td style={{ padding: "5px", textAlign: "center" }}>
                                    {maxTemperature}
                                </td>
                                <td style={{ padding: "5px" }}>
                                    {item.weather[0].description}
                                </td>
                                <td style={{ textAlign: "center", padding: "5px" }}>
                                    {renderTemperatureIcon(temperature)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default FiveDayForecast;