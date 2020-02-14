/** icon **/
var iconOstanovkaRoute = L.icon({
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


    $.ajax({
        method: 'GET',
        url: '/admin4279/bus-stop/bus-stop-view-ajax',
        data: getRequests()
    }).done(function ($data) {
        if ($data != false) {
            $data.forEach(function(item, i, arr) {
                L.marker([item.lat, item.lng], {icon: iconOstanovkaRoute}).bindPopup(item.title).addTo(map);
            });
        }
    });

}

function getRequests() {
    var s1 = location.search.substring(1, location.search.length).split('&'),
        r = {}, s2, i;
    for (i = 0; i < s1.length; i += 1) {
        s2 = s1[i].split('=');
        r[decodeURIComponent(s2[0])] = decodeURIComponent(s2[1]);
    }
    return r;
};