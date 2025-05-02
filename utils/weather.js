// export async function fetchWeather(lat, lon, apiKey) {
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
//     const res = await fetch(url);
//     if (!res.ok) throw new Error('Failed to fetch weather');
//     return await res.json();
//   }
  
//   export function getIconNameForWeather(condition) {
//     switch (condition.toLowerCase()) {
//       case 'clear': return 'sun';
//       case 'clouds': return 'cloud';
//       case 'rain': return 'cloud-rain';
//       case 'snow': return 'cloud-snow';
//       case 'thunderstorm': return 'cloud-lightning';
//       case 'drizzle': return 'cloud-drizzle';
//       case 'mist':
//       case 'fog':
//       case 'haze': return 'cloud-fog';
//       default: return 'cloud';
//     }
//   }
// TODO: Re-enable weather API when userbase exceeds 200
