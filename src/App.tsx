import React, { useState, useEffect } from 'react';
import { Search, Wind, Droplets, Sun, Cloud, CloudRain, CloudSnow, CloudFog, Thermometer, 
         MapPin, Calendar, Clock, Menu, X, Heart, Info, BarChart, Umbrella, ThermometerSnowflake } from 'lucide-react';

// Composant manquant pour la lune
function Moon({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );
}

// Interface pour les données météo
interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
}

// Composant principal
export default function CreativeWeatherApp() {
  const [city, setCity] = useState('Safi');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('today');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unit, setUnit] = useState('metric');
  const [searchFocused, setSearchFocused] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);

  const API_KEY = '6c96a0a2dc372b4d006704a6751f289e';

  // Styles globaux pour les animations
  useEffect(() => {
    const globalStyles = `
      @keyframes raindrop {
        0% { transform: translateY(-20px); }
        100% { transform: translateY(100vh); }
      }
      
      @keyframes snowfall {
        0% { transform: translateY(-20px) rotate(0deg); }
        50% { transform: translateY(50vh) rotate(180deg) translateX(20px); }
        100% { transform: translateY(100vh) rotate(360deg); }
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .animate-raindrop {
        animation: raindrop linear infinite;
      }
      
      .animate-snowfall {
        animation: snowfall linear infinite;
      }
      
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }
      
      .weather-pattern {
        background-image: linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    fetchWeather();
    // Animation de fond au chargement
    setAnimateBackground(true);
    const timer = setTimeout(() => setAnimateBackground(false), 1500);
    return () => clearTimeout(timer);
  }, [unit]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      if (!response.ok) {
        throw new Error('Ville non trouvée');
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError('Impossible de trouver les données météo pour cette ville. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
    setSearchFocused(false);
  };

  const getWeatherIcon = (weatherMain) => {
    if (!weatherMain) return <Sun className="w-16 h-16 text-yellow-400" />;
    
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <Sun className="w-20 h-20 text-yellow-400 animate-pulse" />;
      case 'clouds':
        return <Cloud className="w-20 h-20 text-gray-400" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-20 h-20 text-blue-400" />;
      case 'snow':
        return <CloudSnow className="w-20 h-20 text-blue-200" />;
      case 'mist':
      case 'fog':
      case 'haze':
        return <CloudFog className="w-20 h-20 text-gray-300" />;
      default:
        return <Sun className="w-20 h-20 text-yellow-400" />;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  // Déterminer les couleurs basées sur la météo actuelle
  const getColorScheme = () => {
    if (!weather || !weather.weather || !weather.weather[0]) {
      return {
        gradient: 'from-blue-400 via-purple-300 to-pink-200',
        headerGradient: 'from-indigo-500 to-purple-500',
        cardBg: 'bg-white/80',
        accentColor: 'text-indigo-600',
        accentBg: 'bg-indigo-100',
        buttonBg: 'bg-indigo-500 hover:bg-indigo-600'
      };
    }

    const weatherType = weather.weather[0].main.toLowerCase();
    const temp = weather.main.temp;
    
    // Conditions météo spécifiques
    if (weatherType === 'clear') {
      if (temp > 25) {
        // Temps chaud et ensoleillé
        return {
          gradient: 'from-yellow-300 via-amber-200 to-orange-200',
          headerGradient: 'from-orange-500 to-amber-500',
          cardBg: 'bg-white/80',
          accentColor: 'text-orange-600',
          accentBg: 'bg-orange-100',
          buttonBg: 'bg-orange-500 hover:bg-orange-600'
        };
      } else {
        // Temps frais et ensoleillé
        return {
          gradient: 'from-blue-300 via-cyan-200 to-teal-100',
          headerGradient: 'from-teal-500 to-cyan-500',
          cardBg: 'bg-white/80',
          accentColor: 'text-teal-600',
          accentBg: 'bg-teal-100',
          buttonBg: 'bg-teal-500 hover:bg-teal-600'
        };
      }
    } else if (weatherType === 'clouds') {
      return {
        gradient: 'from-gray-300 via-blue-200 to-gray-200',
        headerGradient: 'from-blue-600 to-gray-600',
        cardBg: 'bg-white/80',
        accentColor: 'text-blue-600',
        accentBg: 'bg-blue-100',
        buttonBg: 'bg-blue-500 hover:bg-blue-600'
      };
    } else if (weatherType === 'rain' || weatherType === 'drizzle') {
      return {
        gradient: 'from-blue-600 via-blue-400 to-indigo-300',
        headerGradient: 'from-indigo-800 to-blue-700',
        cardBg: 'bg-white/80',
        accentColor: 'text-blue-700',
        accentBg: 'bg-blue-50',
        buttonBg: 'bg-blue-600 hover:bg-blue-700'
      };
    } else if (weatherType === 'snow') {
      return {
        gradient: 'from-blue-100 via-gray-100 to-white',
        headerGradient: 'from-blue-400 to-blue-300',
        cardBg: 'bg-white/90',
        accentColor: 'text-blue-500',
        accentBg: 'bg-blue-50',
        buttonBg: 'bg-blue-400 hover:bg-blue-500'
      };
    } else if (weatherType === 'mist' || weatherType === 'fog' || weatherType === 'haze') {
      return {
        gradient: 'from-gray-400 via-gray-300 to-gray-200',
        headerGradient: 'from-gray-700 to-gray-500',
        cardBg: 'bg-white/70',
        accentColor: 'text-gray-700',
        accentBg: 'bg-gray-100',
        buttonBg: 'bg-gray-600 hover:bg-gray-700'
      };
    } else {
      return {
        gradient: 'from-blue-400 via-purple-300 to-pink-200',
        headerGradient: 'from-indigo-500 to-purple-500',
        cardBg: 'bg-white/80',
        accentColor: 'text-indigo-600',
        accentBg: 'bg-indigo-100',
        buttonBg: 'bg-indigo-500 hover:bg-indigo-600'
      };
    }
  };

  const colors = getColorScheme();
  
  // Animation du fond basée sur la météo
  const getWeatherAnimation = () => {
    if (!weather || !weather.weather || !weather.weather[0]) {
      return '';
    }
    
    const weatherType = weather.weather[0].main.toLowerCase();
    
    if (weatherType === 'rain' || weatherType === 'drizzle') {
      return 'animate-rain';
    } else if (weatherType === 'snow') {
      return 'animate-snow';
    } else if (weatherType === 'clear') {
      return 'animate-sun';
    } else {
      return '';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${colors.gradient} transition-all duration-1000 ${animateBackground ? 'scale-105' : 'scale-100'}`}>
      {/* Header */}
      <header className={`bg-gradient-to-r ${colors.headerGradient} text-white shadow-lg z-10`}>
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Umbrella className="h-8 w-8" />
              <h1 className="text-2xl font-bold tracking-wider">Météo</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setActiveSection('today')} 
                className={`px-3 py-2 rounded-full transition-all duration-300 transform ${activeSection === 'today' ? 'bg-white/20 scale-105' : 'hover:bg-white/10'}`}
              >
                Aujourd'hui
              </button>
              <button 
                onClick={() => setActiveSection('forecast')} 
                className={`px-3 py-2 rounded-full transition-all duration-300 transform ${activeSection === 'forecast' ? 'bg-white/20 scale-105' : 'hover:bg-white/10'}`}
              >
                Prévisions
              </button>
              <button 
                onClick={() => setActiveSection('stats')} 
                className={`px-3 py-2 rounded-full transition-all duration-300 transform ${activeSection === 'stats' ? 'bg-white/20 scale-105' : 'hover:bg-white/10'}`}
              >
                Statistiques
              </button>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={toggleUnit}
                className="p-2 bg-white/20 rounded-full mr-2 hover:bg-white/30 transition-all"
              >
                {unit === 'metric' ? '°C' : '°F'}
              </button>
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2 bg-white/20 rounded-full md:hidden hover:bg-white/30 transition-all"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
          
          {/* Menu Mobile */}
          {mobileMenuOpen && (
            <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-xl md:hidden animate-fadeIn">
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => {setActiveSection('today'); setMobileMenuOpen(false);}}
                  className={`p-2 rounded-lg flex items-center ${activeSection === 'today' ? 'bg-white/20' : ''}`}
                >
                  <Sun className="mr-2 h-5 w-5" />
                  <span>Aujourd'hui</span>
                </button>
                <button 
                  onClick={() => {setActiveSection('forecast'); setMobileMenuOpen(false);}}
                  className={`p-2 rounded-lg flex items-center ${activeSection === 'forecast' ? 'bg-white/20' : ''}`}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>Prévisions</span>
                </button>
                <button 
                  onClick={() => {setActiveSection('stats'); setMobileMenuOpen(false);}}
                  className={`p-2 rounded-lg flex items-center ${activeSection === 'stats' ? 'bg-white/20' : ''}`}
                >
                  <BarChart className="mr-2 h-5 w-5" />
                  <span>Statistiques</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Barre de recherche flottante */}
        <div className={`mx-auto max-w-md mb-8 transition-all duration-300 transform ${searchFocused ? 'scale-105' : ''}`}>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Rechercher une ville..."
              className={`w-full p-4 pl-12 pr-12 rounded-full border-0 bg-white/80 backdrop-blur-md shadow-lg focus:ring-2 focus:outline-none ${colors.accentColor} transition-all`}
            />
            <Search className={`absolute left-4 top-4 ${colors.accentColor}`} />
            <button 
              type="submit"
              className={`absolute right-3 top-3 ${colors.buttonBg} text-white p-1 rounded-full transition-all hover:shadow-md`}
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Contenu basé sur la section active */}
        {activeSection === 'today' && (
          <>
            {loading && (
              <div className="flex flex-col items-center justify-center p-12 animate-pulse">
                <div className="w-20 h-20 border-4 border-t-transparent rounded-full border-blue-500 animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium">Recherche des données météo...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md mb-8 animate-fadeIn">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-full">
                    <X className="text-red-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-red-800">Erreur</h3>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {weather && !loading && (
              <div className={`${colors.cardBg} backdrop-blur-md rounded-3xl shadow-xl overflow-hidden transition-all duration-500 animate-fadeIn`}>
                {/* Bannière météo principale */}
                <div className={`p-8 bg-gradient-to-br ${colors.headerGradient} text-white relative overflow-hidden`}>
                  <div className="absolute top-0 left-0 w-full h-full opacity-20 weather-pattern"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10">
                    <div>
                      <div className="flex items-center mb-2">
                        <MapPin className="mr-2" />
                        <h2 className="text-3xl font-bold">{weather.name}, {weather.sys?.country}</h2>
                      </div>
                      <p className="text-white/80">
                        {formatDate(weather.dt)}
                      </p>
                    </div>
                    
                    <div className="mt-6 md:mt-0 flex items-center">
                      <div className="text-center mr-6">
                        <div className="text-6xl font-bold">
                          {Math.round(weather.main?.temp)}°{unit === 'metric' ? 'C' : 'F'}
                        </div>
                        <p className="text-white/80">
                          Ressenti: {Math.round(weather.main?.feels_like)}°{unit === 'metric' ? 'C' : 'F'}
                        </p>
                      </div>
                      <div className="animate-float">
                        {getWeatherIcon(weather.weather?.[0]?.main)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-xl font-medium capitalize">
                      {weather.weather?.[0]?.description}
                    </p>
                  </div>
                </div>

                {/* Détails météo */}
                <div className="p-8">
                  <h3 className={`text-xl font-semibold mb-6 ${colors.accentColor}`}>Détails météorologiques</h3>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className={`${colors.accentBg} rounded-2xl p-6 transform transition-transform hover:scale-105`}>
                      <div className="flex items-center justify-center mb-3">
                        <Thermometer className={`h-8 w-8 ${colors.accentColor}`} />
                      </div>
                      <div className="text-center">
                        <h4 className="text-gray-600 mb-1">Min / Max</h4>
                        <p className="text-xl font-bold">
                          {Math.round(weather.main?.temp_min)}° / {Math.round(weather.main?.temp_max)}°
                        </p>
                      </div>
                    </div>
                    
                    <div className={`${colors.accentBg} rounded-2xl p-6 transform transition-transform hover:scale-105`}>
                      <div className="flex items-center justify-center mb-3">
                        <Wind className={`h-8 w-8 ${colors.accentColor}`} />
                      </div>
                      <div className="text-center">
                        <h4 className="text-gray-600 mb-1">Vent</h4>
                        <p className="text-xl font-bold">
                          {weather.wind?.speed} {unit === 'metric' ? 'm/s' : 'mph'}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`${colors.accentBg} rounded-2xl p-6 transform transition-transform hover:scale-105`}>
                      <div className="flex items-center justify-center mb-3">
                        <Droplets className={`h-8 w-8 ${colors.accentColor}`} />
                      </div>
                      <div className="text-center">
                        <h4 className="text-gray-600 mb-1">Humidité</h4>
                        <p className="text-xl font-bold">
                          {weather.main?.humidity}%
                        </p>
                      </div>
                    </div>
                    
                    <div className={`${colors.accentBg} rounded-2xl p-6 transform transition-transform hover:scale-105`}>
                      <div className="flex items-center justify-center mb-3">
                        <Clock className={`h-8 w-8 ${colors.accentColor}`} />
                      </div>
                      <div className="text-center">
                        <h4 className="text-gray-600 mb-1">Pression</h4>
                        <p className="text-xl font-bold">
                          {weather.main?.pressure} hPa
                        </p>
                      </div>
                    </div>
                  </div>

                  {weather.sys && (
                    <div className="mt-8">
                      <h3 className={`text-xl font-semibold mb-6 ${colors.accentColor}`}>Lever et coucher du soleil</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`relative ${colors.accentBg} rounded-2xl p-6 overflow-hidden transform transition-transform hover:scale-105`}>
                          <div className="absolute top-0 right-0 opacity-10">
                            <Sun className="h-24 w-24 text-yellow-500" />
                          </div>
                          <div className="relative z-10 flex items-center">
                            <Sun className="h-10 w-10 text-yellow-500 mr-4" />
                            <div>
                              <h4 className="text-gray-600 mb-1">Lever du soleil</h4>
                              <p className="text-xl font-bold">
                                {formatTime(weather.sys.sunrise)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`relative ${colors.accentBg} rounded-2xl p-6 overflow-hidden transform transition-transform hover:scale-105`}>
                          <div className="absolute top-0 right-0 opacity-10">
                            <Moon className="h-24 w-24 text-blue-800" />
                          </div>
                          <div className="relative z-10 flex items-center">
                            <Moon className="h-10 w-10 text-blue-800 mr-4" />
                            <div>
                              <h4 className="text-gray-600 mb-1">Coucher du soleil</h4>
                              <p className="text-xl font-bold">
                                {formatTime(weather.sys.sunset)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Widget météo recommandations */}
                  <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 opacity-20">
                      <Umbrella className="h-40 w-40" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Recommandations du jour</h3>
                    <p className="mb-4 relative z-10">
                      {weather.weather[0].main === 'Rain' ? 
                        "N'oubliez pas votre parapluie ! Il pleut actuellement." :
                        weather.weather[0].main === 'Clear' && weather.main.temp > 25 ? 
                        "Il fait chaud et ensoleillé ! N'oubliez pas votre protection solaire." :
                        weather.weather[0].main === 'Snow' ?
                        "Il neige ! Couvrez-vous bien avant de sortir." :
                        weather.weather[0].main === 'Clouds' ?
                        "Le ciel est nuageux aujourd'hui, mais les précipitations sont peu probables." :
                        "Consultez régulièrement les prévisions pour planifier votre journée."
                      }
                    </p>
                    <div className="mt-2 flex justify-end">
                      <button className="flex items-center text-white/80 hover:text-white">
                        <Info size={16} className="mr-1" />
                        <span>Plus d'infos</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeSection === 'forecast' && (
          <div className={`${colors.cardBg} backdrop-blur-md rounded-3xl shadow-xl p-8 animate-fadeIn`}>
            <h2 className="text-3xl font-bold mb-8 text-center">Prévisions sur 5 jours</h2>
            
            <div className="flex overflow-x-auto pb-4 space-x-4 mb-8">
              {[1, 2, 3, 4, 5].map((day) => (
                <div key={day} className={`flex-shrink-0 w-40 ${colors.accentBg} rounded-2xl p-4 transform transition-transform hover:scale-105`}>
                  <div className="text-center">
                    <p className="font-medium text-gray-600 mb-2">
                      {new Date(Date.now() + day * 86400000).toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </p>
                    <div className="mb-2">
                      {day % 5 === 0 ? 
                        <CloudRain className="mx-auto h-8 w-8 text-blue-500" /> :
                        day % 3 === 0 ? 
                        <Cloud className="mx-auto h-8 w-8 text-gray-500" /> :
                        <Sun className="mx-auto h-8 w-8 text-yellow-500" />
                      }
                    </div>
                    <p className="text-xl font-bold">
                      {Math.round(20 - day + Math.random() * 5)}°{unit === 'metric' ? 'C' : 'F'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.round(15 - day + Math.random() * 5)}°{unit === 'metric' ? 'C' : 'F'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Prévisions horaires</h3>
              <p className="text-gray-600 mb-6">Consultez les prévisions détaillées heure par heure</p>
              
              {/* <img src="/api/placeholder/800/300" alt="Hourly forecast chart" className="rounded-xl w-full" /> */}
            </div>
          </div>
        )}

        {activeSection === 'stats' && (
          <div className={`${colors.cardBg} backdrop-blur-md rounded-3xl shadow-xl p-8 animate-fadeIn`}>
            <h2 className="text-3xl font-bold mb-8 text-center">Statistiques Météo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Température moyenne</h3>
                <div className="flex items-center justify-between">
                  <Thermometer className="h-12 w-12 text-red-500" />
                  <div className="text-right">
                    <p className="text-3xl font-bold">{Math.round(20 + Math.random() * 5)}°{unit === 'metric' ? 'C' : 'F'}</p>
                    <p className="text-sm text-gray-500">Ce mois-ci</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-blue-300 to-red-500 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Min: {Math.round(15 + Math.random() * 2)}°</span>
                    <span>Max: {Math.round(25 + Math.random() * 3)}°</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Humidité relative</h3>
                <div className="flex items-center justify-between">
                  <Droplets className="h-12 w-12 text-blue-500" />
                  <div className="text-right">
                    <p className="text-3xl font-bold">{Math.round(60 + Math.random() * 20)}%</p>
                    <p className="text-sm text-gray-500">Ce mois-ci</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-blue-300 to-blue-600 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Min: {Math.round(50 + Math.random() * 5)}%</span>
                    <span>Max: {Math.round(80 + Math.random() * 10)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Vitesse du vent</h3>
                <div className="flex items-center justify-between">
                  <Wind className="h-12 w-12 text-teal-500" />
                  <div className="text-right">
                    <p className="text-3xl font-bold">{Math.round(5 + Math.random() * 10)} {unit === 'metric' ? 'm/s' : 'mph'}</p>
                    <p className="text-sm text-gray-500">Ce mois-ci</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-teal-300 to-teal-600 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Min: {Math.round(2 + Math.random() * 3)} {unit === 'metric' ? 'm/s' : 'mph'}</span>
                    <span>Max: {Math.round(15 + Math.random() * 5)} {unit === 'metric' ? 'm/s' : 'mph'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Pression atmosphérique</h3>
                <div className="flex items-center justify-between">
                  <ThermometerSnowflake className="h-12 w-12 text-purple-500" />
                  <div className="text-right">
                    <p className="text-3xl font-bold">{Math.round(1013 + Math.random() * 10)} hPa</p>
                    <p className="text-sm text-gray-500">Ce mois-ci</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-purple-300 to-purple-600 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Min: {Math.round(1000 + Math.random() * 5)} hPa</span>
                    <span>Max: {Math.round(1020 + Math.random() * 5)} hPa</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-2xl">
              <h3 className="text-xl font-semibold mb-6 text-blue-800">Historique des températures</h3>
              {/* <img src="/api/placeholder/800/300" alt="Temperature history chart" className="rounded-xl w-full" /> */}
              <div className="mt-4 flex justify-center">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button className="px-4 py-2 text-sm font-medium text-blue-800 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700">
                    Semaine
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-blue-800 bg-blue-100 border-t border-b border-r border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700">
                    Mois
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-blue-800 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700">
                    Année
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Weather Animation Elements */}
      {weather && weather.weather && weather.weather[0] && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {weather.weather[0].main === 'Rain' && (
            Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute bg-blue-400 opacity-30 rounded-full animate-raindrop"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 10 + 10}px`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 1 + 0.5}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))
          )}
          
          {weather.weather[0].main === 'Snow' && (
            Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute bg-white rounded-full animate-snowfall"
                style={{
                  width: `${Math.random() * 5 + 3}px`,
                  height: `${Math.random() * 5 + 3}px`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 5 + 3}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))
          )}
          
          {weather.weather[0].main === 'Clouds' && (
            Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i}
                className="absolute bg-white/30 rounded-full blur-3xl animate-float"
                style={{
                  width: `${Math.random() * 200 + 100}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 30 + 10}%`,
                  animationDuration: `${Math.random() * 10 + 20}s`,
                  animationDelay: `${Math.random() * 10}s`
                }}
              ></div>
            ))
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <Umbrella className="h-6 w-6" />
                <h3 className="text-xl font-bold">Météo</h3>
              </div>
              <p className="text-sm text-gray-400 mt-1">Données météorologiques simples et élégantes</p>
            </div>
            
            <div className="flex space-x-8">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span>À propos</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span>API</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span>Contact</span>
              </a>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <Heart size={16} className="animate-pulse" />
                <span>Favoris</span>
              </button>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} MétéoCréative. Tous droits réservés.</p>
            <p className="mt-1">Données fournies par OpenWeatherMap</p>
          </div>
        </div>
      </footer>
    </div>
  );
}