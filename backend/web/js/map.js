/** icon **/
var iconOstanovka = L.icon({
    iconUrl: '/images/halt.svg',
    iconSize: [15, 15],
    iconAnchor: [7, 7],
    popupAnchor: [0, 0],
});
/** icon end **/

var map, marker,
    crs = L.CRS.EPSG3395,
    latCity = 44.847532551949534,
    lonCity = 65.53310394287111,
    $Yandex = L.tileLayer('https://vec0{s}.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&lang=ru',
        {id: 'ynd', subdomains: '1234', crs: L.CRS.EPSG3395}),
    $lat = $('#busstop-latitude').val(),
    $lng = $('#busstop-longitude').val();

$(document).ready(function(){
    initMap();

    document.getElementById('map').style.cursor = 'crosshair';
});


/** Инициализация карты */
function initMap() {

    map = L.map('map', {
        maxZoom: 18,
        minZoom: 8,
        center: new L.LatLng(latCity, lonCity),
        zoom: 12,
        zoomControl: true,
        zoomsliderControl: true,
        layers: $Yandex,
        crs: crs,
        markerZoomAnimation: true
    });

    if ($lat.trim().length != 0 && $lng.trim().length != 0) {
        marker = new L.Marker([$lat, $lng], {icon: iconOstanovka}).addTo(map);
    }



    map.on('click', function (e) {
        if (marker) {
            map.removeLayer(marker);
        }
        marker = new L.Marker(e.latlng, {icon: iconOstanovka}).addTo(map);

        $('#busstop-latitude').val(e.latlng.lat);
        $('#busstop-longitude').val(e.latlng.lng);
        // console.log(e.latlng);
    });
}

function onClick(e) {alert(this.getLatLng());}