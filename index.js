
const apikey = "6b977ec5f2e50dbaffb40e042e32510b";
const input = document.getElementById("city-input");
const citys = document.getElementById("city-name");
const button = document.getElementById("button");
const temps = document.querySelector(".temp");
const descriptions = document.querySelector(".description");
const spans = document.querySelectorAll(".details span");
const icon = document.querySelector(".icon");
const img = document.getElementById("img");
const container = document.querySelector(".container");
const forecastContainer = document.querySelector(".forecast-container");
const date = document.querySelector(".date");


button.addEventListener('click', async event => {
    
    const val = input.value;
    if(val){
        try{       
            const days = await get5day(val);
            display(days);
        }
        catch(error){
            container.style.display = "none";
            citys.textContent = "City Does not Exist";
            forecastContainer.style.display = "none";
            console.log("error")
        }
    }

});


function display(data){
    container.style.display = "flex";
    forecastContainer.style.display = "grid";


    const {
        city: {name : cityname},
        list: [{ main: { temp, humidity }, weather: [{ description, id }], wind: { speed } }]
    } = data;
    
    date.textContent = new Date().toLocaleString();
    citys.textContent = cityname;
    temps.textContent =  temp.toFixed(1) + "°C";   //`${(temp - 273.15).toFixed(1)}°C`;
    descriptions.textContent = description;
    spans[0].textContent =`Humidity ${humidity}%`;
    spans[1].textContent = `Wind ${speed}km/h`;
    img.src = getEmoji(id);
    display5weather(data);

}

function getEmoji(id){
    switch(true){
        case (id >= 200 && id <300 ):
            return "https://cdn-icons-png.flaticon.com/128/1146/1146860.png";
        case (id >= 300 && id <400 ):
            return "https://cdn-icons-png.flaticon.com/128/4088/4088981.png";
        case (id >= 500 && id <600 ):
            return "https://cdn-icons-png.flaticon.com/128/4724/4724094.png";
        case (id >= 600 && id <700 ):
            return "https://cdn-icons-png.flaticon.com/128/2315/2315309.png";
        case (id === 800):
            return "https://cdn-icons-png.flaticon.com/128/4814/4814268.png";
        case (id >= 801 && id <810 ):
                return "https://cdn-icons-png.flaticon.com/128/1163/1163624.png";
        default:
            return "🌈" ;
    }
}

async function get5day(input){
    try{
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${input}&appid=${apikey}&units=metric`;
        const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error("Could not Fetch data");
    }
    return await response.json();       
    
    }
    catch(error){
        console.error();
    }
}

async function advancedLocationCheck() {

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
      (position) => {
        getCurrent(position.coords.latitude, position.coords.longitude);
       //console.log("Position obtained:", position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        // More detailed error logging
        container.style.display = "none";
        forecastContainer.style.display = "none";
        citys.textContent = "Geolocation Error";
        console.error("Geolocation Error Details:", {
          code: error.code,
          message: error.message
        });
      },
      {
        // More aggressive location settings
        enableHighAccuracy: true,
        timeout: 5000,  // Increased timeout to 10 seconds
        maximumAge: 30000 // Allow cached location up to 30 seconds
      }
    );

    
    

  } 
  else {
    console.error("Geolocation not supported at all");
  }
}

function display5weather(forecastdata){
   let index=0;
    document.querySelectorAll('.forecast-card').forEach(card => {
        
        
        card.querySelector('.forecast-day').textContent = new Date(forecastdata.list[index].dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
        // Get the temperature
        card.querySelector('.forecast-temp').textContent = forecastdata.list[index].main.temp.toFixed(1)+"°C";

        // Get the weather icon
        card.querySelector('.forecast-icon img').src = getEmoji(forecastdata.list[index].weather[0].id);
        
        // Get description, humidity and wind speed
        card.querySelector('.forecast-details > span').textContent = forecastdata.list[index].weather[0].description;
        card.querySelector('.forecast-info span:first-child').textContent = "H: "+forecastdata.list[index].main.humidity +"%";
        card.querySelector('.forecast-info span:last-child').textContent  = "W: "+forecastdata.list[index].wind.speed+"km/h" ;

        index+=8;
    });


    
}

async function getCurrent(lat,lon){
    try{
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
        const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error("Could not Fetch data");
    }
    const data = await response.json();
    display(data);  
    
    
    }
    catch(error){
        console.error();
    }
}