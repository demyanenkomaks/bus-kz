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

/** Получить GET параметр */
function $_GET(key) {
    var s = window.location.search;
    s = s.match(new RegExp(key + '=([^&=]+)'));
    return s ? s[1] : false;
}

var map,
    interval,
    latCity = 44.847532551949534,
    lonCity = 65.53310394287111,
    markersGroupVt = new L.LayerGroup(),
    arrayMarkers = [],
    timer,
    baseMap = L.tileLayer('https://vec0{s}.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&lang=ru',
        {id: 'ynd', subdomains: '1234', crs: L.CRS.EPSG3395}),
    crs = L.CRS.EPSG3395;

$(document).ready(function(){
    initMap();
    infoStop();
    initBus();
});

/** Вывод информации по станции */
function infoStop() {
    infoStopAjax(function (objects) {

        if (objects == 'Connect error'){
            interval = setInterval(function () {
                infoStopInterval();
            }, 15000);

            return;
        }

        var info = '';
        $.each(objects, function( index, value ) {
            info += '<p class="s-24">' +
                '<span class="font-green">' + value.number + ' маршрут</span> ' +
                '<span class="font-red">прибытие через ' + (value.h ? value.h  + ' : ' : '') + value.m + ' мин.</span>' +
                '</p>';
        });

        $('#panel-info-bus').html(info).show();

        interval = setInterval(function () {
            infoStopInterval();
        }, 15000);
    });
}

/** Вывод информации по станции */
function infoStopInterval() {
    infoStopAjax(function (objects) {

        if (objects == 'Connect error'){
            return;
        }

        var info = '';
        $.each(objects, function( index, value ) {
            info += '<p>' +
                '<span class="font-green">' + value.number + ' маршрут</span> ' +
                '<span class="font-red">прибытие через ' + (value.h ? value.h  + ' : ' : '') + value.m + ' мин.</span>' +
                '</p>';
        });

        $('#panel-info-bus').html(info).show();
    });
}

/** Запрос информации по станции */
function infoStopAjax(success) {
    $.ajax({
        method: 'GET',
        url: '/map/info-stop-ajax',
        data: {id: $_GET('id')},
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}


/** Инициализация карты */
function initMap() {
    var latitude = $('#latitude').val();
    var longitude = $('#longitude').val();

    map = L.map('map', {
        maxZoom: 18,
        minZoom: 8,
        center: new L.LatLng(latitude, longitude),
        zoom: 18,
        zoomControl: false,
        zoomsliderControl: true,
        layers: baseMap,
        crs: crs,
        markerZoomAnimation: true
    });

    /** Вывод остановки */
    var customMarker = L.Marker.extend({
        options: {
            id: ''
        }
    });

    var haltIcon = L.divIcon({
        iconSize: [500, 50],
        iconAnchor: [15, 15],
        popupAnchor: [0, -7],
        className: "custom-icon-halt",
        html: '<div class="icon-halt-i"></div>'
    });

    var marker = new customMarker([latitude, longitude], {
        title: name,
        icon: haltIcon,
        riseOnHover: true,
        zIndexOffset: 1
    });

    marker.addTo(map);
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


/** Отображение маркеров транспорта */
function getViewMarkersTransport(marker) {
    marker
        .on('click', function (marker) {

            var divRoute = $(getInfoBus(marker));

            var popupMarker = new L.popup({
                offset: new L.Point(0, -3),
                closeOnClick: false,
                closeButton: false,
                draggable: true
            })
                .setLatLng(marker.sourceTarget.getLatLng())
                .setContent(divRoute[0]);

            map.openPopup(popupMarker);

            makeDraggablePopup(popupMarker);

            clearInterval(timer);
            timer = setTimeout(function(){
                map.closePopup();
            }, 20000);
        });

    marker.addTo(markersGroupVt);
}

/** Запрос автобусов */
function busAjax(success) {
    $.ajax({
        method: 'GET',
        url: '/map/bus-ajax',
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
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

/** Маркер для транспорта */
function markerTransport(options) {

    var markerIcon = L.divIcon({
        iconSize: [50, 50],
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

function closePopup() {
    map.closePopup();
}

/** Обновление иконки транспорта */
function updateIconTransport(marker) {

    var icon = L.divIcon({
        iconSize: [50, 50],
        iconAnchor:[15, 15],
        popupAnchor:[0, -7],
        className:"custom-icon-transport",
        html: '<div class="obj-dir" style="' + setDirMarker(marker.options.course) + '"></div>' +
            '<div class="obj-icon"><span>' + marker.options.name + '</span></div>'
    });
    marker.setIcon(icon);
}