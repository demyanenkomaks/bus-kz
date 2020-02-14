L.Marker.include({

    _slideToUntil:    undefined,
    _slideToDuration: undefined,
    _slideToLatLng:   undefined,
    _slideFromLatLng: undefined,
    _slideKeepAtCenter: undefined,
    _slideDraggingWasAllowed: undefined,

    slideTo: function slideTo(latlng, options) {
        if (!this._map) return;

        this._slideToDuration = options.duration;
        this._slideToUntil    = performance.now() + options.duration;
        this._slideFromLatLng = this.getLatLng();
        this._slideToLatLng   = latlng;
        this._slideKeepAtCenter = !!options.keepAtCenter;
        this._slideDraggingWasAllowed =
            this._slideDraggingWasAllowed !== undefined ?
                this._slideDraggingWasAllowed :
                this._map.dragging.enabled();

        if (this._slideKeepAtCenter) {
            this._map.dragging.disable();
            this._map.doubleClickZoom.disable();
            this._map.options.touchZoom = 'center';
            this._map.options.scrollWheelZoom = 'center';
        }

        this.fire('movestart');
        this._slideTo();

        return this;
    },

    slideCancel: function slideCancel() {
        L.Util.cancelAnimFrame(this._slideFrame);
    },

    _slideTo: function _slideTo() {
        if (!this._map) return;

        var remaining = this._slideToUntil - performance.now();

        if (remaining < 0) {
            this.setLatLng(this._slideToLatLng);
            this.fire('moveend');
            if (this._slideDraggingWasAllowed ) {
                this._map.dragging.enable();
                this._map.doubleClickZoom.enable();
                this._map.options.touchZoom = true;
                this._map.options.scrollWheelZoom = true;
            }
            this._slideDraggingWasAllowed = undefined;
            return this;
        }

        var startPoint = this._map.latLngToContainerPoint(this._slideFromLatLng);
        var endPoint   = this._map.latLngToContainerPoint(this._slideToLatLng);
        var percentDone = (this._slideToDuration - remaining) / this._slideToDuration;

        var currPoint = endPoint.multiplyBy(percentDone).add(
            startPoint.multiplyBy(1 - percentDone)
        );
        var currLatLng = this._map.containerPointToLatLng(currPoint)
        this.setLatLng(currLatLng);

        if (this._slideKeepAtCenter) {
            this._map.panTo(currLatLng, {animate: false})
        }

        this._slideFrame = L.Util.requestAnimFrame(this._slideTo, this);
    }

});

L.Marker.addInitHook(function(){
    this.on('move', this.slideCancel, this);
});

L.CircleMarker.include({

    slideTo: L.Marker.prototype.slideTo,

    slideCancel: L.Marker.prototype.slideCancel,
    _slideTo: L.Marker.prototype._slideTo
});

/** Cookie **/
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
    options = {
        path: '/',
    };
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}
/** Cookie end **/

/** Скрыть лодер */
function loaderHide() {
    $('#loader').hide();
}

/** Показать лодер */
function loaderShow() {
    $('#loader').show();
}

var map,
    checkRoute = null,
    timer,
    crs,
    latCity = 44.847532551949534,
    lonCity = 65.53310394287111,
    layerControl,
    stopsData = [],
    stopsVT = [],
    stopsRoute = [],
    groupStopsVt = new L.LayerGroup(),
    groupStopsRoute = new L.LayerGroup(),
    corridorColor = '#0c6fde',
    corridorColorInactive = '#999999',
    routeData = [],
    groupRouteVt = new L.LayerGroup(),
    routeStraight,
    routeBack,
    selectStops = new L.LayerGroup(),
    markersGroupVt = new L.LayerGroup(),
    arrayMarkers = [];

var $Yandex = L.tileLayer('https://vec0{s}.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&lang=ru',
    {id: 'ynd', subdomains: '1234', crs: L.CRS.EPSG3395}),
    $Google = L.tileLayer('https://mts{s}.google.com/vt/hl=x-local&x={x}&s=&y={y}&z={z}&hl=ru',
        {id: 'gog', subdomains: '0123', crs: L.CRS.EPSG3857}),
    $OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {crs: L.CRS.EPSG3857});

var baseLayers = {
    'Yandex' : $Yandex,
    'Google': $Google,
    'OSM': $OSM
};

$(document).ready(function(){
    baseMap = getCookie('basemap');

    if (baseMap) {
        var baseMapName = getCookie('basemap');
    } else {
        baseMap = $Yandex;
        crs = L.CRS.EPSG3395;
    }

    if (typeof(baseMapName) != 'undefined'){
        switch (baseMapName){
            case "Yandex":
                baseMap = $Yandex;
                crs = L.CRS.EPSG3395;
                break;
            case "Google":
                baseMap = $Google;
                crs = L.CRS.EPSG3857;
                break;
            case "OSM":
                baseMap = $OSM;
                crs = L.CRS.EPSG3857;
                break;
        }
    }

    initMap();
    initRoutesBus();
    initBus();


    /** Клик по маршруту */
    $('body').on('click', '.route-bus', function() {
        loaderShow();
        $('#panel-all-bus-stop').slideUp('slow');

        checkRoute = $(this).data('num');
        conclusionRoute(checkRoute);
    });

    /** Клик по станции */
    $('body').on('click', '.stop-bus', function() {
        var id = $(this).data('stop-id');

        getSelectStops(stopsRoute[id], $(this).text(), id);
    });

    /** Очистка карты */
    $('#transport-button').on('click', function() {
        checkRoute = null;
        cleaningMap();
        clearStopsOnPanel();
        $('#panel-all-bus-stop').slideUp('slow');
    });

    /** Смена напрвления */
    $('body').on('click', '#change-direction', function() {
        conclusionRoute($('#route-bus-number').html(), $(this).data('direction'));
    });
});


/** Инициализация карты */
function initMap() {

    map = L.map('map', {
        maxZoom: 18,
        minZoom: 8,
        center: new L.LatLng(latCity, lonCity),
        zoom: 13,
        zoomControl: false,
        zoomsliderControl: true,
        layers: baseMap,
        crs: crs,
        markerZoomAnimation: true
    }).on('baselayerchange', baseLayerChange);

    // Добавление zoom control внизу с права
    L.control.zoom({
        position:'bottomright',
        zoomInTitle: 'Приблизить',
        zoomOutTitle: 'Отдалить'
    }).addTo(map);

    // Кнопка переключения слоев карты
    layerControl = L.control.layers(baseLayers).addTo(map);

    getStops();

    map.on('dragend', function (e) {
        if (map.getZoom() > 14){
            getMarkersStops();
        }
    });

    // События при смене зума карты
    map.on('zoomstart', function (e) {
        endMoveZoom();
    });

    map.on('zoomend', function (e) {
        startMoveZoom();

        if (map.getZoom() > 14){
            showStopsUpZoom();
        }
        if (map.getZoom() < 15) {
            groupStopsVt.clearLayers();
        }
    });

    groupRouteVt.addTo(map);
}

/** Остановка анимации при начале смены зума */
function endMoveZoom() {
    for (var i = 0; i < arrayMarkers.length; i++){
        arrayMarkers[i].slideCancel();
    }
}

/** Центрирование карты при смене слоя */
function baseLayerChange(layer) {
    setCookie('basemap', layer.name);

    if (layer.name) {
        localStorage.setItem('currlayer', layer.name);
    }

    var crs = layer.layer.options.crs;

    if (crs == 'undefined'){
        crs = L.CRS.EPSG3857;
    }

    if (map.options.crs !== crs) {
        var center = map.getCenter();
        map.options.crs = crs;
        map.invalidateSize();
        map.setView(center);
    }
    $(".leaflet-control-layers").removeClass("leaflet-control-layers-expanded");
}

/** Запрос всех остановок */
var startStops = true;
function getStops() {

    if (!startStops){
        return;
    }
    startStops = false;
    stopsVT.length = 0;

    busStopsAjax(function (answer) {
        stopsData = answer;
        startStops = true;
        if (answer == 'Connect error'){
            return;
        }

        for (var i = 0; i < answer.length; i++) {
            var id = answer[i].id,
                name = answer[i].title,
                lat = answer[i].latitude,
                lng = answer[i].longitude;

            if (lat && lng) {
                stopsVT[i] = markerHalt(lat, lng, name, id);
            }
        }

        if (map.getZoom() > 14){
            showStopsUpZoom();
        }
    });

}

/** Запрос остановок */
function busStopsAjax(success) {
    $.ajax({
        method: 'GET',
        url: '/map/bus-stops-ajax',
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}

/** Маркер для остановки */
function markerHalt(lat, lng, name, id) {

    var customMarker = L.Marker.extend({
        options: {
            id: ''
        }
    });

    var haltIcon = L.divIcon({
        iconSize: [15, 15],
        iconAnchor: [15, 15],
        popupAnchor: [0, -7],
        className: "custom-icon-halt",
        html: '<div class="icon-halt"></div>'
    });

    var marker = new customMarker([lat, lng], {
        title: name,
        icon: haltIcon,
        riseOnHover: true,
        zIndexOffset: 1,
        id: id
    });
    return marker;
}

/** Показывает все остановки на карте при увеличении зума */
function showStopsUpZoom() {
    if(map.hasLayer(groupStopsVt)){
        getMarkersStops();
        return;
    }
    map.addLayer(groupStopsVt);
    for (var i = 0; i < stopsVT.length; i++) {
        getViewMarkersStops(stopsVT[i]);
    }
}

/** Отображение маркеров остановок только в видимой области экрана */
function getViewMarkersStops(marker) {
    marker
        .on('click', function (marker) {
            var divStop = (getInfoStops(marker.sourceTarget));

            var popupMarker = new L.popup({
                offset: new L.Point(-8, -5),
                closeButton: false
            })
                .setLatLng(marker.sourceTarget.getLatLng())
                .setContent(divStop);

            map.openPopup(popupMarker);
            map.panTo(marker.sourceTarget.getLatLng());
        });

    if ((marker.getLatLng().lat > map.getBounds()._southWest.lat) && (marker.getLatLng().lat < map.getBounds()._northEast.lat) &&
        (marker.getLatLng().lng > map.getBounds()._southWest.lng) && (marker.getLatLng().lng < map.getBounds()._northEast.lng)) {
        marker.addTo(groupStopsVt);
    }
}

/** Отображение маркеров остановок в видимой области экрана и удаление маркеров ушедших за экран при перетаскивании карты */
function getMarkersStops() {
    for (var i = 0; i < stopsVT.length; i++){
        if ((stopsVT[i].getLatLng().lat > map.getBounds()._southWest.lat) && (stopsVT[i].getLatLng().lng < map.getBounds()._northEast.lng)) {
            stopsVT[i].addTo(groupStopsVt);
        }
        if ((stopsVT[i].getLatLng().lat < map.getBounds()._southWest.lat) || (stopsVT[i].getLatLng().lat > map.getBounds()._northEast.lat) ||
            (stopsVT[i].getLatLng().lng < map.getBounds()._southWest.lng) || (stopsVT[i].getLatLng().lng > map.getBounds()._northEast.lng)) {
            groupStopsVt.removeLayer(stopsVT[i]);
        }
    }
}

/** Вывод списка всех автобусных маршрутов */
function initRoutesBus() {
    routesBusAjax(function (answer) {
        routeData = answer;

        if (answer == 'Connect error'){
            return;
        }

        var routesPanel = '<div>Маршруты:</div>';
        $.each(answer, function( index, value ) {
            routesPanel += '<div class="btn btn-default route-bus" data-num="' + value.number + '">' + value.number + '</div>';
        });

        loaderHide();
        $('#panel-all-bus-route').html(routesPanel);

    });
}

/** Запрос номоров маршрутов */
function routesBusAjax(success) {
    $.ajax({
        method: 'GET',
        url: '/map/routes-bus-ajax',
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}

/** Отовражение выбранного маршрута */
function conclusionRoute(num, direction) {
    var reverseDirection;

    if (typeof direction == 'undefined') {
        direction = 1;
    }

    if (direction == 1) {
        reverseDirection = 2;
    } else {
        reverseDirection = 1
    }

    $.each(routeData, function(index, route) {
        if (route.number == num) {
            cleaningMap();

            if (typeof route.coordinate != 'undefined') {
                drawingRoute(route.coordinate, direction, reverseDirection);
            }

            if (typeof route.stops != 'undefined') {
                addStopsOnMap(route.stops, direction);
            }

            addStopsOnPanel(route, direction, reverseDirection);
        }
    });

}

/** Прорисовка маршрута на карту */
function drawingRoute(coordinate, direction, reverseDirection) {
    // Прорисовка обратного направления если есть координаты
    if (typeof coordinate[reverseDirection] != 'undefined') {
        routeStraight = L.polyline(coordinate[reverseDirection], {
            color: corridorColorInactive,
            weight: 5,
            opacity: 1
        });
        routeStraight.addTo(groupRouteVt);
    }

    // Прорисовка прямого направления если есть координаты
    if (typeof coordinate[direction] != 'undefined') {
        routeBack = L.polyline(coordinate[direction], {color: corridorColor, weight: 5, opacity: 1});
        routeBack.addTo(groupRouteVt);
        map.fitBounds(routeBack.getBounds());
    }
}

/** Убрать объекты с карты с карты */
function cleaningMap() {
    groupRouteVt.clearLayers();
    groupStopsRoute.clearLayers();
    selectStops.clearLayers();
}

/** Отображает остановки на карте по выбранному маршруту */
function addStopsOnMap(stops, direction) {
    stopsRoute.length = 0;

    for(var i in stops[direction]) {
        var name = stops[direction][i].title,
            id = stops[direction][i].id,
            lat = stops[direction][i].lat,
            lng = stops[direction][i].lng;

        if (lat && lng) {
            var marker = markerHaltRoute(lat, lng, name, id);
            marker.addTo(groupStopsRoute);
            marker
                .on('click', function (marker) {

                    var divStop = (getInfoStops(marker.sourceTarget));

                    var popupMarker = new L.popup({
                        offset: new L.Point(-8, -5),
                        closeButton: false
                    })
                        .setLatLng(marker.sourceTarget.getLatLng())
                        .setContent(divStop);

                    map.openPopup(popupMarker);
                    map.panTo(marker.sourceTarget.getLatLng());
                });

            stopsRoute[id] = marker;
        }
    }

    if (!map.hasLayer(groupStopsRoute)) {
        map.addLayer(groupStopsRoute);
    }
}

/** Отображает остановки на панели с лева по выбранному маршруту */
function addStopsOnPanel(route, direction, reverseDirection) {

    // Проверка есть ли обратный маршрут
    if (typeof route.stops !== 'undefined' && typeof route.stops[reverseDirection] !== 'undefined' && route.stops[reverseDirection].length > 0) {
        $('#route-bus-direction').html('<span class="btn btn-default" title="Сменить направление" data-direction="' + reverseDirection + '" id="change-direction"><i class="glyphicon glyphicon-resize-vertical" ></i></span>');
    } else {
        $('#route-bus-direction').html('');
    }

    // Номер маршрута
    $('#route-bus-number').html(route.number);

    // Маршрут от до
    if (typeof route.stops !== 'undefined' && typeof route.stops[direction] !== 'undefined' && route.stops[direction].length > 0) {
        $('#route-bus-ot-do').html(route.stops[direction][0].title + ' - ' + route.stops[direction][route.stops[direction].length-1].title);
    }

    // Время работы маршрута
    if (route.time_ot != "00:00:00" && route.time_do != "00:00:00") {
        $('#route-bus-time').html(route.time_ot +  ' - ' + route.time_do);
    }

    // Стоимость маршрута
    if (route.cost) {
        $('#route-bus-cost').html(route.cost);
    }

    // Остановки маршрута
    var routeStops = '';
    if (typeof route.stops !== 'undefined' && typeof route.stops[direction] !== 'undefined' && route.stops[direction].length > 0) {
        $.each(route.stops[direction], function (index, value) {
            routeStops += '<div class="btn btn-default stop-bus" data-stop-id="' + value.id + '">' + value.title + '</div>';
        });
    }
    $('#route-bus-stops').html(routeStops);
}

/** Отображает остановки на панели с лева по выбранному маршруту */
function clearStopsOnPanel() {
    $('#route-bus-direction').html('');
    $('#route-bus-number').html('');
    $('#route-bus-ot-do').html('');
    $('#route-bus-time').html('');
    $('#route-bus-cost').html('');
    $('#route-bus-stops').html('');
}

/** Маркер для остановки по маршруту */
function markerHaltRoute(lat, lng, name, id) {

    var customMarker = L.Marker.extend({
        options: {
            id: ''
        }
    });

    var haltIcon = L.divIcon({
        iconSize: [15, 15],
        iconAnchor: [15, 15],
        popupAnchor: [0, -7],
        className: "custom-icon-halt",
        html: '<div class="icon-halt-route"></div>'
    });

    var marker = new customMarker([lat, lng], {
        title: name,
        icon: haltIcon,
        riseOnHover: true,
        zIndexOffset: 1,
        id: id
    });
    marker.setZIndexOffset(10);
    return marker;
}

/** Ифнормация об остановке*/
function getInfoStops(stopObject){
    if (!stopObject){
        return;
    }

    var dataStop = stopsData.filter(function (element) {
        return element.id === stopObject.options.id;
    });

    var routesPanel = '<div>Маршруты:</div>';
    $.each(dataStop[0].route, function( index, value ) {
        routesPanel +=  '<div class="btn btn-default route-bus" data-num="' + value.number + '">' + value.number + '</div>';
    });

    var headerPopup = '' +
        '<div class="data-popup">' +
        '<div class="header-popup">' +
        '<div class="custom-popup-close-button" onclick="closePopup()">x</div>' +
        '<div class="icon"><img src="/images/halt.svg" alt=""></div>' +
        '<div class="stop ">' +
        '<div class="sign">Остановка:</div>' +
        '<div class="name">' + stopObject.options.title + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="content-popup">' +
        '<div class="route">' + routesPanel + '</div>' +
        '</div>' +
        '</div>';

    return headerPopup;
}

/** Выделяет выбранную остановку на карте */
function getSelectStops(halt, name, id) {
    if(!halt){
        return;
    }
    if (map.hasLayer(selectStops)) {
        selectStops.clearLayers();
    }

    var stop = halt.getLatLng();

    var stopId = id,
        lat = stop.lat,
        lon = stop.lng;

    if (lat && lon) {
        var markerSelect = markerSelectStop(lat, lon, name, stopId);
        markerSelect.addTo(selectStops);
        markerSelect
            .on('click', function (marker) {

                var divStop = (getInfoStops(marker.sourceTarget));

                var popupMarker = new L.popup({
                    offset: new L.Point(-3, -5),
                    closeButton: false
                })
                    .setLatLng(marker.sourceTarget.getLatLng())
                    .setContent(divStop);

                map.openPopup(popupMarker);
                map.panTo(marker.sourceTarget.getLatLng());
            });
    }

    if ((lat < map.getBounds()._southWest.lat) || (lat > map.getBounds()._northEast.lat) ||
        (lon < map.getBounds()._southWest.lng) || (lon > map.getBounds()._northEast.lng)) {
        map.panTo(markerSelect.getLatLng());
    }

    if (!map.hasLayer(selectStops)) {
        map.addLayer(selectStops);
    }

    setTimeout(function () {
        markerSelect.closeTooltip();
    }, 5000);
}

/** Маркер для выбранной остановки */
function markerSelectStop(lat, lon, name, id) {

    var customMarker = L.Marker.extend({
        options: {
            id: ''
        }
    });

    var iconBigHalt = L.divIcon({
        iconSize: [25, 25],
        iconAnchor: [15, 15],
        popupAnchor: [0, -7],
        className: "custom-icon-halt-route",
        html: '<div class="icon-halt-route"></div>'
    });

    var marker = new customMarker([lat, lon], {
        title: name,
        icon: iconBigHalt,
        riseOnHover: true,
        zIndexOffset: 100,
        id: id
    }).bindTooltip(name, {
        permanent: true,
        opacity: 0.9
    });
    return marker;
}


function closePopup() {
    map.closePopup();
}


/** Запрос автобусов */
function busAjax(success) {
    $.ajax({
        method: 'GET',
        url: '/map/bus-ajax',
        data: {route: checkRoute},
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}

/** Вывод автобусов */
function initBus() {
    busAjax(function (objects) {

        if (objects == 'Connect error'){
            interval = setInterval(function () {
                moveMarker();
            }, 6000);

            return;
        }

        if(!map.hasLayer(markersGroupVt)){
            map.addLayer(markersGroupVt);
        }

        if (objects.length > 0){
            for (var i = 0; i < objects.length; i++) {
                var options = {};
                options.id = objects[i].id;
                options.bus = objects[i].bus;
                options.lat = objects[i].lat;
                options.lon = objects[i].lng;
                options.name = objects[i].route;
                options.route = objects[i].route;
                options.course = Math.round(objects[i].course);

                arrayMarkers[i] = markerTransport(options);
                arrayMarkers[i].options.latEnd = arrayMarkers[i].options.lat;
                arrayMarkers[i].options.lonEnd = arrayMarkers[i].options.lon;
            }
        }

        interval = setInterval(function () {
            moveMarker();
        }, 6000);
    });
}

/** Маркер для транспорта */
function markerTransport(options) {

    var markerIcon = L.divIcon({
        iconSize: [32, 32],
        iconAnchor: [15, 15],
        popupAnchor: [0, -7],
        className: "custom-icon-transport",
        html: '<div class="obj-dir" style="' + setDirMarker(Math.round(options.course)) + '"></div>' +
            '<div class="obj-icon"><span>' + options.name + '</span></div>'
    });

    var customMarker = L.Marker.extend({
        options: {
            id: '',
            course: '',
            icon: '',
            name: '',
            bus: '',
            lat: '',
            lon: '',
            latNext: '',
            lonNext: '',
            latEnd: '',
            lonEnd: '',
            counter: '',
            duration: '',
            speed: '',
        }
    });

    var marker = new customMarker([options.lat, options.lon], {
        title: '',
        icon: markerIcon,
        riseOnHover: true,
        zIndexOffset: 10,
        id: options.id,
        course: options.course,
        name: options.name,
        bus: options.bus,
        lat: options.lat,
        lon: options.lon,
        latNext: null,
        lonNext: null,
        counter: null,
        duration: 22000
    });

    getViewMarkersTransport(marker);

    return marker;
}

/** Отображение маркеров транспорта */
function getViewMarkersTransport(marker) {
    marker
        .on('click', function (marker) {

            var divRoute = $(getInfoBus(marker));

            var popupMarker = new L.popup({
                offset: new L.Point(0, -3),
                closeOnClick: false,
                closeButton: false,
                draggable:true
            })
                .setLatLng(marker.sourceTarget.getLatLng())
                .setContent(divRoute[0]);

            map.openPopup(popupMarker);

            map.panTo(marker.sourceTarget.getLatLng());

            makeDraggablePopup(popupMarker);

            clearInterval(timer);
            timer = setTimeout(function(){
                map.closePopup();
            }, 20000);
        });

    marker.addTo(markersGroupVt);
}

/** Ифнормация об автобусе*/
function getInfoBus(bus){
    if (!bus){
        return;
    }

    var headerPopup = '' +
        '<div class="data-popup">' +
        '<div class="header-popup">' +
        '<div class="custom-popup-close-button" onclick="closePopup()">x</div>' +
        '<div class="icon"><img src="/images/b_marker.svg" alt=""></div>' +
        '<div class="bus">' +
        '<div class="name">' + bus.target.options.bus + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="content-popup"></div>';

    return headerPopup;
}

/** Устанавливает указатель на маркере указывающий направление движения транспорта */
function setDirMarker(dir) {
    return '-webkit-transform: rotate(' + dir + 'deg);' +
        '-moz-transform: rotate(' + dir + 'deg);' +
        '-ms-transform: rotate(' + dir + 'deg);' +
        '-o-transform: rotate(' + dir + 'deg);' +
        'transform: rotate(' + dir + 'deg);';
}

function makeDraggablePopup(popup) {
    var draggable = new L.Draggable(popup._container, popup._wrapper);
    draggable.enable();

    draggable.on('dragend', function() {
        var pos = map.layerPointToLatLng(this._newPos);
        popup.setLatLng(pos);
    });
}

/** Перемещение маркеров транспорта по карте */
function moveMarker() {
    busAjax(function (objects) {
        if (objects == 'Connect error') {
            return;
        }
        var result;

        for (var j = 0; j < objects.length; j++){

            result = $.grep(arrayMarkers, function(e){ return e.options.id === objects[j].id; });

            if (typeof(result[0]) == 'undefined'){
                var options = {};
                options.id = objects[j].id;
                options.bus = objects[j].bus;
                options.lat = objects[j].lat;
                options.lon = objects[j].lng;
                options.name = objects[j].route;
                options.route = objects[j].route;
                options.course = Math.round(objects[j].course);

                arrayMarkers.push(markerTransport(options));
            }

            if (typeof(result[0]) != 'undefined'){
                result[0].options.course = Math.round(objects[j].course);
                result[0].options.lat = Number(objects[j].lat);
                result[0].options.lon = Number(objects[j].lng);

                clearPrevWays(result[0]);
                result[0].addTo(markersGroupVt);

                if (markersGroupVt.hasLayer(result[0])){
                    getMoveMarker(result[0]);
                }
            }
        }

        for (var i = 0; i < arrayMarkers.length; i++){
            result = $.grep(objects, function(e){ return e.id === arrayMarkers[i].options.id; });

            if (typeof(result[0]) == 'undefined'){
                markersGroupVt.removeLayer(arrayMarkers[i]);
                arrayMarkers.splice(i, 1);
                i--;
            }
        }

        if (checkRoute) {
            $('#panel-all-bus-stop').slideDown('slow');
        } else {
            $('#panel-all-bus-stop').slideUp('slow');
        }
        loaderHide();
    });
}

/** Очистка точек для предотвращения движения назад */
function clearPrevWays(marker) {
    marker.options.latNext = null;
    marker.options.lonNext = null;
}

/** Движение маркеров от точки к точке */
function getMoveMarker(marker) {
    if ((marker.options.latEnd == marker.options.lat) && (marker.options.lonEnd == marker.options.lon)){
        return;
    }

    var latlngStart = L.latLng(marker.getLatLng()),
        latlngEnd = L.latLng(Number(marker.options.lat), Number(marker.options.lon));

    updateIconTransport(marker);

    if (map.distance(latlngStart, latlngEnd) > 400){
        marker.setLatLng(latlngEnd);
        return;
    }

    marker.options.latEnd = marker.options.lat;
    marker.options.lonEnd = marker.options.lon;

    marker.slideTo([marker.options.lat, marker.options.lon], {
        duration: marker.options.duration
    });
}

/** Обновление иконки транспорта */
function updateIconTransport(marker) {

    var icon = L.divIcon({
        iconSize: [32, 32],
        iconAnchor:[15, 15],
        popupAnchor:[0, -7],
        className:"custom-icon-transport",
        html: '<div class="obj-dir" style="' + setDirMarker(marker.options.course) + '"></div>' +
            '<div class="obj-icon"><span>' + marker.options.name + '</span></div>'
    });
    marker.setIcon(icon);
}

/** Запуск анимации маркеров при окончании смены зума */
function startMoveZoom() {
    var latlngStart, latlngNext, distanceToNext;

    for (var j = 0; j < arrayMarkers.length; j++){
        latlngStart = L.latLng(arrayMarkers[j].getLatLng());
        latlngNext = L.latLng(Number(arrayMarkers[j].options.lat), Number(arrayMarkers[j].options.lon));
        distanceToNext = map.distance(latlngStart, latlngNext);

        if (distanceToNext == 0){
            continue;
        }

        arrayMarkers[j].slideTo([arrayMarkers[j].options.lat, arrayMarkers[j].options.lon], {
            duration: distanceToNext * 1000 / 15
        });
    }
}