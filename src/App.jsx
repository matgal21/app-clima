import { useEffect, useState } from "react";
import { getCountries } from "./services/getCountries";
import { getCities } from "./services/getCities";
import { getCityWeather } from "./services/weather";
import './App.css';

const DEFAULT_CITIES = [
  { name: "New York", country: "us" },
  { name: "London", country: "gb" },
  { name: "Paris", country: "fr" },
  { name: "Tokyo", country: "jp" },
  { name: "Los Angeles", country: "us" }
];

const App = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [defaultWeatherData, setDefaultWeatherData] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);

  // Fetch default cities weather on component mount
  useEffect(() => {
    (async () => {
      const defaultWeather = await Promise.all(
        DEFAULT_CITIES.map(city => getCityWeather(city.name))
      );
      setDefaultWeatherData(defaultWeather);
    })();
  }, []);

  // Fetch countries on component mount
  useEffect(() => {
    (async () => {
      setCountries(await getCountries());
    })();
  }, []);

  const countryHandler = async e => {
    if (e.currentTarget.value) {
      setCities(await getCities(e.currentTarget.value));
    }
    setSelectedCities([]);
    setWeatherData([]);
  };

  const cityHandler = async e => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setSelectedCities(selectedOptions);

    const weatherResponses = await Promise.all(selectedOptions.map(city => getCityWeather(city)));
    setWeatherData(weatherResponses);
  };

  return (
    <div className="div">
      <h1 className="text-white"><a href="/">APP CLIMA</a></h1>
      <nav className="navbar">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#principales">Principales</a></li>
          <li><a href="#mas-buscados">Mas Buscados</a></li>
        </ul>
      </nav>

      {/* Default cities weather */}
      <div className="default-weather">
        <div className="weather-cards">
        <h3 className="">Ciudades más buscadas...</h3>
          {defaultWeatherData.map((weather, index) => {
            const cityInfo = DEFAULT_CITIES[index];
            return (
              <div key={weather.id} className="weather-card">
                <h3>
                  <img
                    src={`https://flagcdn.com/w40/${cityInfo.country}.png`}
                    alt={`${cityInfo.name} flag`}
                    style={{ width: "20px", height: "15px", marginRight: "10px" }}
                  />
                  {weather.name}
                </h3>
                <h4>
                 Temperatura {weather.main.temp}º 
                  <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="weather icon" />
                </h4>
                <p>MÍN {weather.main.temp_min.toFixed()}° | MÁX {weather.main.temp_max.toFixed()}°</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="div-pais">
        <label>Elige un país:</label>
        <select onChange={countryHandler}>
          <option value="">Selecciona un país</option>
          {countries.map(country => (
            <option key={country.cca2} value={country.cca2}>{country.name.common}</option>
          ))}
        </select>
      </div>

      {cities.length > 0 && (
        <div className="div-ciudad">
          <label>Elige hasta 5 ciudades:</label>
          <select multiple onChange={cityHandler}>
            {cities.map(city => (
              <option key={city.id} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>
      )}

      <hr />

      {weatherData.length > 0 && (
        <div className="div-temp">
          {weatherData.map(weather => (
            <div key={weather.id} className="weather-card">
              <h2>{weather.name}</h2>
              <h2 className="mb-32">
                {weather.main.temp}º 
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="weather icon" />
              </h2>
              <h3>{weather.main.temp_min.toFixed()}° | {weather.main.temp_max.toFixed()}°</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
