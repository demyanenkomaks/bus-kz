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

    var straightRouteDrawnItems = new L.FeatureGroup();
    var backRouteDrawnItems = new L.FeatureGroup();

    $.ajax({
        method: 'GET',
        url: '/admin4279/bus-route/coordinates-route-view-ajax',
        data: {
            id: get('id')
        }
    }).done(function ($data) {
        if ($data != 'Connect error' && $data != null) {

            if(typeof $data[1] != 'undefined') {
                var backRoute = new L.Polyline($data[1], {color: '#9c9c9c'});
                backRoute.addTo(backRouteDrawnItems);
                map.addLayer(backRouteDrawnItems);
            }

            if(typeof $data[0] != 'undefined') {
                var straightRoute = new L.Polyline($data[0], {color: '#3c8dbc'});
                straightRoute.addTo(straightRouteDrawnItems);
                map.addLayer(straightRouteDrawnItems);
                map.fitBounds(straightRoute.getBounds());
            }
        }
    });

    $.ajax({
        method: 'GET',
        url: '/admin4279/bus-route/bus-stop-view-ajax',
        data: {
            id: get('id')
        }
    }).done(function ($data) {
        if ($data != 'Connect error' && $data != null) {
            $data.forEach(function(item, i, arr) {
                L.marker([item.lat, item.lng], {icon: iconOstanovkaRoute}).bindPopup(item.title).addTo(map);
            });
        }
    })
}

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}