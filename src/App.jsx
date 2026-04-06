import { useState } from 'react';

function capitalize(str) {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function App() {
  const [showWeather, setShowWeather] = useState(false);
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [localTime, setLocalTime] = useState("");

  const getGradByWeather = (condition) => {
    const lower = condition.toLowerCase();
    if (lower.includes("cloud")) return "from-gray-300 to-gray-500";
    if (lower.includes("rain")) return "from-blue-400 to-blue-700";
    if (lower.includes("clear")) return "from-yellow-200 to-yellow-500";
    if (lower.includes("snow")) return "from-blue-100 to-white";
    if (lower.includes("thunder")) return "from-gray-700 to-black";
    return "from-blue-100 to-blue-300"; //default
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true); //start loading
    
    const apiKey = import.meta.env.VITE_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod === 200) {
        setWeatherData(data); //sets weather info

        const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
        const localTime = new Date(utcTime + data.timezone * 1000);

        setLocalTime(localTime.toLocaleString());
        setShowWeather(true);
      } else {
        setError("City not found. Please try again");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.")
    }
    setLoading(false);
  };

  return (
  <div className={`min-h-screen flex flex-col transition-all duration-500 bg-gradient-to-br ${
  showWeather && weatherData
    ? getGradByWeather(weatherData.weather[0].description)
    : "from-blue-100 to-blue-300"
}`}>
    <div className="flex items-center justify-center gap-2 p-6">
      
   </div>

    {!showWeather ? (
      loading ? (
        <div className="mt-6 flex flex-col items-center justify-center text-blue-600">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 font-medium">Fetching Weather...</p>
        </div>
      ) : (
      <>  
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400 text-center">
        Weather App
      </h1>  
      <p className="text-center text-gray-600 text-lg mt-2">
      Get real-time weather info instantly.
      </p>
      <form className="flex flex-col items-center">
        <label className="mb-2 text-gray-700 mt-2 font-bold text-3xl">Enter city: </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Delhi"
          className="py-2 px-4 border rounded mb-4 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-2xl h-7"
        />
        <button
          type="submit"
          disabled={city.trim() === ""||loading}
          onClick={handleSubmit}
          className={`text-white p-2 rounded ${
            city.trim() === ""
              ? "bg-blue-100 cursor-not-allowed text-black"
              : "bg-blue-500 hover:bg-blue-700 text-white"
          }`}
        >
          Get Weather
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </>
      )
    ) : (
      <>
      <div className="text-left mt-4 flex justify-center flex-col items-center text-2xl ">
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          alt="Weather icon"
          className="w-20 h-20 mx-auto"
        />
        <p><strong>City:</strong> {weatherData.name}</p>
        <p><strong>Temperature:</strong> {weatherData.main.temp}</p>
        <p><strong>Condition:</strong> {capitalize(weatherData.weather[0].description)}</p>
        <p><strong>Local Date and Time: </strong>{localTime}</p>
      </div>
      <div className="flex justify-center">
        <button
          onClick={ () => {
            setShowWeather(false);
            setCity("");
            setWeatherData(null);
            setError("");
          }} 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded ">
            Search Again
        </button>
      </div>
      </>
    )}
  </div>
);

}
