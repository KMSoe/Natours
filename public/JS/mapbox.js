const locations = document.getElementById('map').dataset.locations;

mapboxgl.accessToken = 'pk.eyJ1Ijoia21zb2UiLCJhIjoiY2tiMHVxbWFlMDZtdTJ5bWl5MW96dTZzdyJ9.jkOkDsAnqpuywjyFbMAZsQ';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11'
});