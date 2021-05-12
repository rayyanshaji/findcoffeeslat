  	var map;
  	var infoWindow;
  	
  	//function called each time the page is refreshed
  	function initialize(){
  		// Default Location of Indigo Slate Headquarters
  		var center = new google.maps.LatLng(47.6303624, -122.148335);
  		map = new google.maps.Map(document.getElementById('map'),
  		{
  			center: center,
  			zoom: 13
  		});
  	
  		var request = {
  			location: center,
  			radius: 8047,
  			types: ['cafe']
  		};

  		infoWindow = new google.maps.InfoWindow();
  		var service = new google.maps.places.PlacesService(map);
  		service.nearbySearch(request, callback);
  	}

  	// fetch results from google maps API search
  	function callback(results, status) {
  		var nearestCoffee = [];
  		if(status == google.maps.places.PlacesServiceStatus.OK){
  			for (var i = 0; i < results.length; i++){
  				createMarker(results[i]);
  				var index = i;
  				nearestCoffee.push({
  					name: results[i].name, 
  					photo: results[i].photos, 
  					location: results[i].vicinity, 
  					rating: results[i].rating,
  					price: results[i].price_level, 
  					distance: calculateDistance(47.6303624, -122.148335, results[i].geometry.location.lat(), results[i].geometry.location.lng())
  				});
  			}

  			nearestCoffee.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
  			sendResponse(nearestCoffee);

  			var options = document.getElementById("sortBy");
  			var val;
  			options.addEventListener("change", function(){
  			val = this.value;
  			if(!val || val == null){
  				return;
  			}
  			if(val == "rating"){
  				nearestCoffee.sort((a, b) => (a.rating > b.rating) ? 1 : -1);
  			} else if(val == "distance"){
  				nearestCoffee.sort((a, b) => (a.distance < b.distance) ? 1 : -1);
  			} else if(val == "pricing"){
  				nearestCoffee.sort((a, b) => (a.price > b.price) ? 1 : -1);
  			}
  			document.getElementById("appmain").innerHTML = ''; 
  			sendResponse(nearestCoffee);
  			});
  		}
  	}

  	// Send recieved response and loop through it to append to DOM
  	function sendResponse(nearestCoffee){
  		for (var i = 0; i < nearestCoffee.length; i++){
  				appendtoHTML(i, nearestCoffee[i].name, nearestCoffee[i].photo, nearestCoffee[i].location, nearestCoffee[i].rating, nearestCoffee[i].price, nearestCoffee[i].distance);
  		}
  	}

  	// create elements and append arguments to them
  	function appendtoHTML(index, name, photo, location, rating, price, distance) {
  		
  		const main              = document.getElementById("appmain");
  		const createHtml        = document.createElement('div');
  		createHtml.setAttribute("class", "app_top");
  		createHtml.setAttribute("id", "coffee-shops-info"+index);
  		main.appendChild(createHtml);
  		
  		const html              = document.getElementById('coffee-shops-info'+index);
  		const div               = document.createElement('div');
  		div.setAttribute("id", "info"+index);
  		html.appendChild(div);


  		var img                 = document.createElement("img");
  		var divImg              = document.getElementById("info"+index);
 		
 		if(photo){
    		img.src             = photo[0].getUrl({'maxWidth': 200, 'maxHeight': 250});
   			divImg.appendChild(img); 
  		} else {
  			img.src             = "https://via.placeholder.com/200x150?text=Image+Not+Available";
  			divImg.appendChild(img);
  		} 

  		//Create elements that will hold details from arguments
  		var para                = document.createElement('p');
  		var nameSpan            = document.createElement('span');
  		nameSpan.setAttribute("class","app_text");

  		var locationSpan        = document.createElement('span');
  		locationSpan.setAttribute("class","app_text");

  		var ratingSpan          = document.createElement('span');
  		ratingSpan.setAttribute("class","app_text");

  		var distanceSpan        = document.createElement('span');
  		distanceSpan.setAttribute("class","app_text");

  		var priceSpan           = document.createElement('span');
  		priceSpan.setAttribute("class","app_text");

  		nameSpan.textContent    = "Name: "+name;
  		locationSpan.textContent= "Location: "+location;
  		ratingSpan.textContent  = "Rating: "+rating;
  		distanceSpan.textContent= "Distance: "+distance.toFixed(2) + "miles";

  		var dollarSymbol = '';
  		for(var i =0; i<price; i++){
  			dollarSymbol+= "$";
  		}
  		priceSpan.textContent = "Price: "+dollarSymbol;

  		//Append all nodes to DOM
  		html.appendChild(divImg);
  		para.appendChild(nameSpan);
  		para.appendChild(locationSpan);
  		para.appendChild(ratingSpan);
  		para.appendChild(distanceSpan);
  		para.appendChild(priceSpan);
  		html.appendChild(para);	
  	}

  	//Show red markers where coffee shops/cafe's are found with an infoWindow
  	function createMarker(place)
  	{
  		var placeLoc = place.geometry.location;
  		var marker = new google.maps.Marker({
  			map: map,
  			position: place.geometry.location
  		});

  		google.maps.event.addListener(marker, 'click', function() {
  			infoWindow.setContent(place.name);
  			infoWindow.open(map, this);
  		});
  	}

  	//Calculate distance based on two sets of latitude and longitude
  	function calculateDistance(latitude1, longitude1, latitude2, longitude2){
  		unit = "N";
  		if ((latitude1 == latitude2) && (longitude1 == longitude2)) {
			return 0;
		}
		else {
		var radlat1 = Math.PI * latitude1/180;
		var radlat2 = Math.PI * latitude2/180;
		var theta = longitude1-longitude2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
		}
  	}
  	google.maps.event.addDomListener(window, 'load', initialize);