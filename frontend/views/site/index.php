<?php

/* @var $this yii\web\View */

$this->title = 'Общественный транспорт города Кызылорда';

$this->registerCssFile('/css/leaflet.css');

$this->registerJsFile('/js/leaflet.js',['depends' => [\yii\web\JqueryAsset::class]]);
//$this->registerJsFile('/js/leaflet-src.js',['depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile('/js/map.js',['depends' => [\yii\web\JqueryAsset::class]]);
?>
<div class="site-index" id="map" style="z-index: 0; height: 100vh;">
</div>


<div class="left-panel-menu-header">
    <div class="menu-header">
        <a href="/" class="logo">
            <div class="logo-img">
                <img src="/images/kyzylorda-gerb.png" alt="">
            </div>
            <div class="logo-name">
                Кызылорда
            </div>
        </a>
        <button class="btn btn-default check-bus" id="check-bus-list" onclick='if($(".left-panel-menu").is(":hidden")){$(".left-panel-menu").slideDown("slow");}else{$(".left-panel-menu").slideUp("slow");}'>
            <i class="fa fa-sort"></i>
        </button>
        <button class="btn btn-default check-bus" id="transport-button">
            <i class="fa fa-bus"></i>
        </button>
    </div>
</div>

<div class="left-panel-menu">
    <div class="content">
        <div class="panel-all-bus-route" id="panel-all-bus-route">
        </div>
        <div class="panel-loader" id="panel-loader">
            <div class="loader" id="loader">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <div class="panel-all-bus-stop" id="panel-all-bus-stop" style="display: none">
            <div class="data-route pad-t-25">
                <div class="header-route">
                    <div class="route w-100">
                        <div class="pull-left w-100">Маршрут: <b><span id="route-bus-number"></span></b></div>
                        <div class="pull-left w-85"><b><span id="route-bus-ot-do"></span></b></div>
                        <div class="pull-left w-15" id="route-bus-direction"></div>
                    </div>
                    <div class="pad-t-15 w-100">
                        <div class="pull-left pad-r-15" title="Время работы"><i class="glyphicon glyphicon-time"></i> <span id="route-bus-time"></span></div>
                        <div class="pull-left pad-r-15" title="Стоимость проезда"><i class="fa fa-money"></i> <span id="route-bus-cost"></span></div>
                    </div>
                </div>
                <div class="pad-t-5 w-100">Остановки:</div>
                <div class="stops w-100" id="route-bus-stops"></div>
            </div>
        </div>
    </div>
</div>