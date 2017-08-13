var username = "****************";
var request = new XMLHttpRequest();

var add;
var latlng;
var map;
var marker;
var geocoder;
var lat;
var lng;
var temperature;
var cloud;
var wind;

function initialize () {
add="";
initMap.call();
}

function initMap() {
geocoder = new google.maps.Geocoder();
map = new google.maps.Map(document.getElementById('map'), {
center: {lat: 32.75, lng: -97.13},zoom: 17
});
google.maps.event.addListener(map,'click',function(event){
lat = event.latLng.lat();
lng = event.latLng.lng();
geocoder.geocode({'location':{lat,lng}}, function(results, status) {
if (status == google.maps.GeocoderStatus.OK) {
add=results[0].formatted_address;
latlng=results[0].geometry.location;
sendRequest.call();
}});
});
}

function sendRequest () {
    request.onreadystatechange = displayResult;
    request.open("GET"," http://api.geonames.org/findNearByWeatherXML?lat="+lat+"&lng="+lng+"&username="+username);
    request.withCredentials = false;
    request.send(null);
}

//display result includes reverse geocoding
function displayResult () {
	if (request.readyState == 4) {
if(typeof marker!= 'undefined')
      marker.setMap(null);
var xml = request.responseXML.documentElement;
temperature = xml.getElementsByTagName("temperature")[0].innerHTML;
cloud = xml.getElementsByTagName("clouds")[0].innerHTML;
wind = xml.getElementsByTagName("windSpeed")[0].innerHTML;
document.getElementById("output").innerHTML=document.getElementById("output").innerHTML+"</br>"+add+", "+temperature+", "+cloud+", "+wind;
geocoder.geocode( { 'address': add}, function(results, status) {
if (status == google.maps.GeocoderStatus.OK) {
latlng=results[0].geometry.location;
mapMarker.call();}
else {alert("ERROR: " + status);}
});
 }
}

function mapMarker() {
	map.setCenter(latlng);
	marker = new google.maps.Marker({
				map: map, position: latlng
				});
	google.maps.event.addListener(marker, 'click', function() {
	var infowindow = new google.maps.InfoWindow();
	infowindow.setContent('<div>' + add+", "+temperature+", "+cloud+", "+wind + '</div>');
	infowindow.open(map, this);
	});

}
