var layerSocialSigns = L.featureGroup(),            //Слой социально-значимых объектов
    layerRoadSigns = L.featureGroup();              //Слой дорожных знаков

/** Определение местоположения */
function findLocation(){
    map.removeLayer(markerLoc);
    navigator.geolocation.getCurrentPosition(showPosition);
    function showPosition(position) {
        markerLoc.setLatLng(L.latLng(position.coords.latitude, position.coords.longitude))
            .bindPopup(translate('you are here'), {minWidth:140, maxWidth:180, offset: new L.Point(0, -35)})
            .addTo(map)
            .openPopup()
            .on('click',function(e){markerLoc.closePopup(); map.removeLayer(markerLoc);});
        map.panTo(markerLoc.getLatLng());
    }
}

/** Показать пробки */
function trafficJams() {
    if (!map.hasLayer(ytraffic)) {
        map.removeLayer(layerControl.getActiveBaseLayer().layer);
        map.addLayer(yndx);
        map.addLayer(ytraffic);
        $('.btn-traffic').addClass('btn-traffic-active');
    } else {
        map.removeLayer(ytraffic);
        $('.btn-traffic').removeClass('btn-traffic-active');
    }
}

/** Показать/скрыть социально-значимые объекты */
function toggleSocialSigns() {
    if (map.hasLayer(layerSocialSigns)) {
        map.removeLayer(layerSocialSigns);
        $('.soc-sign-button').removeClass('soc-sign-button-active');
        $.removeCookie('soc-signs');
    } else {
        map.addLayer(layerSocialSigns);
        getSocialSigns();
        $('.soc-sign-button').addClass('soc-sign-button-active');
        $.cookie('soc-signs', 1, { expires: 30 });
    }
}

function getSocialSigns() {
    var options = {
        dicts: 'socialsigns',
        srv: srv,
        lang: lang
    };

    readdictsRequest(options, function (result) {
        if (result == 'Connect error'){
            return;
        }

        for(var i = 0; i < result[0].socialsigns.length; i++) {
            var socSign = result[0].socialsigns[i];

            var socMarker = new L.marker([socSign.location[0], socSign.location[1]], {
                icon: new L.Icon({
                    iconSize:[22, 22],
                    iconUrl: '/img/social_signs/' + socSign.type + '.png',
                    iconAnchor: [11, 11],
                    popupAnchor: [0, 0]
                }),
                riseOnHover: true,
                zIndexOffset: 99999
            });

            socMarker.socsign_id = socSign.id;

            socMarker.bindTooltip('<b>' + socSign.name + '</b><br>' + socSign.description, {
                permanent: false,
                opacity: 0.9
            });
            socMarker.addTo(layerSocialSigns);
        }
    });
}

/** Показать/скрыть дорожные знаки */
function toggleRoadSigns() {

    if (map.hasLayer(layerRoadSigns)) {
        map.removeLayer(layerRoadSigns);
        $('.road-sign-button').removeClass('road-sign-button-active');
        $.removeCookie('road-signs');
    } else {
        map.addLayer(layerRoadSigns);
        getRoadSigns();
        $('.road-sign-button').addClass('road-sign-button-active');
        $.cookie('road-signs', 1, { expires: 30 });
    }
}

function getRoadSigns() {
    var options = {
        dicts: 'roadsigns',
        srv: srv,
        lang: lang
    };

    readdictsRequest(options, function (result) {
        if (result == 'Connect error'){
            return;
        }

        for(var i = 0; i < result[0].roadsigns.length; i++) {
            var roadSign = result[0].roadsigns[i];

            var roadsignMarker = new L.marker([roadSign.location[0], roadSign.location[1]], {
                icon: new L.Icon({
                    iconSize:[22, 22],
                    iconUrl: '/img/road_signs/' + roadSign.type + '.png',
                    iconAnchor: [11, 11],
                    popupAnchor: [0, 0]
                }),
                riseOnHover: true
            });

            roadsignMarker.socsign_id = roadSign.id;
            roadsignMarker.addTo(layerRoadSigns);
        }
        layerRoadSigns.addTo(map);
    });
}

function isSmallScreen() {
    return (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) || $(document).width() <= 600;
}




/** Получение адреса по координатам */
function getAddress(lat, lon, success) {
    $.ajax({
        url: '/getaddress',
        data: {
            loc: lat + "," + lon
        },
        dataType: 'json',
        success: function (answer) {
            success(answer);
        }
    });
}

/** Инициализация города */
function initCityRequest(cityId, success) {
    $.ajax({
        url: '/initcity',
        data: {
            'id': cityId,
            'lang': lang
        },
        dataType: 'json',
        success: function (answer) {
            success(answer);
        }
    });
}

/** Запрос видов транспорта для блока меню */
function infotransporttypesRequest(success) {
    $.ajax({
        url: '/infotransporttypes',
        data: {
            'srv': srv
        },
        dataType: 'json',
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}

/** Запрос списка маршрутов для построения блока меню */
function inforoutesRequest(success) {
    $.ajax({
        url: '/inforoutes',
        data: {
            'vt': 'b;rt;tb;tr;riv',
            'srv': srv
        },
        dataType: 'json',
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}

/** Запрос объектов */
function inforoutestatesRequest(options, headers, success) {
    $.ajax({
        url: '/inforoutestates',
        headers: headers,
        data: options,
        dataType: 'json',
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}

/** Запрос для отображения маршрута транспортного средства на карте */
function inforoutedetailsRequest(options, success) {
    $.ajax({
        url: '/inforoutedetails',
        headers: {"lang": lang},
        data: options,
        dataType: 'json',
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}

/** Запрос остановок */
function inforoutezonesRequest(success) {
    $.ajax({
        url: '/inforoutezones',
        headers: {"lang": lang},
        data: {
            'srv': srv,
            'lang': lang
        },
        dataType: 'json',
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}

/** Запрос о движении транспортного средства и ближайших остановках */
function infonextstopsRequest(options, success) {

    $.ajax({
        url: '/infonextstops',
        headers: {"lang": lang},
        data: options,
        dataType: 'json',
        success: function(answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}

/** Запрос для отображения подъезжающего транспорта к остановке */
function infonextcomingsRequest(options, success) {
    $.ajax({
        url: '/infonextcomings',
        headers: {"lang": lang},
        data: options,
        dataType: 'json',
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}

function infofindwaysRequest(options, success) {
    $.ajax({
        url: '/infofindways',
        headers: {"lang": lang},
        data: options,
        dataType: 'json',
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}

function readdictsRequest(options, success) {
    $.ajax({
        url: '/infodictionaries',
        headers: {"lang": lang},
        data: options,
        dataType: 'json',
        success: function (answer) {
            success(answer);
        },
        error: function(){
            success('Connect error');
        }
    });
}

/** Блок "как проехать" */
var markerLocIcon = new L.Icon({
    iconUrl: '/img/map/findway/marker.png', iconAnchor:[15,46], iconSize:[30,46]});                     // Иконка местоположения
var iconFrom = L.divIcon({                                                                              // Иконка "куда"
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -7],
    className: "custom-icon-from",
    html: '<div class="icon-from"></div>'
});
var iconTo = L.divIcon({                                                                                // Иконка "куда"
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -7],
    className: "custom-icon-to",
    html: '<div class="icon-to"></div>'
});
var markerLoc = L.marker([0,0], {draggable: true, icon: markerLocIcon}),                                // Маркер для местоположения
    fromMarkerLoc = L.marker([0,0], {draggable: true, icon: iconFrom, zIndexOffset: 1000}),             // Маркер "откуда"
    toMarkerLoc = L.marker([0,0], {draggable: true, icon: iconTo, zIndexOffset: 1000});                 // Маркер "куда"
var findMarkerGroup = new L.LayerGroup(),
    beginEndMarkerTotal = new L.LayerGroup(),
    beginEndMarkerPart = new L.LayerGroup();



/** Добавление маркеров для поиска проезда на карту */
function addInfoPlace(e){

    if(findMarkerGroup.hasLayer(fromMarkerLoc) && findMarkerGroup.hasLayer(toMarkerLoc)){
        return;
    }

    if(!map.hasLayer(findMarkerGroup))
        findMarkerGroup.addTo(map);

    var lat = e.latlng.lat,
        lng = e.latlng.lng;
    $.ajax({
        //url: "https://geocode-maps.yandex.ru/1.x/",
        url: "https://nominatim.openstreetmap.org/search/" + lat + "," + lng,
        data: { limit: 1, format: 'json', addressdetails: 1 },
        dataType: "json",
        type: "GET",
        success: function(answer){

            var addr;
            if (answer && answer.length > 0 && answer[0].display_name) {
                addr = answer[0].display_name;
            } else {
                addr = lng + ':' + lat;
            }

            /*
            if (answer.response.GeoObjectCollection.featureMember.length > 0)
                addr = answer.response.GeoObjectCollection.featureMember[0].GeoObject.name;
            else
                addr = lng + ':' + lat;
            */

            if (!findMarkerGroup.hasLayer(fromMarkerLoc)) {
                arrayMarkers.length = 0;
                clearMap();
                fromMarkerLoc.setLatLng(L.latLng(lat, lng));
                fromMarkerLoc.addTo(findMarkerGroup);
                $('#addressFrom').val(addr);
            }
            else if (!findMarkerGroup.hasLayer(toMarkerLoc)) {
                toMarkerLoc.setLatLng(L.latLng(lat, lng));
                toMarkerLoc.addTo(findMarkerGroup);
                $('#addressTo').val(addr);
            }

            FindWayRoutes();
        }
    });
}

/** Поиск проезда */
var startFindWayRoutes = true;
function FindWayRoutes() {
    if (!startFindWayRoutes){
        return;
    }

    if ($("#finded-routes-for-places").hasClass("ui-accordion")){
        $("#finded-routes-for-places").accordion('destroy');
        $("#finded-routes-for-places").empty();
    }

    if(findMarkerGroup.hasLayer(fromMarkerLoc) && findMarkerGroup.hasLayer(toMarkerLoc)) {
        $(".finded-routes-for-places").getNiceScroll().remove();

        startFindWayRoutes = false;

        var toLatLng = toMarkerLoc.getLatLng(),
            toLat = toLatLng.lat,
            toLng = toLatLng.lng,
            fromLatLng = fromMarkerLoc.getLatLng(),
            fromLat = fromLatLng.lat,
            fromLng = fromLatLng.lng;

        var options = {
            locFrom: fromLat + "," + fromLng,
            locTo: toLat + "," + toLng,
            srv: srv,
            lang: lang
        };
        $(".div-loading-error").remove();
        var divLoading  = $("<div class='transition-loader'><div class='transition-loader-inner'>" +
            "<label></label><label></label><label></label><label></label><label></label><label></label>" +
            "</div></div>").appendTo($('#finded-routes-for-places'));

        infofindwaysRequest(options, function (result) {
            divLoading.remove();
            startFindWayRoutes = true;
            if (result == 'Connect error'){
                $("<div class='div-loading-error'>" + translate('failed to load data') + "</div>").appendTo($(".search-for-travel-block"));
                return;
            }
            createFindRouteTravel(result);
            setFindCorridors(result);
        });
    }
}

/* Блок найденных вариантов проезда - start */
function createFindRouteTravel(travel) {

    if ($("#finded-routes-for-places").hasClass("ui-accordion")){
        $("#finded-routes-for-places").accordion('destroy');
        $("#finded-routes-for-places").empty();
    }
    var findedRoutesForPlace = $('#finded-routes-for-places');

    for(var i = 0; i < travel.length; i++) {
        var routeTravelHeader = $('<div class="route-travel-header" data-id="' + travel[i].id + '"' +
            ' data-name="' + travel[i].route.name + '" data-vt="' + travel[i].route.vt + '">');
        var routeTravelContent = $('<div class="route-travel-content">');
        routeTravelHeader = getTravelHeader(travel[i], routeTravelHeader);
        routeTravelHeader.appendTo(findedRoutesForPlace);
        routeTravelContent = getTravelContent(travel[i], routeTravelContent);
        routeTravelContent.appendTo(findedRoutesForPlace);
    }

    findedRoutesForPlace.accordion({
        collapsible: true,
        alwaysOpen: false,
        autoheight: false,
        heightStyle: "content",
        icons: null,
        beforeActivate: function (event, ui) {
            var corrId = $(ui.newHeader).attr('data-id');
            routeNumb = $(ui.newHeader).attr('data-name');
            if(typeof(routeNumb) == 'undefined'){
                routeNumb = $(ui.oldHeader).attr('data-name');
            }
            vt = $(ui.newHeader).attr('data-vt');
            if(typeof(vt) == 'undefined'){
                vt = $(ui.oldHeader).attr('data-vt');
            }
            getFindCorridor(corrId);
            setTimeout(function () {
                $(".finded-routes-for-places").getNiceScroll().resize();
            }, 500);

        }
    });
    setTimeout(function () {
        $(".finded-routes-for-places").niceScroll({
            cursorcolor:"#cccccc",
            autohidemode: false,
            horizrailenabled:false
        });
    }, 1500);
}

/** Возвращает заголовок найденного варианта проезда */
function getTravelHeader(travel, routeTravelHeader) {
    var dispName = travel.route.name ;
    if (typeof(dispName) != 'undefined'){
        while (dispName.indexOf("0") === 0)
            dispName = dispName.substr(1);
    }
    var typesTransportList = $('<div class="types-transport-list">').appendTo(routeTravelHeader);
    $('<div class="types-' + travel.route.vt + '">').appendTo(typesTransportList);
    var numberTransportList = $('<div class="number-transport-list">' + dispName + '</div>').appendTo(routeTravelHeader);
    $('<div class="time-travel-total">' + correctTimeTravel(travel.time.overall) + ' ' + translate('min') + '</div>').appendTo(routeTravelHeader);
    $('<div class="price-travel-total">' + travel.cost.overall + ' ' + translate('rub') + '</div>').appendTo(routeTravelHeader);
    var comments = $('<div class="comments">' + getTravelHeaderComments(travel) + '</div>').appendTo(routeTravelHeader);
    $('<div class="icon-expand">').appendTo(routeTravelHeader);
    if (travel.transfer){
        routeTravelHeader = getTravelHeaderTransfer(travel.transfer, routeTravelHeader, typesTransportList, numberTransportList, comments);
    }
    return routeTravelHeader;
}

/** Рекурсия для заполнения типа транспорта и номера маршрутов проезда */
function getTravelHeaderTransfer(travel, routeTravelHeader, typesTransportList, numberTransportList, comments) {
    $('<div class="types-' + travel.route.vt + '">').appendTo(typesTransportList);
    numberTransportList.append(document.createTextNode(', ' + travel.route.name));
    if (travel.transfer){
        routeTravelHeader = getTravelHeaderTransfer(travel.transfer, routeTravelHeader, typesTransportList, numberTransportList);
    }
    return routeTravelHeader;
}

/** Заполняет комментарий о пересадках */
function getTravelHeaderComments(travel){
    var transfer = translate('without transfers');
    if (travel.transfer) {
        transfer = countTransfer(travel.transfer);
    }
    return transfer;
}

/** Определяет количество пересадок */
function countTransfer(travel) {
    var transfer = translate('1 transfer');
    if (travel.transfer) {
        transfer = translate('2 transfers');
        return transfer;
    }
    return transfer;
}

/** Таблица развернутого содержания варианта проезда */
function getTravelContent(travel, routeTravelContent) {
    var dispName = travel.route.name;
    while (dispName.indexOf("0") === 0)
        dispName = dispName.substr(1);

    var tableTravelList = $('<table class="table-travel-list" data-idtotal="' + travel.id + '" data-id="' + travel.idcorr + '"' +
            ' data-name="' + travel.route.name + '" data-vt="' + travel.route.vt + '">').appendTo(routeTravelContent),
        trList = $('<tr class="route-travel-list-tr">').appendTo(tableTravelList),
        tdList = $('<td id="types-travel-icon">').appendTo(trList),
        tableTransportIcon = $('<table class="types-transport-icon">').appendTo(tdList),
        trLineUp = $('<tr class="line">').appendTo(tableTransportIcon),
        trLineIcon = $('<tr class="line-icon">').appendTo(tableTransportIcon),
        trLineDown = $('<tr class="line">').appendTo(tableTransportIcon),
        tdLineDown = $('<td>').appendTo(trLineDown),
        tdNumber = $('<td id="types-travel-number">').appendTo(trList),
        tableTravelNumber = $('<table class="table-travel-number">').appendTo(tdNumber),
        tdName = $('<td id="types-halts-name">').appendTo(trList),
        tableHaltsName = $('<table class="table-halts-name">').appendTo(tdName);

    $('<td>').appendTo(trLineUp);
    $('<td id="icon-travel-' + travel.route.vt + '">').appendTo(trLineIcon);
    $('<tr class="line"><td class="transport-number">' + dispName + '</td></tr>').appendTo(tableTravelNumber);
    $('<tr class="line"><td class="transport-name">' + getTransportName(travel.route.vt) + '</td></tr>').appendTo(tableTravelNumber);
    $('<tr><td class="halts-name-start">' + travel.direction.stops[0].zones[0].name + '</td></tr>').appendTo(tableHaltsName);
    $('<tr><td class="halts-name-end">' + travel.direction.stops[1].zones[0].name + '</td></tr>').appendTo(tableHaltsName);
    $('<td id="types-travel-time">' + travel.time.current + '</td>').appendTo(trList);


    if (travel.transfer){
        $('<hr class="line-travel">').appendTo(tdLineDown);
        routeTravelContent = getTravelContentTransfer(travel.transfer, routeTravelContent);
    }
    return routeTravelContent;
}

/** Таблица развернутого содержания варианта проезда всех пересадок */
function getTravelContentTransfer(travel, routeTravelContent) {
    var tableTravelList = $('<table class="table-travel-list" data-idtotal="' + travel.id + '" data-id="' + travel.idcorr + '"' +
            ' data-name="' + travel.route.name + '" data-vt="' + travel.route.vt + '">').appendTo(routeTravelContent),
        trList = $('<tr class="route-travel-list-tr">').appendTo(tableTravelList),
        tdList = $('<td id="types-travel-icon">').appendTo(trList),
        tableTransportIcon = $('<table class="types-transport-icon">').appendTo(tdList),
        trLineUp = $('<tr class="line">').appendTo(tableTransportIcon),
        trLineIcon = $('<tr class="line-icon">').appendTo(tableTransportIcon),
        trLineDown = $('<tr class="line">').appendTo(tableTransportIcon),
        tdLineUp = $('<td>').appendTo(trLineUp),
        tdLineDown = $('<td>').appendTo(trLineDown),
        tdNumber = $('<td id="types-travel-number">').appendTo(trList),
        tableTravelNumber = $('<table class="table-travel-number">').appendTo(tdNumber),
        tdName = $('<td id="types-halts-name">').appendTo(trList),
        tableHaltsName = $('<table class="table-halts-name">').appendTo(tdName);

    $('<td id="icon-travel-' + travel.route.vt + '">').appendTo(trLineIcon);
    $('<tr class="line"><td class="transport-number">' + travel.route.name + '</td></tr>').appendTo(tableTravelNumber);
    $('<tr class="line"><td class="transport-name">' + getTransportName(travel.route.vt) + '</td></tr>').appendTo(tableTravelNumber);
    $('<tr><td class="halts-name-start">' + travel.direction.stops[0].zones[0].name + '</td></tr>').appendTo(tableHaltsName);
    $('<tr><td class="halts-name-end">' + travel.direction.stops[1].zones[0].name + '</td></tr>').appendTo(tableHaltsName);
    $('<td id="types-travel-time">' + travel.time.current + '</td>').appendTo(trList);
    $('<hr class="line-travel">').appendTo(tdLineUp);

    if (travel.transfer){
        $('<hr class="line-travel">').appendTo(tdLineDown);
        return getTravelContentTransfer(travel.transfer, routeTravelContent);
    }
    return routeTravelContent;
}

/** Определяет название транспорта */
function getTransportName(vt) {
    switch (vt) {
        case 'b':
            return translate('b');
            break;
        case 'rt':
            return translate('rt');
            break;
        case 'tb':
            return translate('tb');
            break;
        case 'tr':
            return translate('tr');
            break;
        case 'riv':
            return translate('riv');
            break;
        default :
            return '';
    }
}

/** Форматирование времени */
function correctTimeTravel(time) {
    if(time.substr(0, 2) == '00'){
        correctTime = time.substr(3, 2);
    } else {
        correctTime = time.substr(1, 4);
    }
    return correctTime;
}
/* Блок найденных вариантов проезда - end */


/** Создает массив найденных вариантов корридоров проезда */
function setFindCorridors(corridors) {
    if (corridors.length == 0){
        return;
    }
    findCorridors = [];
    for(var i = 0; i < corridors.length; i++) {
        findCorridors.push(corridors[i]);
    }
    routeNumb = findCorridors[0].route.name;
    vt = findCorridors[0].route.vt;
    getCorridorTotal(findCorridors[0]);
}

/** Выбор маршрута для проезда */
$(document).ready(function() {
       $(document).on("click", '.table-travel-list', function(event) {
           $('.table-travel-list').block({
               message: '',
               overlayCSS: {
                   backgroundColor: '#ffffff',
                   opacity: 0.1,
                   cursor: 'wait'
               }
           });
           markersGroupVt.clearLayers();
           courseCorridor.clearLayers();
           beginEndMarkerPart.clearLayers();

           var id = $(this).attr('data-id');
           var idTotal = $(this).attr('data-idtotal');
           routeNumb = $(this).attr('data-name');
           vt = $(this).attr('data-vt');
           addMarker();

           for (var i = 0; i < findCorridors.length; i++){
               if (findCorridors[i].id == idTotal){
                   getSelectCorridor(findCorridors[i], id);
               }
           }
       });

       // Использовать https://suggest-maps.yandex.ru/suggest-geo?callback=jQuery111106122736630617244_1439784328255&lang=ru_RU&search_type=all&fullpath=1&v=5&yu=3298460251429669061&spn=0.624847412109375%2C0.11222857027404132&ll=86.05243299999992%2C55.3712339999884&part=Вок&pos=5&_=1439784328264

       /** Определение адреса места отправления */
       $(function() {
           $("#addressFrom").autocomplete({
               source: function(request, response) {
                   var url_get_loc = "https://suggest-maps.yandex.ru/suggest-geo?callback=?&lang=ru_RU&pos=5&_=1439784328264&search_type=all&fullpath=1&v=5&yu=3298460251429669061&spn=0.6%2C0.6&ll=" + lonCity + ',' + latCity +"&part=" + request.term;
                   $.getJSON(url_get_loc, function (data) {
                       response($.map(data[1], function(item) {
                           if (item.length >= 2)
                               return {
                                   label: item[2],
                                   value: item[2]
                               };
                       }));
                   });
               },
               minLength: 3,
               select: function(event,ui) {
                   $.ajax({
                       url: "https://geocode-maps.yandex.ru/1.x/",
                       data: {
                           geocode: ui.item.value,
                           results: 1
                       },
                       type: "GET",
                       crossDomain: true,
                       success: function(data) {
                           var newdata = $(data);
                           var placeCoord = newdata.find("pos").text(),
                               space = placeCoord.indexOf(" "),
                               lat = placeCoord.substr(space + 1),
                               lon = placeCoord.substr(0, space);

                           if(!map.hasLayer(findMarkerGroup))
                               findMarkerGroup.addTo(map);
                           fromMarkerLoc.setLatLng(L.latLng(lat,lon)).addTo(findMarkerGroup);
                           map.panTo(fromMarkerLoc.getLatLng());
                           FindWayRoutes();
                       }
                   });

               }
           });
       });

       /** Определение адреса места назначения */
       $(function() {
           $("#addressTo").autocomplete({
               source: function(request, response) {
                   var url_get_loc = "https://suggest-maps.yandex.ru/suggest-geo?callback=?&lang=ru_RU&pos=5&_=1439784328264&search_type=all&fullpath=1&v=5&yu=3298460251429669061&spn=0.6%2C0.6&ll=" + lonCity + ',' + latCity +"&part=" + request.term;
                   $.getJSON(url_get_loc, function (data) {
                       response($.map(data[1], function(item) {
                           if (item.length >= 2)
                               return {
                                   label: item[2],
                                   value: item[2]
                               };
                       }));
                   });
               },
               minLength: 3,
               select: function(event,ui) {
                   $.ajax({
                       url: "https://geocode-maps.yandex.ru/1.x/",
                       data: {
                           geocode: ui.item.value,
                           results: 1
                       },
                       type: "GET",
                       crossDomain: true,
                       success: function(data) {
                           var newdata = $(data);
                           var placeCoord = newdata.find("pos").text(),
                               space = placeCoord.indexOf(" "),
                               lat = placeCoord.substr(space + 1),
                               lon = placeCoord.substr(0, space);

                           if(!map.hasLayer(findMarkerGroup))
                               findMarkerGroup.addTo(map);
                           toMarkerLoc.setLatLng(L.latLng(lat,lon)).addTo(findMarkerGroup);
                           map.panTo(toMarkerLoc.getLatLng());
                           FindWayRoutes();
                       }
                   });

               }
           });
       });
});


/** Маркер остановки большого размера */
function markerBigHalt(name, lat, lon, id) {
    var customMarker = L.Marker.extend({
        options: {
            id: ''
        }
    });

    var iconBigHalt = L.divIcon({
        iconSize: [25, 25],
        iconAnchor: [15, 15],
        popupAnchor: [0, -7],
        className: "custom-icon-bighalt",
        html: '<div class="icon-bighalt"></div>'
    });

    var marker = new customMarker([lat, lon], {
        title: name,
        icon: iconBigHalt,
        riseOnHover: true,
        zIndexOffset: 100,
        id: id
    });
    return marker;
}

/** Находит нужный корридор в общем массиве */
function getFindCorridor(id) {

    for (var i = 0; i < findCorridors.length; i++){
        if (findCorridors[i].id == id){
            arrayMarkers.length = 0;
            clearMap();
            getCorridorTotal(findCorridors[i]);
        }
    }
}

/** Отображает выбранный корридор проезда и маркеры начала и окончания пути */
function getCorridorTotal(corridor) {

    if (corridor.begin && corridor.end){
        var pointBeginLat = corridor.begin.location[0],
            pointBeginLon = corridor.begin.location[1],
            pointEndLat = corridor.end.location[0],
            pointEndLon = corridor.end.location[1];
    }

    if (pointBeginLat && pointBeginLon){
        var markerBegin = markerBigHalt(corridor.begin.name, pointBeginLat, pointBeginLon, corridor.begin.id);
        markerBegin.addTo(beginEndMarkerTotal);
        markerBegin
            .on('click', function (marker) {

                var divStop = (getNearArrival(marker.sourceTarget));

                var popupMarker = new L.popup({
                    offset: new L.Point(-3, -5),
                    closeButton: false
                })
                    .setLatLng(marker.sourceTarget.getLatLng())
                    .setContent(divStop[0]);

                map.openPopup(popupMarker);
                map.panTo(marker.sourceTarget.getLatLng());
            });
    }

    if (pointEndLat && pointEndLon){
        var markerEnd = markerBigHalt(corridor.end.name, pointEndLat, pointEndLon, corridor.end.id);
        markerEnd.addTo(beginEndMarkerTotal);
        markerEnd
            .on('click', function (marker) {

                var divStop = (getNearArrival(marker.sourceTarget));

                var popupMarker = new L.popup({
                    offset: new L.Point(-3, -5),
                    closeButton: false
                })
                    .setLatLng(marker.sourceTarget.getLatLng())
                    .setContent(divStop[0]);

                map.openPopup(popupMarker);
                map.panTo(marker.sourceTarget.getLatLng());
            });
    }

    if(corridor.transfer){
        getInactiveCorridors(corridor);
    } else {
        addMarker();

        for (var i = 0; i < corridor.direction.corridors.length; i++) {
            var corridorGeometry = [];
            for (var j = 0; j < corridor.direction.corridors[i].length; j++) {
                var point = corridor.direction.corridors[i][j];
                corridorGeometry.push(new L.LatLng(point[0], point[1]));
            }
            var line = L.polyline(corridorGeometry, {color: corridorColor, weight: 5, opacity: 1});
            courseCorridor.addLayer(line);
        }
        if (!map.hasLayer(courseCorridor)){
            map.addLayer(courseCorridor);
        }
    }
    if (!map.hasLayer(courseCorridorAll)){
        map.addLayer(courseCorridorAll);
    }
    if (!map.hasLayer(beginEndMarkerTotal)){
        map.addLayer(beginEndMarkerTotal);
    }
}

/** Отрисовка общего маршрута если есть пересадки */
function getInactiveCorridors(corridor) {

    for (var i = 0; i < corridor.direction.corridors.length; i++) {
        var corridorGeometry = [];
        for (var j = 0; j < corridor.direction.corridors[i].length; j++) {
            var point = corridor.direction.corridors[i][j];
            corridorGeometry.push(new L.LatLng(point[0], point[1]));
        }
        var line = L.polyline(corridorGeometry, {color: corridorColorInactive, weight: 5, opacity: 1});
        courseCorridorAll.addLayer(line);
    }

    if (corridor.transfer){
        getInactiveCorridors(corridor.transfer);
    }
}

/** Отображает выбранный участок корридора */
function getSelectCorridor(corridor, id) {
    var corridorGeometry = [],
        point, line;

    if (corridor.idcorr == id) {
        for (var i = 0; i < corridor.direction.corridors.length; i++) {
            for (var j = 0; j < corridor.direction.corridors[i].length; j++) {
                point = corridor.direction.corridors[i][j];
                corridorGeometry.push(new L.LatLng(point[0], point[1]));
            }
        }
        getSelectPointStartEnd(corridor);
        line = L.polyline(corridorGeometry, {color: corridorColor, weight: 5, opacity: 1});
        courseCorridor.addLayer(line);
        if (!map.hasLayer(courseCorridor)) {
            map.addLayer(courseCorridor);
        }
        courseCorridor.bringToFront();
    }
    if (corridor.transfer && (corridor.idcorr != id)){
        for (var k = 0; k < corridor.direction.corridors.length; k++) {
            for (var m = 0; m < corridor.direction.corridors[k].length; m++) {
                point = corridor.direction.corridors[k][m];
                corridorGeometry.push(new L.LatLng(point[0], point[1]));
            }
        }
        line = L.polyline(corridorGeometry, {color: corridorColorInactive, weight: 4, opacity: 1});
        courseCorridorAll.addLayer(line);
        getSelectCorridor(corridor.transfer, id)
    }
}

/** Маркеры начала и окончания выбранного участка */
function getSelectPointStartEnd(corridor) {

    var pointStartLat = corridor.direction.stops[0].zones[0].location[0],
        pointStartLon = corridor.direction.stops[0].zones[0].location[1],
        pointStopLat = corridor.direction.stops[1].zones[0].location[0],
        pointStopLon = corridor.direction.stops[1].zones[0].location[1];

    if (pointStartLat && pointStartLon){
        var markerBegin = markerBigHalt(corridor.direction.stops[0].zones[0].name, pointStartLat, pointStartLon, corridor.direction.stops[0].zones[0].id);
        markerBegin.addTo(beginEndMarkerPart);
        markerBegin
            .on('click', function (marker) {

                var divStop = (getNearArrival(marker.sourceTarget));

                var popupMarker = new L.popup({
                    offset: new L.Point(-3, -5),
                    closeButton: false
                })
                    .setLatLng(marker.sourceTarget.getLatLng())
                    .setContent(divStop[0]);

                map.openPopup(popupMarker);
                map.panTo(marker.sourceTarget.getLatLng());
            });
    }

    if (pointStopLat && pointStopLon){
        var markerEnd = markerBigHalt(corridor.direction.stops[1].zones[0].name, pointStopLat, pointStopLon, corridor.direction.stops[1].zones[0].id);
        markerEnd.addTo(beginEndMarkerPart);
        markerEnd
            .on('click', function (marker) {

                var divStop = (getNearArrival(marker.sourceTarget));

                var popupMarker = new L.popup({
                    offset: new L.Point(-3, -5),
                    closeButton: false
                })
                    .setLatLng(marker.sourceTarget.getLatLng())
                    .setContent(divStop[0]);

                map.openPopup(popupMarker);
                map.panTo(marker.sourceTarget.getLatLng());
            });
    }
    if (!map.hasLayer(beginEndMarkerPart)){
        map.addLayer(beginEndMarkerPart);
    }
}

/** Определение координат текущего места */
function getPlaceByCoords(LatLng, inputText){
    var lat = LatLng.lat,
        lng = LatLng.lng;

    jQuery.support.cors = true;
    $.ajax({
            url: "https://nominatim.openstreetmap.org/search/" + lat + "," + lng,
            data: { limit: 1, format: 'json', addressdetails: 1 },
            //dataType: "xml",
            dataType: "json",
            type: "GET",
            //crossDomain: true,
            success: function(data){
                var addr= lng + ':' + lat;
                if (data && data.length > 0 && data[0].display_name) {
                    addr = data[0].display_name;
                }

                $(inputText).val(addr);
            }
        });
}

/** toMarkerLoc fromMarkerLoc поиск проезда при смене позиции маркеров */
toMarkerLoc.on('dragend', function(e){
    arrayMarkers.length = 0;
    clearMap();
    getPlaceByCoords(toMarkerLoc.getLatLng(), $('#addressTo'));
    FindWayRoutes();
});
fromMarkerLoc.on('dragend', function(e){
    arrayMarkers.length = 0;
    clearMap();
    getPlaceByCoords(fromMarkerLoc.getLatLng(), $('#addressFrom'));
    FindWayRoutes();
});

/** Очиcтка параметров поиска проезда */
function nullFindway() {
    markerLoc.setLatLng(L.latLng(0, 0));
    toMarkerLoc.setLatLng(L.latLng(0, 0));
    fromMarkerLoc.setLatLng(L.latLng(0, 0));
    $('#addressFrom').val('');
    $('#addressTo').val('');
    routeNumb = null;
    $('#finded-routes-for-places').empty();
    $(".finded-routes-for-places").getNiceScroll().remove();
    findMarkerGroup.clearLayers();
    beginEndMarkerTotal.clearLayers();
    beginEndMarkerPart.clearLayers();
    courseCorridor.clearLayers();
    courseCorridorAll.clearLayers();
    arrayMarkers.length = 0;
    clearMap();
}

var variants = [], directions = [],
    invalidTransport = false, blindTransport = false,
    deafTransport = false,
    arrayFavTransport = [], arrayRouteList = [],
    tableRouteList, name_city, timezone, srv;

$(document).ready(function() {
    $('.close-menu').click(function(){
        $('.close-menu').toggleClass('closed-menu');
        hideShowMenu();
    });
    paramMenu();

    $(window).on('resize', function() {
        paramMenu();
    });

    $(document).on('click', '.ui-state-focus', function (e) {
        if ($(this).attr('aria-selected') == 'false'){
            $(".short-route").hide();
            shortRouteDown();
        }
    });

    $(function($){
        $.datepicker.regional['ru'] = {
            closeText: 'Закрыть',
            prevText: '&#x3c;Пред',
            nextText: 'След&#x3e;',
            currentText: 'Сегодня',
            monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
            monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
            dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
            dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
            dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
            weekHeader: 'Не',
            dateFormat: 'dd.mm.yy',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''
        };
        $.datepicker.regional['en'] = {
            dateFormat: 'dd.mm.yy',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''
        };
        $.datepicker.setDefaults($.datepicker.regional[lang]);
    });

    /** Вывод расписания движения при выборе дня */
    $('#datepicker').datepicker({
        onSelect: function() {
            if (!startFunction){
                return;
            }
            var options = {
                route: routeNumb,
                vt: vt,
                date: moment($('#datepicker').val(), 'DD.MM.YYYY').format('YYYY-MM-DD'),
                srv: srv,
                lang: lang
            };
            startFunction = false;
            arrayMarkers.length = 0;

            $(".short-route").empty();
            $('.short-route').hide();
            shortRouteDown();
            inforoutedetailsRequest(options, function (routeObject) {
                startFunction = true;
                if (routeObject == 'Connect error'){
                    return;
                }
                directions.length = 0;
                getDirectionsRoute(routeObject);
                $(".route-info-halts").getNiceScroll().resize();
            });
        }
    }).val();

    /** Закрывает меню выбора города при клике вне меню */
    $(function($){
        $('.right').mouseup(function (e){
            var div = $(".overflow-city-menu");
            if (!div.is(e.target)
                && div.has(e.target).length === 0) {
                closeCityMenu();
            }
        });
    });

    /** Поиск маршрута */
    $("#searchRoute").on('keyup', function () {
        createRouteListTable(arrayRouteList, tableRouteList, setNiceScroll);
        var search = $("#searchRoute").val();
        searchRouteMarkers(search);
    });

    /** Скрыть/показать маршрут */
    $(".hide-route-icon").click(function () {
        if ($('.hide-route-icon').hasClass("icon-on")) {
            $('.hide-route-icon').removeClass("icon-on");
            $('.hide-route-icon').addClass("icon-off");
            hideCorridor();

        } else if ($('.hide-route-icon').hasClass("icon-off")) {
            $('.hide-route-icon').removeClass("icon-off");
            $('.hide-route-icon').addClass("icon-on");
            showCorridor();
        }
    });

    /** Кнопка очистки параметров поиска проезда */
    $(".clear-find-places").click(function () {
        nullFindway();
    });
});

/** Очистка cookie с типом техники при смене города */
function clearCookieCity() {
    $.cookie('select-vt', null);
}

function initCity(data) {
    var cityId;

    if (typeof(data) == 'undefined'){
        cityId = startId;
        $.cookie('mainCity', cityId, { expires: 365 });
    } else {
        cityId = $(data).attr('data-id');
        $.cookie('mainCity', cityId, { expires: 365 });
    }
    arrayMarkers.length = 0;
    clearInterval(interval);
    inittransportBlock();
    $('.b, .rt, .tb, .tr, .riv').hide();
    $(".routelist-block").empty();
    initCityRequest(cityId, function (result) {
        map.off('click');
        map.on('click', function(e) {
            $(".leaflet-control-layers").removeClass("leaflet-control-layers-expanded");
        });
        name_city = result.name_city;
        srv = result.srv;
        latCity = result.lat;
        lonCity = result.lon;
        timezone = result.timezone;
        routeNumb = null;
        map.panTo([latCity, lonCity]);
        $('.curCity').text(name_city);
        clearMap();
        getRoutesList();
        groupStopsVt.clearLayers();
        groupStopsVt.remove();
        getStops();
        if (getCookie('soc-signs') == 1) {
            toggleSocialSigns();
        }
        if (getCookie('road-signs') == 1) {
            toggleRoadSigns();
        }
    });
}

/** Загружает список маршрутов */
function getRoutesList() {
    inforoutesRequest(function (answer) {
        var snackbar = $('.snackbar');
        if (answer == 'Connect error'){
            if(!snackbar.hasClass('active')){
                $.snackbar(translate('failed to load data'));
            }
            return;
        }
        snackbar.removeClass('active');
        arrayRouteList = answer;
        initInterface();
        getTransportType();
    });
}

/** Инициализация интерфейса меню */
var startFunction = true;
function initInterface() {

    $("#checkboxBtnsDiv label, .transportType, .transport-button, .search-for-travel-button, .favorites-button").unbind();
    $(".overflow-city-menu").getNiceScroll().remove();

    if ($("#div-route-halts").hasClass("ui-accordion")){
        $("#div-route-halts").accordion('destroy');
        $("#div-route-halts").empty();
    }
    if ($("#finded-routes-for-places").hasClass("ui-accordion")){
        $("#finded-routes-for-places").accordion('destroy');
        $("#finded-routes-for-places").empty();
        nullFindway();
    }
    var currentDate = new Date();
    var dd = (currentDate.getDate()<10?'0':'') + currentDate.getDate();
    var mm = (currentDate.getMonth()<9?'0':'') + (currentDate.getMonth() + 1);
    var yyyy = currentDate.getFullYear();

    $('#checkboxBtnsDiv label').click(function () {
        if ($(this).hasClass('checkbus')) {
            if ($('#busRadio').prop('checked')) {
                $(this).removeClass("selectedRadio");
            } else {
                $(this).addClass('selectedRadio');
            }
        }
        if ($(this).hasClass('checktaxi')) {
            if ($('#taxiRadio').prop('checked')) {
                $(this).removeClass("selectedRadio");
            } else {
                $(this).addClass('selectedRadio');
            }
        }
        if ($(this).hasClass('checktrolleybus')) {
            if ($('#trolleybusRadio').prop('checked')) {
                $(this).removeClass("selectedRadio");
            } else {
                $(this).addClass('selectedRadio');
            }
        }
        if ($(this).hasClass('checktramvai')) {
            if ($('#tramvaiRadio').prop('checked')) {
                $(this).removeClass("selectedRadio");
            } else {
                $(this).addClass('selectedRadio');
            }
        }
        if ($(this).hasClass('checkriver')) {
            if ($('#riverRadio').prop('checked')) {
                $(this).removeClass("selectedRadio");
            } else {
                $(this).addClass('selectedRadio');
            }
        }
        timeoutInitRouteListBlock();
    });

    $("#datepicker").datepicker().val(dd + '.' + mm + '.' + yyyy).next().insertBefore("#datepicker");

    /** Блок маршрутов */
    $(".transport-button").click(function () {
        if (!$(".transport-button").hasClass("selectedButton")) {
            arrayMarkers.length = 0;
            inittransportBlock();
            initRouteListBlock();
        }
        map.off('click');
        map.on('click', function(e) {
            $(".leaflet-control-layers").removeClass("leaflet-control-layers-expanded");
        });
    });

    /** Поиск проезда */
    $(".search-for-travel-button").click(function () {

        if ($(".search-for-travel-block").is(":hidden")) {
            $(this).addClass("selectedButton");
            $(".routelist-block, .route-info-halts, .overflow-city-menu, .favorites-body").getNiceScroll().remove();
            $(".transporttype-block, .routelist-block, #city-menu, .route-info, .favorites-block").hide();
            if ($("#div-route-halts").hasClass("ui-accordion")){
                $("#div-route-halts").accordion('destroy');
                $("#div-route-halts").empty();
            }
            $(".search-for-travel-block, .limited").show();
            if ($('#finded-routes-for-places').text().trim() != ''){
                $(".finded-routes-for-places").niceScroll({
                    cursorcolor:"#cccccc",
                    autohidemode: false,
                    horizrailenabled:false
                });
            }
            $(".transport-button, .favorites-button").removeClass("selectedButton");
            $(".searchRoute").val('');
            arrayMarkers.length = 0;
            clearMap();
        }
        map.on('click', function (e) {
            addInfoPlace(e);
        });
    });

    /** Избранное */
    $('.favorites-button').click(function () {
        if ($(".favorites-block").is(":hidden")) {
            $(this).addClass("selectedButton");
            $(".routelist-block, .finded-routes-for-places, .route-info-halts, .overflow-city-menu").getNiceScroll().remove();
            $(".transporttype-block, .routelist-block, #city-menu, .route-info, .search-for-travel-block").hide();
            $(".favorites-block, .limited").show();
            $(".transport-button, .search-for-travel-button").removeClass("selectedButton");
            $(".searchRoute").val('');
            arrayMarkers.length = 0;
            clearMap();
            getFavoritesTransport(setNiceScroll);
        }
        map.off('click');
        map.on('click', function() {
            $(".leaflet-control-layers").removeClass("leaflet-control-layers-expanded");
        });
        findMarkerGroup.clearLayers();
    });

    if (!banners) {
        $('.footer-menu').hide();
    }
}

/** Пауза перед инициализацией блока маршрутов */
function timeoutInitRouteListBlock() {
    $('.service-button, #checkboxBtnsDiv, .route-travel-header, .routelist-block').block({
        message: '',
        overlayCSS: {
            backgroundColor: '#ffffff',
            opacity: 0.1,
            cursor: 'wait'
        }
    });
    setTimeout(function () {
        initRouteListBlock();
    }, 400);
}

/** Инициализация блока маршрутов */
function inittransportBlock() {
    $(".transport-button").addClass("selectedButton");
    $(".routelist-block, .finded-routes-for-places, .route-info-halts, .overflow-city-menu, .favorites-body").getNiceScroll().remove();
    $(".search-for-travel-block, #city-menu, .route-info, .favorites-block").hide();
    if ($("#div-route-halts").hasClass("ui-accordion")){
        $("#div-route-halts").accordion('destroy');
        $("#div-route-halts").empty();
    }
    $(".transporttype-block, .routelist-block, .limited").show();
    $(".search-for-travel-button, .favorites-button").removeClass("selectedButton");
}

/** Инициализация таблицы маршрутов */
function initRouteListBlock() {
    clearMap();
    routeNumb = null;
    $(".searchRoute").val('');
    getCheckTypetransport();
    if ((invalidTransport == false) && (blindTransport == false) && (deafTransport == false)){
        $(".cell-invalid").removeClass("cell-invalid");
    }
    findMarkerGroup.clearLayers();
    findMarkerGroup.remove();
}

/** Загружает тип транспорта для отображения в меню*/
function getTransportType() {
    $('#checkboxBtnsDiv input').prop('checked', false);
    $('#checkboxBtnsDiv label').removeClass('selectedRadio');
    infotransporttypesRequest(function (answer) {
        if (answer == 'Connect error'){
            return;
        }
        for(var i = 0; i < answer.length; i++) {
            $('.' + answer[i]).fadeIn();
        }
        if ($.cookie('select-vt') && ($.cookie('select-vt') != 'null')){
            var cookieVt = $.cookie('select-vt');
            var arrVt = cookieVt.split(';');
            arrVt.splice(-1,1);
            for(var j = 0; j < arrVt.length; j++) {
                $("." + arrVt[j] + " input").prop('checked', true);
                $("." + arrVt[j] + " label").addClass('selectedRadio');
            }
        } else {
            for(var k = 0; k < answer.length; k++) {
                $("." + answer[k] + " input").prop('checked', true);
                $("." + answer[k] + " label").addClass('selectedRadio');
            }
        }
        initRouteListBlock();
    });
}

/** Определяем активный транспорт */
function getCheckTypetransport(){
    vt = '';
    var checkTypeTransport = $('#checkboxBtnsDiv input');
    for (var j = 0; j < checkTypeTransport.length; j++) {
        if (($(checkTypeTransport[j]).prop("checked"))) {
            vt += $(checkTypeTransport[j]).val() + ';';
        }
    }
    $.cookie('select-vt', vt, { expires: 365 });
    getRoutesBlock();
    addMarker();
}

/** Строит блок маршрутов в меню */
function getRoutesBlock(){

    var routeList = $(".routelist-block");
    routeList.empty();

    tableRouteList = $('<table class="transport-numb-list-block" id="table-route-list">').appendTo(routeList)
        .on('click', 'div', function (){
            $(".short-route").empty();
            $('#start-directions, #end-directions').val('');
            $('.transporttype-block, .routelist-block, .short-route, .route-info-halts').hide();
            $(".div-loading-error").remove();
            $('.route-name').text('');
            $('.favorites-star').removeClass('favorites-star-fav');
            $('#route-number-select').removeClass();
            shortRouteDown();
            $('.route-info').show();
            $(".transport-button").removeClass("selectedButton");
            if ($("#div-route-halts").hasClass("ui-accordion")){
                $("#div-route-halts").accordion('destroy');
                $("#div-route-halts").empty();
            }
            routeNumb = $(this).attr('data-name');
            vt = $(this).attr('vt');
            var options = {
                route: routeNumb,
                vt: vt,
                date: moment($('#datepicker').val(), 'DD.MM.YYYY').format('YYYY-MM-DD'),
                srv: srv,
                lang: lang
            };
            var divLoading  = $("<div class='transition-loader'><div class='transition-loader-inner'>" +
                "<label></label><label></label><label></label><label></label><label></label><label></label>" +
                "</div></div>").appendTo($('.route-info'));

            directions.length = 0;
            arrayMarkers.length = 0;
            inforoutedetailsRequest(options, function (routeObject) {
                clearMap();
                divLoading.remove();
                if (routeObject == 'Connect error'){
                    $("<div class='div-loading-error'>" + translate('failed to load data') + "</div>").appendTo($(".route-info"));
                    return;
                }
                addMarker();
                getDirectionsRoute(routeObject);
            });
        });

    createRouteListTable(arrayRouteList, tableRouteList, setNiceScroll);
}

/** Кастомизированный скроллбар */
function setNiceScroll(data) {
    $(data).niceScroll({
        cursorcolor: "#cccccc",
        autohidemode: false,
        horizrailenabled: false
    });
}

/** Таблица блока маршрутов в меню */
function createRouteListTable(routeBlock, table, callback){
    if (vt === ''){
        return;
    }
    var arrVt = vt.split(';');

    table.children().remove();
    if (routeBlock.length === 0){
        return;
    }
    var tr = $('<tr>').appendTo(table);
    for (var i = 0; i < (routeBlock.length); i++){

        if (typeof(routeBlock[i].vt) === 'undefined'){
            continue;
        }

        for (var k = 0; k < arrVt.length; k++){
            if (routeBlock[i].vt == arrVt[k]){
                var routeVt = routeBlock[i].vt;

                var dispName = routeBlock[i].name;
                while (dispName.indexOf("0") === 0)
                    dispName = dispName.substr(1);

                var search = $("#searchRoute").val();

                if (~dispName.indexOf(search)){
                    var td, classTd = routeVt + '-cell';
                    var tdlen = table.find('tr').last();
                    if (tdlen.find('td').length == 6) {
                        tr = $('<tr>').appendTo(table);
                    }
                    td = $('<td>').appendTo(tr);
                    td.append('<div class="' + classTd + '" vt="' + routeVt + '" data-name="' + routeBlock[i].name + '" vol="' + dispName + '">' + dispName + '</div>');
                }
            }
        }
    }

    if (table.find('tr').first().find('td').length < 6){
        for (var j = table.find('tr').first().find('td').length; j < 6; j++){
            td = $('<td>').appendTo(tr);
            td.append('<div class="null-cell"></div>');
        }
    }
    $(".routelist-block").getNiceScroll().resize();

    if (invalidTransport === true){
        updateTableLowFloor();
    }

    if (blindTransport === true){
        updateTableVoiceNotify();
    }

    if (deafTransport === true){
        updateTableInfoTable();
    }
    callback(".routelist-block");
}

/** Отображение стоимости проезда */
function updateCost(cost) {
    if (cost) {
        $('.price-route-travel').css({display: 'inline-block'});
        $('.price-text').text(parseFloat(cost) + ' ' + translate('rub'));
    } else {
        $('.price-route-travel').css({display: 'none'});
    }
}

/** Скрыть/показать меню */
function hideShowMenu() {
    if ($(".main-menu").is(":hidden")) {
        $(".main-menu").slideDown(200);
    } else {
        $(".main-menu").slideUp(200);
    }
}

/** Открыть/закрыть список выбора города при клике по названию */
function toggleCityMenu() {
    if ($("#city-menu").is(":hidden")) {
        $(".transporttype-block, .routelist-block, .limited, .search-for-travel-block, .route-info, .favorites-block").hide();
        $("#city-menu").show();
        $(".routelist-block, .finded-routes-for-places, .route-info-halts, .overflow-city-menu, .favorites-body").getNiceScroll().remove();
        $(".overflow-city-menu").niceScroll({
            cursorcolor:"#cccccc",
            autohidemode: false,
            horizrailenabled:false
        });
    } else {
        closeCityMenu();
    }
}

/** Закрывает меню выбора города */
function closeCityMenu() {
    $("#city-menu").hide();
    $(".overflow-city-menu").getNiceScroll().remove();
    if ($(".transport-button").hasClass("selectedButton")) {
        $(".transporttype-block, .routelist-block, .limited").show();
        $(".routelist-block").niceScroll({
            cursorcolor:"#cccccc",
            autohidemode: false,
            horizrailenabled:false
        });
    }
    if ($(".search-for-travel-button").hasClass("selectedButton")) {
        $(".search-for-travel-block, .limited").show();
        $(".finded-routes-for-places").niceScroll({
            cursorcolor:"#cccccc",
            autohidemode: false,
            horizrailenabled:false
        });
    }

    if ($(".favorites-button").hasClass("selectedButton")) {
        $(".favorites-block, .limited").show();
        $(".favorites-body").niceScroll({
            cursorcolor:"#cccccc",
            autohidemode: false,
            horizrailenabled:false
        });
    }
    if ((!$(".transport-button, .search-for-travel-button, .favorites-button").hasClass("selectedButton"))) {
        $(".limited, .route-info").show();
        $(".route-info-halts").niceScroll({
            cursorcolor:"#cccccc",
            autohidemode: false,
            horizrailenabled:false
        });
    }
}

/** Вариант движения маршрута */
function getDirectionsRoute(routeObject){
    getFavorites(routeNumb, vt);
    var divroutenumber = $('.route-number-select');

    if (routeObject && routeObject.directions){
        var dispName = routeObject.name;
        while (dispName.indexOf("0") === 0)
            dispName = dispName.substr(1);
        updateCost(routeObject.directions[0].cost);
        var divRouteVt = $('#route-number-select');
        divRouteVt.removeClass();
        divRouteVt.addClass('route-number-' + routeObject.vt);
        divRouteVt.appendTo(divroutenumber);
        $('.route-name').text(dispName);

        for(var i = 0; i < routeObject.directions.length; i++) {
            directions[i] = routeObject.directions[i];
        }
    }

    $('#start-directions').val(directions[0].begName);
    $('#end-directions').val(directions[0].endName);
    $('.hours-range').text(moment(directions[0].begTime).format('HH:mm') + '-' + moment(directions[0].endTime).format('HH:mm'));

    createHaltList(directions[0], setNiceScroll);
    addRouteOnMap(directions);

    divroutenumber.attr('data-name', routeNumb);
    divroutenumber.attr('data-vt', vt);
}

/** Смена направления движения маршрута */
function toggleDirections() {
    var homeDir = directions.splice(0, 1);
    directions.push(homeDir[0]);
    getDirectionsRoute();
}

/** Список остановок по выбранному маршруту в меню */
function createHaltList(selectDir, callback){

    if ($("#div-route-halts").hasClass("ui-accordion")){
        $("#div-route-halts").accordion('destroy');
        $("#div-route-halts").empty();
    }

    var divRouteHalts = $('#div-route-halts');

    if (selectDir.stops[0].comings.length > 0){
        for(var i = 0; i < selectDir.stops.length; i++) {
            var zonePoint = selectDir.stops[i];
            var zone = selectDir.stops[i].zones[0];
            var zoneId = zone.id;
            variants[zoneId] = zonePoint.variants;
            $('<h3 class="list-halts-header" data-id="' + selectDir.stops[i].zones[0].id + '">' + selectDir.stops[i].zones[0].name + '</h3>').appendTo(divRouteHalts);
            var listHaltsContent = $('<div class="list-halts-content">').appendTo(divRouteHalts);
            var printButton = $('<button class="print-schedule" data-id="' + selectDir.stops[i].zones[0].id + '"' +
                ' onclick="printShedulle(this)">' + translate('print') + '</button>');
            printButton.appendTo(listHaltsContent);

            var stophours = [], arrIdZones = [];

            arrIdZones[zoneId] = zoneId;

            for (var j = 0; j < zonePoint.comings.length; j++){
                var stoptime = Number(moment(zonePoint.comings[j].time).format('HH'));
                stophours[j] = stoptime + Number(timezone);
                if (stophours[j] > 23){
                    stophours[j] = stophours[j] - 24;
                }
                if (stophours[j] < 0){
                    stophours[j] = stophours[j] + 24;
                }
            }

            var uniquestops = unique(stophours);

            createScheduleTable(uniquestops, zonePoint).appendTo(listHaltsContent);
        }

        divRouteHalts.accordion({
            collapsible: true,
            alwaysOpen: false,
            autoheight: false,
            heightStyle: "content",
            active: false,
            icons: null,
            activate: function (event, ui) {
                var curZoneId = $(ui.newHeader).attr('data-id');
                $(ui.newHeader).ScrollTo();
                $(".route-info-halts").getNiceScroll().resize();
                if((typeof(curZoneId) != 'undefined') && (selectDir.stops[0].comings.length !== 0)) {
                    createSmallVariants(curZoneId);
                    getSelectStops(stopsRoute[curZoneId], $(ui.newHeader).text(), curZoneId);
                }
            }
        });

        $('.route-info-halts').slideDown(500);
    }

    if (selectDir.stops[0].comings.length === 0){
        createNoRouteDay();
    }

    callback(".route-info-halts");
}

/** Удаляет дублирующиеся часы для создания таблицы расписания */
function unique(arr) {
    arr.sort(function(a,b){return a - b});
    return arr.filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

/** Создание таблицы расписания в меню */
function createScheduleTable(stophours, zonePoint){
    var table = $('<table class="schedule">');

    if (stophours.length === 0){
        return table;
    }
    for (var i = 0; (i < stophours.length || i < 4); i++){
        if (typeof(stophours[i]) == 'undefined'){
            stophours[i] = '';
        }

        var tr, td;

        if ((i == 0) || (i == 8) || (i == 16)) {
            tr = $('<tr>').appendTo(table);
            tr.addClass('even');
        }

        if ((i == 4) || (i == 12) || (i == 20)){
            tr = $('<tr>').appendTo(table);
            tr.addClass('odd');
        }

        td = $('<td class="shedule-hours">').appendTo(tr);

        if ((i % 2) === 0) {
            td.addClass('even');
        } else {
            td.addClass('odd');
        }

        td.append('<span>' + stophours[i] + '</span>');
        var minTbl = $('<table class="tableminute">');
        minTbl.appendTo(td);

        createScheduleTableMinutes(minTbl, stophours[i], zonePoint);
    }
    return table;
}

/** Добавление минут к часам в таблице расписания */
function createScheduleTableMinutes(minTbl, stophour, zonePoint) {
    for(var i = 0; i < zonePoint.comings.length; i++) {

        var hour = Number(moment(zonePoint.comings[i].time).format('HH')) + Number(timezone),
            minute = ((Number(moment(zonePoint.comings[i].time).format('mm')))<10?'0':'') + (Number(moment(zonePoint.comings[i].time).format('mm')));

        if (hour > 23){
            hour = hour - 24;
        }
        if (hour < 0){
            hour = hour + 24;
        }

        if (stophour === hour) {

            var tr = minTbl.find('tr').last();

            if (tr.length == 0 || tr.find('td').length == 4){
                tr = $("<tr></tr>");
                minTbl.append(tr);
            }

            var td = $("<td class='minutes' align='center' valign='middle'><div class='div-minutes'>" + minute + "</div></td>");
            if (zonePoint.comings[i].variant == '¹'){
                for (var j = 0; j < zonePoint.variants.length; j++){
                    if (zonePoint.variants[j].substr(0, 1) == '¹'){
                        td.find('div').attr('title', zonePoint.variants[j].substr(4));
                        td.find('div').css('cursor', 'default');
                    }
                }
                td.find('div').addClass('variant-1');
            }
            if (zonePoint.comings[i].variant == '²'){
                for (var k = 0; k < zonePoint.variants.length; k++){
                    if (zonePoint.variants[k].substr(0, 1) == '²'){
                        td.find('div').attr('title', zonePoint.variants[k].substr(4));
                        td.find('div').css('cursor', 'default');
                    }
                }
                td.find('div').addClass('variant-2');
            }
            if (zonePoint.comings[i].variant == '³'){
                for (var l = 0; l < zonePoint.variants.length; l++){
                    if (zonePoint.variants[l].substr(0, 1) == '³'){
                        td.find('div').attr('title', zonePoint.variants[l].substr(4));
                        td.find('div').css('cursor', 'default');
                    }
                }
                td.find('div').addClass('variant-3');
            }
            if (zonePoint.comings[i].variant == '⁴'){
                for (var m = 0; m < zonePoint.variants.length; m++){
                    if (zonePoint.variants[m].substr(0, 1) == '⁴'){
                        td.find('div').attr('title', zonePoint.variants[m].substr(4));
                        td.find('div').css('cursor', 'default');
                    }
                }
                td.find('div').addClass('variant-4');
            }
            if (zonePoint.comings[i].variant == '⁵'){
                for (var n = 0; n < zonePoint.variants.length; n++){
                    if (zonePoint.variants[n].substr(0, 1) == '⁵'){
                        td.find('div').attr('title', zonePoint.variants[n].substr(4));
                        td.find('div').css('cursor', 'default');
                    }
                }
                td.find('div').addClass('variant-5');
            }
            if (zonePoint.comings[i].variant == '⁶'){
                for (var p = 0; p < zonePoint.variants.length; p++){
                    if (zonePoint.variants[p].substr(0, 1) == '⁶'){
                        td.find('div').attr('title', zonePoint.variants[p].substr(4));
                        td.find('div').css('cursor', 'default');
                    }
                }
                td.find('div').addClass('variant-6');
            }
            tr.append(td);
        }
    }
}

/** Создает таблицу с легендой для укороченных направлений маршрутов */
function createSmallVariants(zoneId) {

    $('.short-route').hide();

    var shortRoute = $(".short-route").empty();
    shortRouteDown();

    var curVariant = variants[zoneId];
    if (curVariant.length > 0) {
        var shortTable = $('<table>').appendTo(shortRoute),
            shortTr = $('<tr>').appendTo(shortTable);

        for (var i = 0; i < curVariant.length; i++){
            if ((shortTr.last().find('td').length % 6) == 0) {
                shortTr = $('<tr>').appendTo(shortTable);
                shortRouteUp();
            }

            var shortIconTd = $('<td class="short-icon-td">').appendTo(shortTr.last());
            var shortIcon = $('<div class="short-icon-div">');
            var shortTextTd = $('<td>').appendTo(shortTr.last());
            var shortText = $('<div class="short-text-div">' + curVariant[i].substr(1) + '</div>');
            if (curVariant[i].substr(0, 1) == '¹') {
                shortIcon.addClass('variant-1');
            }
            if (curVariant[i].substr(0, 1) == '²') {
                shortIcon.addClass('variant-2');
            }
            if (curVariant[i].substr(0, 1) == '³') {
                shortIcon.addClass('variant-3');
            }
            if (curVariant[i].substr(0, 1) == '⁴') {
                shortIcon.addClass('variant-4');
            }
            if (curVariant[i].substr(0, 1) == '⁵') {
                shortIcon.addClass('variant-5');
            }
            if (curVariant[i].substr(0, 1) == '⁶') {
                shortIcon.addClass('variant-6');
            }
            $('.short-route').show();
            shortIconTd.append(shortIcon);
            shortTextTd.append(shortText);
        }
    }
}

/** Создает таблицу с легендой для выходного дня */
function createNoRouteDay() {
    $(".short-route").empty();
    shortRouteDown();
    $('.hours-range').text(translate('day off'));
}

/** Скрыть маршрут и остановки на карте */
function hideCorridor() {
    map.removeLayer(inactiveCorridor);
    map.removeLayer(courseCorridor);
    map.removeLayer(groupStopsRoute);
    map.removeLayer(selectStops);
}

/** Показать маршрут и остановки на карте */
function showCorridor() {
    map.addLayer(inactiveCorridor);
    map.addLayer(courseCorridor);
    map.addLayer(groupStopsRoute);
    map.addLayer(selectStops);
}

/** Кнопка печать расписания */
function printShedulle(data) {
    var id = $(data).attr('data-id'),
    date = moment($('#datepicker').val(), 'DD.MM.YYYY').format('YYYY-MM-DD');
    window.open("print?id=" + id + '&route=' + routeNumb + '&vt=' + vt + '&date=' + date + '&srv=' + srv + '&lang=' + lang);
}

/** Проверка нахождения в избранном */
function getFavorites(nameFav, vtFav) {
    if ($.cookie('favorites-' + srv)) {
        arrayFavTransport = JSON.parse($.cookie('favorites-' + srv));
        for (var i = 0; i < arrayFavTransport.length; i++){
            if ((arrayFavTransport[i].name == nameFav) && (arrayFavTransport[i].vt == vtFav)){
                $('.favorites-star').addClass('favorites-star-fav');
            }
        }
    }
    var title;
    if ($('.favorites-star').hasClass('favorites-star-fav')){
        title = translate('remove from favorites');
    }
    if (!$('.favorites-star').hasClass('favorites-star-fav')){
        title = translate('add to favorites');
    }
    $('.route-number-select').attr('title', title);
}

/** Запись и удаление выбранного маршрута в избранное */
function setFavoritesTransport(data) {
    var favCookie, routeFav = {},
        vtFav, routeName;
    arrayFavTransport = [];
    vtFav = $(data).attr('data-vt');
    routeName = $(data).attr('data-name');
    routeFav.vt = vtFav;
    routeFav.name = routeName;

    if ($.cookie('favorites-' + srv) && ($('.favorites-star').hasClass('favorites-star-fav'))) {
        arrayFavTransport = JSON.parse($.cookie('favorites-' + srv));
        for (var i = 0; i < arrayFavTransport.length; i++){
            if ((arrayFavTransport[i].name == routeName) && (arrayFavTransport[i].vt == vtFav)){
                arrayFavTransport.splice(i, 1);
            }
        }
        favCookie = JSON.stringify(arrayFavTransport);
        $.cookie('favorites-' + srv, favCookie, { expires: 365 });
        $('.favorites-star').removeClass('favorites-star-fav');
        $('.route-number-select').attr('title', translate('add to favorites'));
        return;
    }

    if ($.cookie('favorites-' + srv) && (!$('.favorites-star').hasClass('favorites-star-fav'))) {
        arrayFavTransport = JSON.parse($.cookie('favorites-' + srv));
        arrayFavTransport.push(routeFav);
        favCookie = JSON.stringify(arrayFavTransport);
        $.cookie('favorites-' + srv, favCookie, { expires: 365 });
        $('.favorites-star').addClass('favorites-star-fav');
        $('.route-number-select').attr('title', translate('remove from favorites'));
        return;
    }

    if (!$('.favorites-star').hasClass('favorites-star-fav')) {
        arrayFavTransport.push(routeFav);
        favCookie = JSON.stringify(arrayFavTransport);
        $.cookie('favorites-' + srv, favCookie, { expires: 365 });
        $('.favorites-star').addClass('favorites-star-fav');
        $('.route-number-select').attr('title', translate('remove from favorites'));
        return;
    }
}

/** Сортировка маршрутов по имени */
function sortRoute(a, b) {
    if (a.vt == b.vt){
        return a.name.localeCompare(b.name);
    }
}

/** Сортировка маршрутов по виду техники */
function sortVt(a, b) {
    if (a.vt > b.vt) return 1;
    if (a.vt > b.vt) return -1;
}

/** Строит таблицу избранных маршрутов */
function getFavoritesTransport(callback) {
    $(".favorites-body").empty();
    if ($.cookie('favorites-' + srv)) {
        arrayFavTransport = JSON.parse($.cookie('favorites-' + srv));
        if (arrayFavTransport.length == 0){
            $(".favorites-body").text('Избранное');
            return;
        }
        arrayFavTransport.sort(sortVt);
        arrayFavTransport.sort(sortRoute);

        var table = $('<table class="transport-numb-list-block" id="table-route-list">').appendTo($('.favorites-body'))
            .on('click', 'div', function (){
                $(".short-route").empty();
                $('#start-directions, #end-directions').val('');
                $('.routelist-block, .short-route, .favorites-block, .route-info-halts').hide();
                $(".div-loading-error").remove();
                shortRouteDown();
                $('.route-info').show();
                $(".favorites-button").removeClass("selectedButton");
                if ($("#div-route-halts").hasClass("ui-accordion")){
                    $("#div-route-halts").accordion('destroy');
                    $("#div-route-halts").empty();
                }
                routeNumb = $(this).attr('data-name');
                vt = $(this).attr('vt');
                var options = {
                    route: routeNumb,
                    vt: vt,
                    date: moment($('#datepicker').val(), 'DD.MM.YYYY').format('YYYY-MM-DD'),
                    srv: srv,
                    lang: lang
                };
                var divLoading  = $("<div class='transition-loader'><div class='transition-loader-inner'>" +
                    "<label></label><label></label><label></label><label></label><label></label><label></label>" +
                    "</div></div>").appendTo($('.route-info'));

                arrayMarkers.length = 0;
                directions.length = 0;
                inforoutedetailsRequest(options, function (routeObject) {
                    divLoading.remove();
                    clearMap();
                    if (routeObject == 'Connect error'){
                        $("<div class='div-loading-error'>" + translate('failed to load data') + "</div>").appendTo($(".route-info"));
                        return;
                    }
                    addMarker();
                    getDirectionsRoute(routeObject);
                });
            });

        vt = '';
        routeNumb = '';

        for (var i = 0; i < (arrayFavTransport.length); i++){

            var vtFav = arrayFavTransport[i].vt;
            if (vt.indexOf(vtFav) == -1){
                vt += arrayFavTransport[i].vt + ';';
            }
            routeNumb += arrayFavTransport[i].name + ';';
            var dispName = arrayFavTransport[i].name;
            while (dispName.indexOf("0") === 0)
                dispName = dispName.substr(1);

            var tr, td, classTd = vtFav + '-cell';

            if (i % 6 === 0) {
                tr = $('<tr>').appendTo(table);
            }

            td = $('<td>').appendTo(tr);
            td.append('<div class="' + classTd + '" vt="' + vtFav + '" data-name="' + arrayFavTransport[i].name + '" vol="' + dispName + '">' + dispName + '</div>');

            if (invalidTransport === true) {
                cellSelectionInvalid(dispName, td);
            }
            if (blindTransport === true) {
                cellSelectionBlind(dispName, td);
            }
            if (deafTransport === true) {
                cellSelectionDeaf(dispName, td);
            }
        }

        addMarker();

        if (arrayFavTransport.length < 6){
            for (var j = arrayFavTransport.length; j < 6; j++){
                td = $('<td>').appendTo(tr);
                td.append('<div class="null-cell"></div>');
            }
        }
    } else {
        $(".favorites-body").text('Избранное');
    }
    callback(".favorites-body");
}

/** Показать транспорт для инвалидов */
function getInvalidTransport(data) {

    if ($(data).attr('value') == 'lowFloor'){
        getLowFloor();
    }

    if ($(data).attr('value') == 'voiceNotify'){
        getvoiceNotify();
    }

    if ($(data).attr('value') == 'infoTable'){
        getinfoTable();
    }
}

/** Показать маршруты для инвалидов - колясочников */
function getLowFloor() {
    if (invalidTransport == false){
        invalidTransport = true;
        blindTransport = false;
        deafTransport = false;
        $('#invalid').addClass("invalid-selected");
        $('#blind').removeClass("blind-selected");
        $('#deaf').removeClass("deaf-selected");

        updateTableLowFloor();
        updateMarker();

    } else {
        invalidTransport = false;
        $('#invalid').removeClass("invalid-selected");

        for (var j = 0; j < arrayMarkers.length; j++){
            div = $("div[vol='" + arrayMarkers[j].options.name + "']");
            div.removeClass("cell-invalid");
        }
        updateMarker();
    }
}

/** Показать маршруты для слепых */
function getvoiceNotify() {

    if (blindTransport == false){
        invalidTransport = false;
        blindTransport = true;
        deafTransport = false;
        $('#invalid').removeClass("invalid-selected");
        $('#blind').addClass("blind-selected");
        $('#deaf').removeClass("deaf-selected");

        updateTableVoiceNotify();
        updateMarker();

    } else {
        blindTransport = false;
        $('#blind').removeClass("blind-selected");

        for (var j = 0; j < arrayMarkers.length; j++){
            div = $("div[vol='" + arrayMarkers[j].options.name + "']");
            div.removeClass("cell-invalid");
        }
        updateMarker();
    }
}

/** Показать маршруты для глухих */
function getinfoTable() {
    if (deafTransport == false){
        invalidTransport = false;
        blindTransport = false;
        deafTransport = true;
        $('#invalid').removeClass("invalid-selected");
        $('#blind').removeClass("blind-selected");
        $('#deaf').addClass("deaf-selected");

        updateTableInfoTable();
        updateMarker();

    } else {
        deafTransport = false;
        $('#deaf').removeClass("deaf-selected");

        for (var j = 0; j < arrayMarkers.length; j++){
            div = $("div[vol='" + arrayMarkers[j].options.name + "']");
            div.removeClass("cell-invalid");
        }
        updateMarker();
    }
}

/** Выделение ячеек маршрутов для инвалитов-колясочников */
function updateTableLowFloor() {
    var div;
    $('#table-route-list').each(function(){
        $(this).find('.cell-invalid').removeClass('cell-invalid');
    });
    for (var i = 0; i < arrayMarkers.length; i++){
        if (arrayMarkers[i].options.lowFloor == true){
            div = $("[vol='" + arrayMarkers[i].options.name + "'][vt = '" + arrayMarkers[i].options.vt + "']");
            div.addClass("cell-invalid");
        }
    }
}

/** Выделение ячеек маршрутов для слепых */
function updateTableVoiceNotify() {
    var div;
    $('#table-route-list').each(function(){
        $(this).find('.cell-invalid').removeClass('cell-invalid');
    });
    for (var i = 0; i < arrayMarkers.length; i++){
        if (arrayMarkers[i].options.voiceNotify == true){
            div = $("[vol='" + arrayMarkers[i].options.name + "'][vt = '" + arrayMarkers[i].options.vt + "']");
            div.addClass("cell-invalid");
        }
    }
}

/** Выделение ячеек маршрутов для глухих */
function updateTableInfoTable() {
    var div;
    $('#table-route-list').each(function(){
        $(this).find('.cell-invalid').removeClass('cell-invalid');
    });
    for (var i = 0; i < arrayMarkers.length; i++){
        if (arrayMarkers[i].options.infoTable == true){
            div = $("[vol='" + arrayMarkers[i].options.name + "'][vt = '" + arrayMarkers[i].options.vt + "']");
            div.addClass("cell-invalid");
        }
    }
}

/** Обновление маркеров объектов */
function updateMarker() {
    for (var i = 0; i <  arrayMarkers.length; i++){

        if ((arrayMarkers[i].options.lowFloor === false) && (arrayMarkers[i].options.voiceNotify === false) &&
        (arrayMarkers[i].options.infoTable === false)){
            continue;
        }
        var classIcon = 'obj-icon-' + arrayMarkers[i].options.vt,
            titleIcon = '';
        if ((invalidTransport === true) && (arrayMarkers[i].options.lowFloor === true)){
            classIcon += '-invalid';
            titleIcon = translate('invalid');
        }
        if ((blindTransport === true) && (arrayMarkers[i].options.voiceNotify === true)){
            classIcon += '-invalid';
            titleIcon = translate('blind');
        }
        if ((deafTransport === true) && (arrayMarkers[i].options.infoTable === true)){
            classIcon += '-invalid';
            titleIcon = translate('deaf');
        }
        var updateIcon = L.divIcon({
            iconSize: [32, 32],
            iconAnchor:[15, 15],
            popupAnchor:[0, -7],
            className:"custom-icon-transport",
            html: '<div class="obj-dir" style="' + setDirMarker(arrayMarkers[i].options.course) + '"></div>' +
            '<div class="' + classIcon + '" title="' + titleIcon +'" ><span>' + arrayMarkers[i].options.name + '</span></div>'
        });
        arrayMarkers[i].setIcon(updateIcon);
    }
}

/** Параметры меню */
function paramMenu() {
    var divHalts = $(window).height();
    var divInfo = $('.short-route').height();
    var divBanner = $('.footer-menu').height();
    var divTransporttype = $('.transporttype-block').height();

    if (banners && (divHalts > 550)) {
        $('.routelist-block, .finded-routes-for-places').css('max-height', divHalts - (195 + divBanner + divTransporttype));
        $('.overflow-city-menu').css('max-height', divHalts - (135 + divBanner));
        $('.favorites-body').css('max-height', divHalts - (185 + divBanner));
        $('.route-info-halts').css('max-height', divHalts - (280 + divInfo + divBanner));
    }
    if (divHalts < 551){
        $('.routelist-block, .finded-routes-for-places').css('max-height', divHalts - (195 + divTransporttype));
        $('.overflow-city-menu').css('max-height', divHalts - 135);
        $('.favorites-body').css('max-height', divHalts - 185);
        $('.route-info-halts').css('max-height', divHalts - (280 + divInfo));
    }
    if (!banners) {
        $('.routelist-block, .finded-routes-for-places').css('max-height', divHalts - (195 + divTransporttype));
        $('.overflow-city-menu').css('max-height', divHalts - 135);
        $('.favorites-body').css('max-height', divHalts - 185);
        $('.route-info-halts').css('max-height', divHalts - (280 + divInfo));
    }
}

/** Показать легенду укороченного направления */
function shortRouteUp() {
    var divInfo = $('.short-route').height();
    $('.short-route').css('height', divInfo + 30);
    paramMenu();
}

/** Скрыть легенду укороченного направления */
function shortRouteDown() {
    $('.short-route').css('height', 0);
    paramMenu();
}

/** Поиск маркеров объектов */
function searchRouteMarkers(search) {
    for (var i = 0; i < arrayMarkers.length; i++) {
        if (~arrayMarkers[i].options.name.indexOf(search)) {
            arrayMarkers[i]
                .on('click', function (marker) {

                    var divRoute = $('<div class="div-route">');
                    divRoute.append(refreshRouteTimePopup(marker.sourceTarget));

                    var popupMarker = new L.popup({
                        offset: new L.Point(0, -3),
                        closeOnClick: false,
                        closeButton: false,
                        draggable: true
                    })
                        .setLatLng(marker.sourceTarget.getLatLng())
                        .setContent(divRoute[0]);

                    marker.sourceTarget.bindPopup(popupMarker);
                    map.panTo(marker.sourceTarget.getLatLng());

                    makeDraggablePopup(popupMarker);

                    clearInterval(timer);
                    timer = setTimeout(function () {
                        groupStopsRoute.clearLayers();
                        closePopupMarker();
                    }, 30000);
                })
                .bindPopup()
                .addTo(markersGroupVt);
        } else {
            var latlng = L.latLng(Number(arrayMarkers[i].options.lat), Number(arrayMarkers[i].options.lon));
            arrayMarkers[i].setLatLng(latlng);
            markersGroupVt.removeLayer(arrayMarkers[i]);
        }
    }
}
var map,
    stopsVT = [],                                                                                   // Массив остановок
    stopsRoute = [],                                                                                // Массив остановок выбранного маршрута
    vt,                                                                                             // Вид транспорта
    routeNumb = null,                                                                               // Номер маршрута
    layerControl,                                                                                   // Контроль слоев карты
    interval,                                                                                       // Интервал опроса сервера
    timer,                                                                                          // Время показа следующих пунктов прибытия
    findCorridors = [],                                                                             // Массив найденных вариантов проезда
    arrayMarkers = [],                                                                              // Массив маркеров транспорта
    icons = {header: "ui-icon-triangle-1-e", activeHeader: "ui-icon-triangle-1-s"},                 // Иконки стрелки у элемента accordion
    courseCorridor = L.featureGroup(),                                                              // Геометрии выбранного маршрута
    courseNextCorridor = L.featureGroup(),                                                          // Геометрия маршрута ближайшего прибытия
    inactiveCorridor = new L.LayerGroup(),                                                          // Группировка геометрии обратного направления
    courseCorridorAll = new L.LayerGroup(),                                                         // Геометрия маршрута с учетом пересадок
    groupStopsRoute = new L.LayerGroup(),                                                           // Группировка остановок по выбранному маршруту
    groupNextStops = new L.LayerGroup(),                                                            // Группировка остановок ближайшего прибытия объекта
    selectStops = new L.LayerGroup(),                                                               // Выбранная остановка
    groupStopsVt = new L.LayerGroup(),                                                              // Группировка всех остановок
    markersGroupVt = new L.LayerGroup(),                                                            // Группировка всех маркеров транспорта
    baseMap,                                                                                        // Слой карты по умолчанию
    corridorColor = '#0c6fde',                                                                      // Цвет основной геометрии маршрута
    corridorColorNext = '#de4e33',         s                                                         // Цвет геометрии маршрута ближайшего прибытия
    corridorColorInactive = '#999999',                                                              // Цвет обратного направления геометрии маршрута
    langIcon,
    time;

/** Используемые основные слои карт */
var yndx = L.tileLayer('https://vec0{s}.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&lang=' + lang,
    {id: 'ynd', subdomains: '1234', crs: L.CRS.EPSG3395}),
    google = L.tileLayer('https://mts{s}.google.com/vt/hl=x-local&x={x}&s=&y={y}&z={z}&hl=' + lang,
        {id: 'gog', subdomains: '0123', crs: L.CRS.EPSG3857}),
    osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        crs: L.CRS.EPSG3857}),
    gis = L.tileLayer('https://tile{s}.maps.2gis.com/tiles?v=1&x={x}&y={y}&z={z}',
        { subdomains: '0123', crs: L.CRS.EPSG3857 });

/** Дополнительный слой для отображения пробок */
var ytraffic = L.tileLayer('http://jgo.maps.yandex.net/1.1/tiles?l=trf,trfe,trfl&lang=' + lang + '&x={x}&y={y}&z={z}&tm={tm}',
    { opacity: 0.6, crs: L.CRS.EPSG3395, tm: function() { return Math.round(new Date().getTime()/1000);}});

var baseLayers = {
    'Yandex' : yndx,
    'Google': google,
    'OSM': osm,
    '2GIS': gis
};

/** Получение куки */
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

$(document).ready(function() {

    baseMap = getCookie('basemap');

    if (baseMap) {
        var baseMapName = getCookie('basemap');
    } else {
        baseMap = yndx;
    }

    if (typeof(baseMapName) != 'undefined'){
        switch (baseMapName){
            case "Yandex":
                baseMap = yndx;
                break;
            case "Google":
                baseMap = google;
                break;
            case "OSM":
                baseMap = osm;
                break;
            case "2GIS":
                baseMap = gis;
                break;
        }
    }

        initCity();
        initMap();

        $('.service-button').block({
            message: '',
            overlayCSS: {
                backgroundColor: '#ffffff',
                opacity: 0.1,
                cursor: 'wait'
            }
        });
});

/** Инициализация карты */
function initMap() {

    var crs = L.CRS.EPSG3395,
        minZoom = ($(window).height() < 600) ? 8 : 3;

    map = L.map('map', {
        maxZoom: 18,
        minZoom: minZoom,
        center: new L.LatLng(latCity, lonCity),
        zoom: 14,
        zoomControl: false,
        zoomsliderControl: true,
        layers: baseMap,
        crs: crs,
        markerZoomAnimation: true
    })
        .on('baselayerchange', baseLayerChange);

    langIcon = (lang == 'ru') ? 'language-ru' : 'language-en';

    // кнопка смены языка
    L.easyButton({
        position: 'topright',
        states: [{
            icon: langIcon,
            title: translate('change language'),
            onClick: function () {
                changeLanguage();
            }
        }]
    }).addTo(map);

    // Кнопка переключения слоев карты
    layerControl = L.control.activeLayers(baseLayers).addTo(map);

    baseLayerChange(layerControl.getActiveBaseLayer());

    // События при перетаскивании карты
    map.on('drag', function (e) {
        if ($(".search-for-travel-block").is(":hidden")) {
            getMarkersTransport();
        }
    });
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
        getMarkersTransport();
        startMoveZoom();

        if ($(".transport-button").hasClass("selectedButton")) {
            getMarkersTransport();
        }
        if (map.getZoom() > 14){
            showStopsUpZoom();
        }
        if (map.getZoom() < 15) {
            groupStopsVt.clearLayers();
        }
    });

    // кнопка определение местоположения
    L.easyButton({
        position: 'topright',
        states: [{
            icon: 'btn-place',
            title: translate('location'),
            onClick: function () {
                findLocation();
            }
        }]
    }).addTo(map);

    //Кнопка показать пробки
    L.easyButton({
        position: 'topright',
        states: [{
            icon: 'btn-traffic',
            title: translate('traffic jams'),
            onClick: function () {
                trafficJams();
            }
        }]
    }).addTo(map);

    // Кнопка социально-значимые объекты
    if (socialsigns  && ($(window).height() > 500)) {

        L.easyButton({
            position: 'topright',
            states: [{
                onClick: toggleSocialSigns,
                title: translate('social signs'),
                icon: 'soc-sign-button'
            }]
        }).addTo(map);
    }

    // кнопка для отображения дорожных знаков
    if (roadsigns  && ($(window).height() > 530)) {
        L.easyButton({
            position: 'topright',
            states: [{
                title: translate('road signs'),
                icon: 'road-sign-button',
                onClick: function () {
                    toggleRoadSigns();
                }
            }]
        }).addTo(map);
    }

    //Кнопка отправить отзыв
    if (review){
        L.easyButton({
            position: 'topright',
            states: [{
                icon: 'btn-review',
                title: translate('review'),
                onClick: function () {
                    $('#modalReview').css('display', 'block');
                }
            }]
        }).addTo(map);
    }

    //Кнопка о программе
    if (about){
        L.easyButton({
            position: 'topright',
            states: [{
                icon: 'btn-about',
                title: translate('about'),
                onClick: function () {
                    $('#modalAbout').css('display', 'block');
                }
            }]
        }).addTo(map);
    }
}

/** Функция для перевода */
function translate(data) {
    var result = JSON.parse(content);
    if (result[data]){
        return result[data];
    }
}

/** Центрирование карты при смене слоя */
function baseLayerChange(layer) {

    $.cookie('basemap', layer.name, { expires: 90 });
    //Удаление информации о пробках, если выбрана не карта яндекс
    if (layer.name !== 'Yandex') {
        $(".btn-traffic").removeClass("btn-traffic-active");
        map.removeLayer(ytraffic);
    }

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

/** Добавление маркеров транспорта на карту */
function addMarker() {
    clearInterval(interval);
    arrayMarkers.length = 0;
    if (vt === ''){
        $('#checkboxBtnsDiv, .service-button, .table-travel-list, .route-travel-header, .routelist-block').unblock();
        return;
    }
    $('.service-button, #checkboxBtnsDiv, .route-travel-header, .routelist-block').block({
        message: '',
        overlayCSS: {
            backgroundColor: '#ffffff',
            opacity: 0.1,
            cursor: 'wait'
        }
    });

    if(!map.hasLayer(markersGroupVt)){
        map.addLayer(markersGroupVt);
    }

    var options = {};
    options.vt = vt;
    options.srv = srv;
    if (routeNumb != null){
        options.route = routeNumb;
    }

    var headers = {};
    if (time) {
        headers['last-state-time'] = time;
    }
    
    inforoutestatesRequest(options, headers, function (objects) {
        var snackbar = $('.snackbar');
        if ((objects == 'Connect error') || (objects == 'ERROR')){
            if(!snackbar.hasClass('active')){
                $.snackbar(translate('failed to load data'));
            }
            $('#checkboxBtnsDiv, .service-button, .table-travel-list, .route-travel-header, .routelist-block').unblock();
            interval = setInterval(function () {
                moveMarker(arrayMarkers, routeNumb)
            }, 6000);
            return;
        }
        snackbar.removeClass('active');

        if (objects.length > 0){
            time = objects[0].time;
            for (var i = 0; i < objects.length; i++) {
                if ((objects[i].lat == 'NaN') || (objects[i].lon == 'NaN')) {
                    continue;
                }
                var options = {};
                options.id = objects[i].id;
                options.model = objects[i].model;
                options.stateNum = objects[i].stateNum;
                options.garageNum = objects[i].garageNum;
                options.lowFloor = objects[i].lowFloor;
                options.course = Math.round(objects[i].course);
                options.vt = objects[i].vt;
                options.letter = objects[i].letter;
                options.lat = objects[i].lat;
                options.lon = objects[i].lon;
                options.lowFloor = objects[i].lowFloor;
                options.voiceNotify = objects[i].voiceNotify;
                options.infoTable = objects[i].infoTable;
                options.prevWays = objects[i].prevWays;

                var dispName = objects[i].route;

                if (typeof(dispName) != 'undefined'){
                    while (dispName.indexOf("0") === 0)
                        dispName = dispName.substr(1);
                }

                options.name = dispName;

                arrayMarkers[i] = markerTransport(options);
                arrayMarkers[i].options.latEnd = arrayMarkers[i].options.lat;
                arrayMarkers[i].options.lonEnd = arrayMarkers[i].options.lon;
            }
        }

        if (invalidTransport === true){
            updateTableLowFloor();
        }

        if (blindTransport === true){
            updateTableVoiceNotify();
        }

        if (deafTransport === true){
            updateTableInfoTable();
        }

        $('#checkboxBtnsDiv, .service-button, .table-travel-list, .route-travel-header, .routelist-block').unblock();

        interval = setInterval(function () {
            moveMarker(arrayMarkers, routeNumb)
        }, 6000);
    });
}

/** Маркер для транспорта */
function markerTransport(options) {

    var classIcon = 'obj-icon-' + options.vt,
        titleIcon = '';

    if ((invalidTransport === true) && (options.lowFloor === true)){
        classIcon += '-invalid';
        titleIcon = translate('invalid');
    }
    if ((blindTransport === true) && (options.voiceNotify === true)){
        classIcon += '-invalid';
        titleIcon = translate('blind');
    }
    if ((deafTransport === true) && (options.infoTable === true)){
        classIcon += '-invalid';
        titleIcon = translate('deaf');
    }

    var markerIcon = L.divIcon({
        iconSize: [32, 32],
        iconAnchor: [15, 15],
        popupAnchor: [0, -7],
        className: "custom-icon-transport",
        html: '<div class="obj-dir" style="' + setDirMarker(Math.round(options.course)) + '"></div>' +
        '<div class="' + classIcon + '" title="' + titleIcon + '" ><span>' + options.name + '</span></div>'
    });

    var customMarker = L.Marker.extend({
        options: {
            id: '',
            course: '',
            icon: '',
            vt: '',
            name: '',
            lowFloor: '',
            voiceNotify: '',
            infoTable: '',
            model: '',
            stateNum: '',
            garageNum: '',
            lat: '',
            lon: '',
            latNext: '',
            lonNext: '',
            latEnd: '',
            lonEnd: '',
            prevWays: '',
            counter: '',
            duration: '',
            speed: '',
            prevWaysCurrent: ''
        }
    });

    var marker = new customMarker([options.lat, options.lon], {
        title: '',
        icon: markerIcon,
        riseOnHover: true,
        zIndexOffset: 10,
        id: options.id,
        course: options.course,
        vt: options.vt,
        name: options.name,
        lowFloor: options.lowFloor,
        voiceNotify: options.voiceNotify,
        infoTable: options.infoTable,
        model: options.model,
        stateNum: options.stateNum,
        garageNum: options.garageNum,
        lat: options.lat,
        lon: options.lon,
        latNext: null,
        lonNext: null,
        prevWays: options.prevWays,
        counter: null,
        duration: 22000
    });

    getViewMarkersTransport(marker);

    return marker;
}

/** Отображение маркеров транспорта только в видимой области экрана */
function getViewMarkersTransport(marker) {
    marker
        .on('click', function (marker) {

            var divRoute = $('<div class="div-route">');
            divRoute.append(refreshRouteTimePopup(marker.sourceTarget));

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
                groupNextStops.clearLayers();
                closePopupMarker();
            }, 30000);
        });

    var search = $("#searchRoute").val();
    if ((marker.getLatLng().lat > map.getBounds()._southWest.lat) && (marker.getLatLng().lat < map.getBounds()._northEast.lat) &&
        (marker.getLatLng().lng > map.getBounds()._southWest.lng) && (marker.getLatLng().lng < map.getBounds()._northEast.lng) &&
        (~marker.options.name.indexOf(search))) {
        marker.addTo(markersGroupVt);
    }
}

/** Отображение новых маркеров транспорта в видимой области экрана и удаление ушеших за экран при перетаскивании карты и при смене зума */
function getMarkersTransport() {
    if(arrayMarkers.length == 0){
        return;
    }
    var search = $("#searchRoute").val();
    for (var i = 0; i < arrayMarkers.length; i++){
        if ((arrayMarkers[i].options.lat > map.getBounds()._southWest.lat) && (arrayMarkers[i].options.lat < map.getBounds()._northEast.lat) &&
            (~arrayMarkers[i].options.name.indexOf(search)) && (!markersGroupVt.hasLayer(arrayMarkers[i]))) {
            clearPrevWays(arrayMarkers[i]);
            arrayMarkers[i].addTo(markersGroupVt);
            updateIconTransport(arrayMarkers[i]);
        }
        if ((arrayMarkers[i].options.lat < map.getBounds()._southWest.lat) || (arrayMarkers[i].options.lat > map.getBounds()._northEast.lat) ||
            (arrayMarkers[i].options.lon < map.getBounds()._southWest.lng) || (arrayMarkers[i].options.lon > map.getBounds()._northEast.lng)) {
            var latlng = L.latLng(Number(arrayMarkers[i].options.lat), Number(arrayMarkers[i].options.lon));
            arrayMarkers[i].setLatLng(latlng);
            if (markersGroupVt.hasLayer(arrayMarkers[i])){
                clearPrevWays(arrayMarkers[i]);
                markersGroupVt.removeLayer(arrayMarkers[i]);
            }
        }
    }
}

/** Устанавливает указатель на маркере указывающий направление движения транспорта */
function setDirMarker(dir) {
    return '-webkit-transform: rotate(' + dir + 'deg);' +
        '-moz-transform: rotate(' + dir + 'deg);' +
        '-ms-transform: rotate(' + dir + 'deg);' +
        '-o-transform: rotate(' + dir + 'deg);' +
        'transform: rotate(' + dir + 'deg);';
}

/** Перемещение маркеров транспорта по карте */
var startMoveMarker = true;
function moveMarker(arrayMarkers, routeNumb) {
    if (!startMoveMarker){
        return;
    }
    startMoveMarker = false;

    var options = {};
    options.vt = vt;
    options.srv = srv;

    if (routeNumb != null){
        options.route = routeNumb;
    }

    var headers = {};
    if (time) {
        headers['last-state-time'] = time;
    }

    inforoutestatesRequest(options, headers, function (objects){
        startMoveMarker = true;
        var snackbar = $('.snackbar');
        if ((objects == 'Connect error') || (objects == 'ERROR')){
            markersGroupVt.clearLayers();
            arrayMarkers.length = 0;

            if(!snackbar.hasClass('active')){
                $.snackbar(translate('failed to load data'));
            }
            return;
        }
        snackbar.removeClass('active');
        if (typeof objects[0].time != 'undefined') time = objects[0].time;

        var result;
        for (var j = 0; j <  objects.length; j++){
            if ((objects[j].lat == 'NaN') || (objects[j].lon == 'NaN')) {
                continue;
            }

            result = $.grep(arrayMarkers, function(e){ return e.options.id === objects[j].id; });

            if (typeof(result[0]) == 'undefined'){
                var options = {};
                options.id = objects[j].id;
                options.model = objects[j].model;
                options.stateNum = objects[j].stateNum;
                options.garageNum = objects[j].garageNum;
                options.lowFloor = objects[j].lowFloor;
                options.course = Math.round(objects[j].course);
                options.vt = objects[j].vt;
                options.letter = objects[j].letter;
                options.lat = objects[j].lat;
                options.lon = objects[j].lon;
                options.lowFloor = objects[j].lowFloor;
                options.voiceNotify = objects[j].voiceNotify;
                options.infoTable = objects[j].infoTable;
                options.prevWays = objects[j].prevWays;

                var dispName = objects[j].route;

                if (typeof(dispName) != 'undefined'){
                    while (dispName.indexOf("0") === 0)
                        dispName = dispName.substr(1);
                }

                options.name = dispName;
                arrayMarkers.push(markerTransport(options));
            }

            if (typeof(result[0]) != 'undefined'){
                result[0].options.course = Math.round(objects[j].course);
                result[0].options.lat = Number(objects[j].lat);
                result[0].options.lon = Number(objects[j].lon);
                result[0].options.prevWays = objects[j].prevWays;

                var search = $("#searchRoute").val();
                if ((!markersGroupVt.hasLayer(result[0])) && (result[0].options.lat > map.getBounds()._southWest.lat) &&
                    (result[0].options.lat < map.getBounds()._northEast.lat) && (result[0].options.lon > map.getBounds()._southWest.lng) &&
                    (result[0].options.lon < map.getBounds()._northEast.lng) && (~result[0].options.name.indexOf(search))) {
                    clearPrevWays(result[0]);
                    result[0].addTo(markersGroupVt);
                }

                if (((result[0].options.lat + 0.002) < map.getBounds()._southWest.lat) || ((result[0].options.lat - 0.002) > map.getBounds()._northEast.lat) ||
                    ((result[0].options.lon + 0.002) < map.getBounds()._southWest.lng) || ((result[0].options.lon - 0.002) > map.getBounds()._northEast.lng)) {
                    clearPrevWays(result[0]);
                    markersGroupVt.removeLayer(result[0]);
                }

                if (markersGroupVt.hasLayer(result[0])){
                    checkCorridorTraffic(result[0]);
                }
            }
        }

        for (var i = 0; i <  arrayMarkers.length; i++){
            result = $.grep(objects, function(e){ return e.id === arrayMarkers[i].options.id; });

            if (typeof(result[0]) == 'undefined'){
                markersGroupVt.removeLayer(arrayMarkers[i]);
                arrayMarkers.splice(i, 1);
            }
        }
    });
}

/** Очистка точек для предотвращения движения назад */
function clearPrevWays(marker) {
    marker.options.prevWaysCurrent = null;
    marker.options.latNext = null;
    marker.options.lonNext = null;
}

/** Обновление иконки транспорта */
function updateIconTransport(marker) {
    var classIcon = 'obj-icon-' + marker.options.vt, titleIcon = '';

    if ((invalidTransport === true) && (marker.options.lowFloor === true)){
        classIcon += '-invalid';
        titleIcon = translate('invalid');
    }
    if ((blindTransport === true) && (marker.options.voiceNotify === true)){
        classIcon += '-invalid';
        titleIcon = translate('blind');
    }
    if ((deafTransport === true) && (marker.options.infoTable === true)){
        classIcon += '-invalid';
        titleIcon = translate('deaf');
    }

    var icon = L.divIcon({
        iconSize: [32, 32],
        iconAnchor:[15, 15],
        popupAnchor:[0, -7],
        className:"custom-icon-transport",
        html: '<div class="obj-dir" style="' + setDirMarker(marker.options.course) + '"></div>' +
        '<div class="' + classIcon + '" title="' + titleIcon + '" ><span>' + marker.options.name + '</span></div>'
    });
    marker.setIcon(icon);
}

/** Обновление иконки транспорта */
function updateCommingIconTransport(marker) {
    var classIcon = 'obj-icon-' + marker.options.vt,
        titleIcon = '';
    if ((invalidTransport === true) && (marker.options.lowFloor === true)){
        classIcon += '-invalid';
        titleIcon = translate('invalid');
    }
    if ((blindTransport === true) && (marker.options.voiceNotify === true)){
        classIcon += '-invalid';
        titleIcon = translate('blind');
    }
    if ((deafTransport === true) && (marker.options.infoTable === true)){
        classIcon += '-invalid';
        titleIcon = translate('deaf');
    }

    var icon = L.divIcon({
        iconSize: [32, 32],
        iconAnchor:[15, 15],
        popupAnchor:[0, -7],
        className:"custom-icon-transport",
        html: '<div class="obj-dir" style="' + setDirMarker(marker.options.prevWaysCurrent[marker.options.counter].course) + '"></div>' +
        '<div class="' + classIcon + '" title="' + titleIcon + '" ><span>' + marker.options.name + '</span></div>'
    });
    marker.setIcon(icon);
}

/** Обновление иконки выбранного транспорта */
// function updateIconSelectTransport(marker) {
//     var classIconSelect = 'obj-icon-select-' + marker.options.vt;
//     var updateIconSelect = L.divIcon({
//         iconSize: [32, 32],
//         iconAnchor:[15, 15],
//         popupAnchor:[0, -7],
//         className:"icon-transport-select",
//         html: '<div class="obj-dir" style="' + setDirMarker(marker.options.course) + '"></div>' +
//         '<div class="' + classIconSelect + '" title="" ><span>' + marker.options.name + '</span></div>'
//     });
//     marker.setIcon(updateIconSelect);
// }

/** Сброс иконки выбранного транспорта */
// function resetIconSelectTransport() {
//     for (var i = 0; i < arrayMarkers.length; i++){
//         if ($(arrayMarkers[i]._icon).hasClass('icon-transport-select')){
//             updateIconTransport(arrayMarkers[i]);
//         }
//     }
// }

/** Определение варианта движения маркеров */
function checkCorridorTraffic(marker) {
    if (corridorTraffic){
        getMoveMarkerToCorridor(marker);
    } else {
        getMoveMarker(marker);
    }
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

/** Движение маркеров по коридорам маршрутов */
function getMoveMarkerToCorridor(marker) {

    if ((marker.options.latEnd == marker.options.lat) && (marker.options.lonEnd == marker.options.lon)){
        return;
    }

    var latlngStart = L.latLng(marker.getLatLng()),
        latlngEnd = L.latLng(Number(marker.options.lat), Number(marker.options.lon));

    marker.options.latEnd = marker.options.lat;
    marker.options.lonEnd = marker.options.lon;

    if (map.distance(latlngStart, latlngEnd) < 6){
        return;
    }

    if (((map.distance(latlngStart, latlngEnd) > 400) && (marker.options.prevWays == null)) || (map.distance(latlngStart, latlngEnd) > 600)){
        updateIconTransport(marker);
        marker.options.prevWays = null;
        clearPrevWays(marker);
        marker.setLatLng(latlngEnd);
        return;
    }

    if (marker.options.prevWays == null){
        updateIconTransport(marker);
        clearPrevWays(marker);
        marker.slideTo([marker.options.lat, marker.options.lon], {
            duration: 22000
        });
        return;
    }

    var latlngNext, distanceToNext, distanceToEnd, prevCounter,
        latlngPrevPoint, latlngNextPoint, i, k, prevWays = [];

    for (i = 0; i < marker.options.prevWays.length; i++){
        for (k = 0; k < marker.options.prevWays[i].length; k++){
            prevWays.push(marker.options.prevWays[i][k]);
        }
    }

    marker.options.prevWaysCurrent = prevWays;
    marker.options.counter = 0;
    prevCounter = 0;

    latlngNext = L.latLng(Number(marker.options.prevWaysCurrent[marker.options.counter].lat), Number(marker.options.prevWaysCurrent[marker.options.counter].lon));
    distanceToNext = map.distance(latlngStart, latlngNext);
    distanceToEnd = map.distance(latlngStart, latlngNext);

    if (distanceToNext == 0){
        distanceToNext = 1;
    }

    for (i = 1; i < marker.options.prevWaysCurrent.length; i++){
        latlngPrevPoint = L.latLng(Number(marker.options.prevWaysCurrent[prevCounter].lat), Number(marker.options.prevWaysCurrent[prevCounter].lon));
        latlngNextPoint = L.latLng(Number(marker.options.prevWaysCurrent[i].lat), Number(marker.options.prevWaysCurrent[i].lon));
        distanceToEnd += map.distance(latlngPrevPoint, latlngNextPoint);
        prevCounter++
    }

    marker.options.speed = distanceToEnd / 22;
    marker.options.duration = distanceToNext * 1000 / marker.options.speed;
    moveMarkerPoint(marker);
}

/** Движение маркера по точкам коридора */
function moveMarkerPoint(marker) {

    if ((marker.options.prevWaysCurrent == null) || (marker.options.prevWaysCurrent[marker.options.counter] == undefined) ||
        (!markersGroupVt.hasLayer(marker))){
        return;
    }

    var latlngCurrent = L.latLng(Number(marker.options.prevWaysCurrent[marker.options.counter].lat), Number(marker.options.prevWaysCurrent[marker.options.counter].lon));

    updateCommingIconTransport(marker);
    marker.slideTo([Number(marker.options.prevWaysCurrent[marker.options.counter].lat), Number(marker.options.prevWaysCurrent[marker.options.counter].lon)], {
        duration: marker.options.duration
    });

    marker.options.latNext = Number(marker.options.prevWaysCurrent[marker.options.counter].lat);
    marker.options.lonNext = Number(marker.options.prevWaysCurrent[marker.options.counter].lon);
    marker.options.counter ++;

    if (marker.options.prevWaysCurrent[marker.options.counter] == undefined){
        return;
    }

    var latlngNext = L.latLng(Number(marker.options.prevWaysCurrent[marker.options.counter].lat), Number(marker.options.prevWaysCurrent[marker.options.counter].lon)),
        distanceToNext = map.distance(latlngCurrent, latlngNext);

    if (distanceToNext == 0){
        distanceToNext = checkDistance(marker, latlngCurrent);
        if (distanceToNext == false){
            return;
        }
    }

    setTimeout(function () {
        moveMarkerPoint(marker);
    }, marker.options.duration);

    marker.options.duration = distanceToNext * 1000 / marker.options.speed;
}

/** Проверка расстояния до следующей точки на 0 */
function checkDistance(marker, latlngCurrent) {
    marker.options.counter ++;
    if (marker.options.prevWaysCurrent[marker.options.counter] == undefined){
        return false;
    }
    latlngNext = L.latLng(Number(marker.options.prevWaysCurrent[marker.options.counter].lat), Number(marker.options.prevWaysCurrent[marker.options.counter].lon));
    distanceToNext = map.distance(latlngCurrent, latlngNext);
    if (distanceToNext == 0){
        distanceToNext = checkDistance(marker, latlngCurrent);
    }
    return distanceToNext;
}

/** Остановка анимации при начале смены зума */
function endMoveZoom() {
    for (var i = 0; i < arrayMarkers.length; i++){
        arrayMarkers[i].slideCancel();
    }
}

/** Запуск анимации маркеров при окончании смены зума */
function startMoveZoom() {
    var latlngStart, latlngNext, distanceToNext;

    if (!corridorTraffic){
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
    } else {
        for (var i = 0; i < arrayMarkers.length; i++){

            if ((arrayMarkers[i].options.latNext != null) && (arrayMarkers[i].options.lonNext != null)){
                latlngStart = L.latLng(arrayMarkers[i].getLatLng());
                latlngNext = L.latLng(Number(arrayMarkers[i].options.latNext), Number(arrayMarkers[i].options.lonNext));
                distanceToNext = map.distance(latlngStart, latlngNext);

                if (distanceToNext == 0){
                    continue;
                }
                arrayMarkers[i].slideTo([Number(arrayMarkers[i].options.latNext), Number(arrayMarkers[i].options.lonNext)], {
                    duration: distanceToNext * 1000 / arrayMarkers[i].options.speed
                });
            } else {
                latlngStart = L.latLng(arrayMarkers[i].getLatLng());
                latlngNext = L.latLng(Number(arrayMarkers[i].options.lat), Number(arrayMarkers[i].options.lon));
                distanceToNext = map.distance(latlngStart, latlngNext);

                if (distanceToNext == 0){
                    continue;
                }

                arrayMarkers[i].slideTo([Number(arrayMarkers[i].options.lat), Number(arrayMarkers[i].options.lon)], {
                    duration: distanceToNext * 1000 / 15
                });
            }
        }
    }
}

/** Отрисовывает выбранный маршрут на карте */
function addRouteOnMap(directions) {

    if (map.hasLayer(courseCorridor)) {
        courseCorridor.clearLayers();
    }

    if (directions.length > 1){
        addInactiveCorridor(directions);
    }
    if(!directions[0].corridors.length){
        return;
    }
    for (var i = 0; i < directions[0].corridors.length; i++) {
        var arrStops = [];
        for (var j = 0; j < directions[0].corridors[i].length; j++) {
            var point = directions[0].corridors[i][j];
            arrStops.push(new L.LatLng(point[0], point[1]));
        }
        var line = L.polyline(arrStops, {color: corridorColor, weight: 5, opacity: 1});
        courseCorridor.addLayer(line);
    }

    if (!map.hasLayer(courseCorridor)) {
        map.addLayer(courseCorridor);
    }

    if (courseCorridor.getLayers().length > 0)
        map.fitBounds(courseCorridor.getBounds());

    if (directions[0].stops) {
        addStopsOnMap(directions[0].stops);
    }
}

/** Отрисовывает неактивное (обратное направление) маршрута на карте */
function addInactiveCorridor(direction) {
    if (map.hasLayer(inactiveCorridor)) {
        inactiveCorridor.clearLayers();
    }
    for(var k = 1; k < direction.length; k++){
        for (var i = 0; i < direction[k].corridors.length; i++){
            var arrPoints = [];
            for (var j = 0; j < direction[k].corridors[i].length; j++){
                var point = direction[k].corridors[i][j];
                arrPoints.push(new L.LatLng(point[0], point[1]));
            }
            var line = L.polyline(arrPoints, {color: corridorColorInactive, weight: 5, opacity: 1});
            inactiveCorridor.addLayer(line);
        }
    }
    if (!map.hasLayer(inactiveCorridor)) {
        map.addLayer(inactiveCorridor);
    }
}

/** Отображает остановки на карте по выбранному маршруту */
function addStopsOnMap(stops) {

    stopsRoute.length = 0;

    for (var i = 0; i < stops.length; i++) {
        var zone = stops[i].zones,
            stopId = zone[0].id,
            wait = stops[i].wait,
            lat, lon;

        if(typeof(wait) == 'undefined'){
            lat = zone[0].location[0];
            lon = zone[0].location[1];
            if (lat && lon) {
                var marker = markerHaltRoute(lat, lon, zone[0].name, stopId);
                marker.addTo(groupStopsRoute);
                marker
                    .on('click', function (marker) {

                        var divStop = (getNearArrival(marker.sourceTarget));

                        var popupMarker = new L.popup({
                            offset: new L.Point(-8, -5),
                            closeButton: false
                        })
                            .setLatLng(marker.sourceTarget.getLatLng())
                            .setContent(divStop[0]);

                        map.openPopup(popupMarker);
                        map.panTo(marker.sourceTarget.getLatLng());
                    });

                stopsRoute[stopId] = marker;
            }
        }
    }
    if (!map.hasLayer(groupStopsRoute)) {
        map.addLayer(groupStopsRoute);
    }
}

/** Отображает остановки ближайшего прибытия транпорта */
function addStopsNextCommings(stops) {

    var arrNextHalts = [],
        prevWait = 0;

    for (var i = 0; i < stops.length; i++) {
        var zone = stops[i].zones,
            stopId = zone[0].id,
            wait = stops[i].wait,
            lat, lon;

        lat = zone[0].location[0];
        lon = zone[0].location[1];

        if (prevWait == wait){
            continue;
        }

        for (var j = 0; j < arrNextHalts.length; j ++){
            if (lat == arrNextHalts[j][0] && lon == arrNextHalts[j][1]){
                lon += 0.0005;
            }
        }

        if (lat && lon) {
            arrNextHalts.push(zone[0].location);
            var nextHalt = markerNextStop(lat, lon, zone[0].name, stopId, wait);
            nextHalt.addTo(groupNextStops);
            nextHalt
                .on('click', function (marker) {

                    var divStop = (getNearArrival(marker.sourceTarget));

                    var popupMarker = new L.popup({
                        offset: new L.Point(0, -5),
                        closeButton: false
                    })
                        .setLatLng(marker.sourceTarget.getLatLng())
                        .setContent(divStop[0]);

                    map.openPopup(popupMarker);
                    map.panTo(marker.sourceTarget.getLatLng());
                });
        }
        prevWait = wait;
    }

    if (!map.hasLayer(groupNextStops)) {
        map.addLayer(groupNextStops);
    }
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

                var divStop = (getNearArrival(marker.sourceTarget));

                var popupMarker = new L.popup({
                    offset: new L.Point(-3, -5),
                    closeButton: false
                })
                    .setLatLng(marker.sourceTarget.getLatLng())
                    .setContent(divStop[0]);

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

/** Маркер для остановки по маршруту */
function markerHaltRoute(lat, lon, name, id) {

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

    var marker = new customMarker([lat, lon], {
        title: name,
        icon: haltIcon,
        riseOnHover: true,
        zIndexOffset: 1,
        id: id
    });
    marker.setZIndexOffset(10);
    return marker;
}

/** Маркер для остановки */
function markerHalt(lat, lon, name, id) {

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

    var marker = new customMarker([lat, lon], {
        title: name,
        icon: haltIcon,
        riseOnHover: true,
        zIndexOffset: 1,
        id: id
    });
    return marker;
}

/** Маркер для ближайщих остановок */
function markerNextStop(lat, lon, name, id, wait) {

    var time;
    var commingTime = wait.substr(0, 5);
    if (typeof(commingTime) != 'undefined'){
        while (commingTime.indexOf("0") === 0)
            commingTime = commingTime.substr(1);
        time = 'min';
    }
    if (commingTime.substr(0, 1) == ':'){
        commingTime = commingTime.substr(1);
        time = 'min';
    }

    while (commingTime.indexOf("0") === 0)
        commingTime = commingTime.substr(1);

    if (!commingTime){
        commingTime = wait.substr(6, 2);
        time = 'sec';
    }

    var customMarker = L.Marker.extend({
        options: {
            id: ''
        }
    });

    var iconNextHalt = L.divIcon({
        iconSize: [34, 34],
        iconAnchor: [15, 15],
        popupAnchor: [0, -7],
        className: "custom-icon-bighalt",
        html: '<div class="icon-nexthalt" ><span>' + commingTime + '</br>' + translate(time) + '</span></div>'
    });

    var marker = new customMarker([lat, lon], {
        title: name,
        icon: iconNextHalt,
        riseOnHover: true,
        zIndexOffset: 100,
        id: id
    });
    return marker;
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
        className: "custom-icon-bighalt",
        html: '<div class="icon-bighalt"></div>'
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

/** Запрос всех остановок */
var startStops = true;
function getStops() {

    if (!startStops){
        return;
    }

    startStops = false;
    stopsVT.length = 0;

    inforoutezonesRequest(function (answer) {
        startStops = true;
        if (answer == 'Connect error'){
            return;
        }

        for (var i = 0; i < answer.length; i++) {
            var stopId = answer[i].id;

            if (answer[i].location) {
                var lat = answer[i].location[0],
                    lon = answer[i].location[1];
                if (lat && lon) {
                    stopsVT[i] = markerHalt(lat, lon, answer[i].name, stopId);
                }
            }
        }
        if (map.getZoom() > 14){
            showStopsUpZoom();
        }
    });
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

            var divStop = (getNearArrival(marker.sourceTarget));

            var popupMarker = new L.popup({
                offset: new L.Point(-8, -5),
                closeButton: false
            })
                .setLatLng(marker.sourceTarget.getLatLng())
                .setContent(divStop[0]);

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

/** Строит таблицу ближайщего прибытия транспорта к остановке */
var startgetNearArrival = true;
function getNearArrival(stopObject){
    if (!stopObject){
        return;
    }

    var sheduleHalt = $('<div class="halts-popup">');
    $('<div class="custom-popup-close-button" onclick ="closePopup()">x</div>').appendTo(sheduleHalt);
    var headTable = $('<table class="head-shedule-table">').appendTo(sheduleHalt);

    headTable.append(
        '<tr><td rowspan="2" style="width: 50px"><div class="halt-icon"></div></td>' +
        '<td class="halt">' + translate('stop') + ':' + '</td></tr>' +
        '<tr><td class="halt-name">' + decodeURIComponent(stopObject.options.title) + '</td></tr>'
    );
    if (!startgetNearArrival){
        return sheduleHalt;
    }
    startgetNearArrival = false;
    var divLoading  = $("<div class='transition-loader'><div class='transition-loader-inner'>" +
        "<label></label><label></label><label></label><label></label><label></label><label></label>" +
        "</div></div>").appendTo(sheduleHalt);

    var options = {
        zoneId: stopObject.options.id,
        srv: srv,
        lang: lang
    };

    infonextcomingsRequest(options, function (result) {

        startgetNearArrival = true;
        divLoading.remove();
        if (result == 'Connect error'){
            $("<div class='div-loading-error'>" + translate('failed to load data') + "</div>").appendTo(sheduleHalt);
            return;
        }

        if (!result.length) {
            return;
        }

        var divBody = $('<div class="halts-popup-body">').appendTo(sheduleHalt);

        var tableStop = $('<table ' +
            'id="timetable" ' +
            'class="route-direction-table" ' +
            'style="">'
        )
            .on('click', 'div', function (){
                $(".short-route").empty();
                $('#start-directions, #end-directions').val('');
                $('.route-name').text('');
                $('#route-number-select').removeClass();
                $('.favorites-star').removeClass('favorites-star-fav');
                $('.transporttype-block, .routelist-block, #city-menu, .search-for-travel-block, .route-info-halts, .short-route').hide();
                $('.route-info').show();
                $(".transport-button, .search-for-travel-button").removeClass("selectedButton");
                $(".div-loading-error").remove();
                if ($("#div-route-halts").hasClass("ui-accordion")){
                    $("#div-route-halts").accordion('destroy');
                    $("#div-route-halts").empty();
                }
                routeNumb = $(this).attr('data-name');
                vt = $(this).attr('vt');
                var options = {
                    route: routeNumb,
                    vt: vt,
                    date: moment($('#datepicker').val(), 'DD.MM.YYYY').format('YYYY-MM-DD'),
                    srv: srv,
                    lang: lang
                };

                var divLoading  = $("<div class='transition-loader'><div class='transition-loader-inner'>" +
                    "<label></label><label></label><label></label><label></label><label></label><label></label>" +
                    "</div></div>").appendTo($('.route-info'));

                directions.length = 0;
                arrayMarkers.length = 0;
                inforoutedetailsRequest(options, function (routeObject) {
                    clearMap();
                    divLoading.remove();
                    if (routeObject == 'Connect error'){
                        $("<div class='div-loading-error'>" + translate('failed to load data') + "</div>").appendTo($('.route-info'));
                        return;
                    }
                    addMarker();
                    getDirectionsRoute(routeObject);
                });
            });

        tableStop.append(
            '<tr>' +
            '<td class="timetable-head" style="min-width: 65px">' + translate('route') + '</td>' +
            '<td class="timetable-head" style="min-width: 26%">' + translate('nearest') + '</td>' +
            '<td class="timetable-head" style="min-width: 52%">' + translate('direction') + '</td>' +
            '<tr>'
        );

        var vtCurrent, nameCurrent, timeCurrent, time;

        for (var i = 0; i < result.length; i++) {
            var commingNext = result[i];
            var commingTime = commingNext.wait.substr(0, 5);
            if (typeof(commingTime) != 'undefined'){
                while (commingTime.indexOf("0") === 0)
                    commingTime = commingTime.substr(1);
                time = 'min';
            }
            if (commingTime.substr(0, 1) == ':'){
                commingTime = commingTime.substr(1);
                time = 'min';
            }

            while (commingTime.indexOf("0") === 0)
                commingTime = commingTime.substr(1);

            if (!commingTime){
                commingTime = commingNext.wait.substr(6, 2);
                time = 'sec';
            }

            if (commingTime == '00'){
                continue;
            }

            if (typeof(commingNext.route) == 'undefined'){
                return;
            }

            var classTd = commingNext.route.vt + '-cell';

            if ((result[i].route.vt == vtCurrent) && (result[i].route.name == nameCurrent) && (commingTime == timeCurrent)){
                continue;
            } else {
                var dispName = commingNext.route.name;

                if (typeof(dispName) != 'undefined'){
                    while (dispName.indexOf("0") === 0)
                        dispName = dispName.substr(1);
                }

                tableStop.append(
                    '<tr>' +
                    '<td style="text-align: center">' +
                    '<div class="' + classTd + '" vt="' + commingNext.route.vt + '" data-name="' + commingNext.route.name + '">' +
                    '' + dispName + '</div></td>' +
                    '<td class="timetable-next">' + commingTime + ' ' + translate(time) + '</td>' +
                    '<td class="timetable-direction">' + commingNext.direction.endName + '</td>' +
                    '</tr>'
                );
            }
            vtCurrent = result[i].route.vt;
            nameCurrent = result[i].route.name;
            timeCurrent = commingTime;
        }
        $("#timetable").replaceWith(tableStop);
        divBody.append(tableStop);
        if (sheduleHalt.length == 0){
            closePopupMarker();
        }
        $('.halts-popup-body').niceScroll({
            cursorcolor:"#cccccc",
            autohidemode: false,
            horizrailenabled:false
        });
    });
    return sheduleHalt;
}

function closePopup() {
    map.closePopup();
}

function closePopupMarker() {
    map.closePopup();
    groupNextStops.clearLayers();
    courseNextCorridor.clearLayers();
}

function makeDraggablePopup(popup) {
    var draggable = new L.Draggable(popup._container, popup._wrapper);
    draggable.enable();

    draggable.on('dragend', function() {
        var pos = map.layerPointToLatLng(this._newPos);
        popup.setLatLng(pos);
    });
}

/** Строит таблицу при клике на маркер мобильного объекта */
var startRefreshRouteTimePopup = true;
function refreshRouteTimePopup(marker){

    if (map.hasLayer(groupNextStops)){
        courseNextCorridor.clearLayers();
        groupNextStops.clearLayers();
    }

    var fullTable = $('<div class="full-route-table">');
    $('<div class="custom-popup-close-button" onclick ="closePopupMarker()">x</div>').appendTo(fullTable);
    var headTable = $('<table class="head-route-table">').appendTo(fullTable),
        garageNum = '';
    if (marker.options.garageNum != ''){
        garageNum = '(' + marker.options.garageNum + ')';
    }

    headTable.append(
        '<tr><td rowspan="2" class="popup-icon-' + marker.options.vt + '" style="width: 30px"></td>' +
        '<td class="popup-nametransport">' + marker.options.model + ' № &nbsp' + marker.options.stateNum + '&nbsp' + garageNum + '</td></tr>'
    );

    if (!startRefreshRouteTimePopup){
        return fullTable;
    }
    startRefreshRouteTimePopup = false;
    var divLoading  = $("<div class='transition-loader'><div class='transition-loader-inner'>" +
        "<label></label><label></label><label></label><label></label><label></label><label></label>" +
        "</div></div>").appendTo(fullTable);

    var options = {
        objectId: marker.options.id,
        srv: srv,
        lang: lang
    };

    infonextstopsRequest(options, function(answer){
        startRefreshRouteTimePopup = true;
        divLoading.remove();
        if (answer == 'Connect error'){
            $("<div class='div-loading-error'>" + translate('failed to load data') + "</div>").appendTo(fullTable);
            return;
        }

        var differenceStr = 'Неизвестно';

        if (answer.priorStop && answer.priorStop.difference) {
            var  difference = answer.priorStop.difference;
            var planTime = difference.substr(1, 8);
            if (planTime.substr(0, 2) === '00'){
                planTime = planTime.substr(3);
            }

            if (difference.substr(0,1) === '-') {

                differenceStr = translate('late for') + ' <b>' + planTime + '</b> ' + translate('sec');
            }
            else if (difference.substr(0,1) === '+') {
                differenceStr = translate('ahead of') + ' <b>' + planTime + '</b> ' + translate('sec');
            }
            else {
                differenceStr = translate('goes according to schedule');
            }
        }

        headTable.append(
            '<tr>' +
            '<td style="font-weight: 600; padding-left: 10px">' + differenceStr + '</td>' +
            '</tr>'
        );

        if (answer.nextStops && answer.nextStops.length) {
            var nexts = answer.nextStops;
            var divBody = $('<div class="route-table-body">').appendTo(fullTable);
            var routeTable = $('<table class="route-time-table">').appendTo(divBody);

            routeTable.append(
                '<tr style="height: 12px"></tr>' +
                '<tr style="font-size: 12px">' +
                '<td style="min-width: 75%;">' + translate('stop') + '</td>' +
                '<td style="width: 25%; text-align: right;">' + translate('arrival') + '</td>' +
                '</tr>');

            for(var i = 0; i < nexts.length; i++) {

                var nextZone = nexts[i].zones[0].name;
                var coming = moment(nexts[i].time).format('HH:mm');

                if(typeof(nextZone) == 'undefined') {
                    nextZone = translate('depot');
                    coming = "--:--";

                    routeTable.append('<tr><td>' + nextZone + '</td><td>' + coming + '</td></tr>');
                    return;
                }
                routeTable.append('<tr><td style="min-width: 75%;">' + nextZone + '</td><td style="text-align: right">' + coming + '</td></tr>');
            }
        }
        $('.route-table-body').niceScroll({
            cursorcolor:"#cccccc",
            autohidemode: false,
            horizrailenabled:false
        });
        addStopsNextCommings(nexts);
        $(".full-route-table").replaceWith(fullTable);

        var corridorGeometry = [], point, line, m, k;
        if(answer.routeWays && answer.routeWays.length){
            for(m = 0; m < answer.routeWays.length; m++){
                corridorGeometry = [];
                for(k = 0; k < answer.routeWays[m].length; k++){
                    point = answer.routeWays[m][k];
                    corridorGeometry.push(new L.LatLng(point[0], point[1]));
                }
                line = L.polyline(corridorGeometry, {color: '#07910d', weight: 5, opacity: 1});
                courseNextCorridor.addLayer(line);
            }
        }

        if(answer.nextWays && answer.nextWays.length){
            for(m = 0; m < answer.nextWays.length; m++){
                corridorGeometry = [];
                for(k = 0; k < answer.nextWays[m].length; k++){
                    point = answer.nextWays[m][k];
                    corridorGeometry.push(new L.LatLng(point[0], point[1]));
                }
                line = L.polyline(corridorGeometry, {color: corridorColorNext, weight: 5, opacity: 1});
                courseNextCorridor.addLayer(line);
            }
        }

        if (!map.hasLayer(courseNextCorridor)) {
            map.addLayer(courseNextCorridor);
        }
    });
    return fullTable;
}

/** Очистка карты (убирает окна, маркеры, маршруты, остановки)*/
function clearMap() {
    clearInterval(interval);
    map.closePopup();
    courseCorridor.clearLayers();
    courseNextCorridor.clearLayers();
    courseCorridorAll.clearLayers();
    inactiveCorridor.clearLayers();
    groupStopsRoute.clearLayers();
    groupNextStops.clearLayers();
    selectStops.clearLayers();
    markersGroupVt.clearLayers();
    beginEndMarkerTotal.clearLayers();
    beginEndMarkerPart.clearLayers();
}

if (reviewsend == 'ok'){
    setTimeout(function () {
        $.snackbar(translate('feedback sent'));
    }, 1000);
    history.pushState({}, null, '/');
}

if (reviewsend == 'error'){
    setTimeout(function () {
        $.snackbar(translate('failed to send'));
    }, 1000);
    history.pushState({}, null, '/');
}

/** Смена языка */
function changeLanguage() {
    if (lang == 'ru'){
        window.location.href = "/setlocale/en";
    } else {
        window.location.href = "/setlocale/ru";
    }
}