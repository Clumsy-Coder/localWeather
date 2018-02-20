const api = "https://fcc-weather-api.glitch.me/api/current?";
let tempUnit = "C";
let curTempC;
let curResult;

$(document).ready(function() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			getWeather(position.coords.latitude, position.coords.longitude);
		});
	}
	else {
		console.log("Unable to get location. No gps available.");
	}
});

function getWeather(lat, long) {
	const url = `${api}lat=${lat}&lon=${long}`;
	$.ajax({
		url: url,
		success: function(result) {
			$("#loader").addClass("hide");
			curResult = result;
			curTempC = Math.round(result.main.temp * 10) / 10;
			
			$("#mainTemp").html(generateTempHTML(curTempC, true));
			$("#minTemp").html("Min: " + generateTempHTML(result.main.temp_min, false));
			$("#maxTemp").html("Max: " + generateTempHTML(result.main.temp_max, false));
			
			$("#weatherDesc").text(result.description);
			$("#curDate").html(`<h5>${moment().format("MMMM D, h:mm A")}</h5>`);
			
			let code = result.weather[0].id;
			let icon = icons[code].icon;
			// If we are not in the ranges mentioned above, add a day/night prefix.
			if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
				icon = 'day-' + icon;
			}
			$("#weatherIcon").html(`<i class="wi wi-${icon}"></i>`);
		}
	});
}

function toggleUnit() {
	tempUnit = tempUnit.toUpperCase() == "C" ? "F" : "C";
	$("#mainTemp").html(generateTempHTML(tempUnit.toUpperCase() == "C" ? 
										 curTempC : 
										 curTempC * 1.8 + 32, true));
	$("#minTemp").html("Min: " + generateTempHTML(tempUnit.toUpperCase() == "C" ? 
												  curResult.main.temp_min : 
												  curResult.main.temp_min * 1.8 + 32, false));
	$("#maxTemp").html("Max: " + generateTempHTML(tempUnit.toUpperCase() == "C" ? 
												  curResult.main.temp_max : 
												  curResult.main.temp_max * 1.8 + 32, false));
}

function generateTempHTML(temp, main) {
	if(main) {
		// return `<h1>${temp}<sup>${String.fromCharCode(176)} ${getTempUnit()}</sup></h1>`
		return `<h1>${temp}
					<sup>${String.fromCharCode(176)} 
						<a onclick="toggleUnit()">${tempUnit}</a>
					</sup>
				</h1>`;
	}
	else {
		return `<h6>${temp}<sup>${String.fromCharCode(176)}</sup></h6>`;
	}
}
