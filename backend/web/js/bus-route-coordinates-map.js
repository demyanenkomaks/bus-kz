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

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    L.drawLocal.draw.toolbar.buttons.polyline = 'Создайте маршрут';

    var drawControl = new L.Control.Draw({
        draw: {
            polyline: true,
            polygon: false,
            circle: false,
            marker: false,
            rectangle: false,
            circlemarker: false
        },
        edit: {
            featureGroup: drawnItems,
            remove: true
        }
    });

    var drawControlEditOnly = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        },
        draw: false
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

    var backRouteDrawnItems = new L.FeatureGroup();

    $.ajax({
        method: 'GET',
        url: '/admin4279/bus-route/coordinates-route-view-ajax',
        data: {
            id: get('id'),
            direction: get('direction')
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
                straightRoute.addTo(drawnItems);
                map.addLayer(drawnItems);
                map.fitBounds(straightRoute.getBounds());

                map.addControl(drawControlEditOnly);
            } else {
                map.addControl(drawControl);
            }

        } else {
            map.addControl(drawControl);
        }
    });

    map.on(L.Draw.Event.CREATED, function (e) {
        var layer = e.layer;

        $.ajax({
            method: 'post',
            url: '/admin4279/bus-route/coordinates-route-save-ajax',
            data: {
                id: get('id'),
                direction: get('direction'),
                coordinates: JSON.stringify(layer.getLatLngs()),
                op: 1
            }
        }).done(function ($data) {
            location.reload();
        })
    });

    map.on(L.Draw.Event.EDITED, function (e) {
        var layers = e.layers;

        layers.eachLayer(function (layer) {
            $.ajax({
                method: 'post',
                url: '/admin4279/bus-route/coordinates-route-save-ajax',
                data: {
                    id: get('id'),
                    direction: get('direction'),
                    coordinates: JSON.stringify(layer.getLatLngs()),
                    op: 2
                }
            }).done(function ($data) {
                location.reload();
            })
        });
    });

    map.on(L.Draw.Event.DELETED, function(e) {
        check =  Object.keys(drawnItems._layers).length;
        if (check === 0) {
            $.ajax({
                method: 'post',
                url: '/admin4279/bus-route/coordinates-route-save-ajax',
                data: {
                    id: get('id'),
                    direction: get('direction'),
                    op: 3
                }
            }).done(function ($data) {
                location.reload();
            })
        }
    });
}


function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}