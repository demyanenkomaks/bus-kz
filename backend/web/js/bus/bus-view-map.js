/** icon **/
var icon = L.icon({
    iconUrl: '/images/halt-route.svg',
    iconSize: [15, 15],
    iconAnchor: [7, 7],
    popupAnchor: [0, 0],
});

/** icon end **/

var map,
    crs = L.CRS.EPSG3395,
    latCity = 44.847532551949534,
    lonCity = 65.53310394287111,
    $Yandex = L.tileLayer('https://vec0{s}.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&lang=ru',
        {id: 'ynd', subdomains: '1234', crs: L.CRS.EPSG3395});

$(document).ready(function(){
    initMap();
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

    $.ajax({
        method: 'GET',
        url: '/admin4279/bus/bus-view-ajax',
        data: {
            id: get('id')
        }
    }).done(function ($data) {
        console.log($data)
        if ($data != 'Connect error' && $data.lat != null && $data.lng != null) {
            L.marker([$data.lat, $data.lng], {icon: icon}).addTo(map);
        }
    })
}

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}