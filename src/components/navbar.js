import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import FilterDramaTwoToneIcon from '@mui/icons-material/FilterDramaTwoTone';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const GEO_API_URL = "http://api.openweathermap.org/geo/1.0/direct";
const API_KEY = "33eb44102688625565a10df87f403860";

const Navbar = ({ onSearch, toggleUnit }) => {
    const [searchCity, setSearchCity] = useState("");
    const [cityOptions, setCityOptions] = useState([]);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [unit, setUnit] = useState('metric');

    const handleSearchClick = () => {
        if (searchCity.trim()) {
            onSearch(searchCity);
            setSearchCity("");
            setDropdownVisible(false);
        }
    };

    const fetchCityOptions = async (inputValue) => {
        if (!inputValue) return;

        const response = await fetch(`${GEO_API_URL}?q=${inputValue}&limit=5&appid=${API_KEY}`);
        const data = await response.json();
        
        if (data.length && Array.isArray(data) > 0) {
            const options = data.map((city) => ({
                value: city.name,
                label: `${city.name}, ${city.country}`
            }));
            setCityOptions(options);
        } else {
            setCityOptions([]);
        }
    };

    useEffect(() => {
        if (searchCity) {
            fetchCityOptions(searchCity);
            setDropdownVisible(true);
        } else {
            setDropdownVisible(false);
            setCityOptions([]);
        }
    }, [searchCity]);

    const handleOptionClick = (city) => {
        setSearchCity(city.value);
        onSearch(city.value);
        setDropdownVisible(false);
    };

    const handleUnitChange = (event, newUnit) => {
        if (newUnit) {
            setUnit(newUnit);
            toggleUnit(newUnit);
        }
    };

    return (
        <nav className="navbar"
            style={{
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
            padding: "10px",
            paddingLeft: '30px',
            paddingRight: '30px'
            }}
        >
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <FilterDramaTwoToneIcon />
            <p style={{ fontWeight: "bold", fontSize: "20px" }}>Weather</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", position: "relative"}}>
            <TextField
                variant="outlined"
                placeholder="Search city 'London'"
                size="small"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                style={{
                backgroundColor: "white",
                borderRadius: "2rem",
                width: "22rem",
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
        <Button
            variant="contained"
            onClick={handleSearchClick}
            style={{ borderRadius: "6px" ,backgroundColor: '#4B5550'}}
        >
            Search
        </Button>
        {isDropdownVisible && (
            <div style={{
                position: "absolute",
                top: "100%",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%",
                maxHeight: "150px",
                overflowY: "auto",
                zIndex: 10,
            }}>
                {cityOptions.map((city, index) => (
                    <div
                        key={index}
                        onClick={() => handleOptionClick(city)}
                        style={{
                            padding: "8px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        {city.label}
                    </div>
                ))}
            </div>
        )}
        </div>
        <ToggleButtonGroup
                value={unit}
                exclusive
                onChange={handleUnitChange}
                aria-label="temperature unit"
                style={{
                    marginLeft: '20px',
                    display: 'flex',
                    border: '1px solid #4B5563',
                    borderRadius: '4px',
                    overflow: 'hidden',
                }}
        >
                <ToggleButton value="metric" aria-label="Celsius"
                style={{
                    backgroundColor: unit === 'metric' ? '#3B3B3B' : 'white',
                    color: unit === 'metric' ? 'white' : 'black',
                    border: 'none',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    }}
                >
                    °C
                </ToggleButton>
                <ToggleButton value="imperial" aria-label="Fahrenheit"
                style={{
                    backgroundColor: unit === 'imperial' ? '#3B3B3B' : 'white',
                    color: unit === 'imperial' ? 'white' : 'black',
                    border: 'none',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                }}
                >
                    °F
                </ToggleButton>
        </ToggleButtonGroup>
    </nav>
    );
};

export default Navbar;