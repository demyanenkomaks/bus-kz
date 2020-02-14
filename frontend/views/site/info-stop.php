<?php

/* @var $this yii\web\View */

$this->title = 'Общественный транспорт города Кызылорда';

$this->registerCssFile('/css/leaflet.css');
$this->registerCssFile('/css/clock.css');

$this->registerJsFile('/js/leaflet.js',['depends' => [\yii\web\JqueryAsset::class]]);

$this->registerJsFile('/js/info-stop.js',['depends' => [\yii\web\JqueryAsset::class]]);

$this->registerJsFile('/js/clock.js',['depends' => [\yii\web\JqueryAsset::class]]);
?>
<input type="hidden" id="latitude" value="<?= $model->latitude ?>">
<input type="hidden" id="longitude" value="<?= $model->longitude ?>">

<div class="site-index" id="map" style="z-index: 0; height: 100vh;"></div>

<div class="clock">
    <ul class="digit hours--1">
        <li class="item digit__item item--h item--1"></li>
        <li class="item digit__item item--v item--2"></li>
        <li class="item digit__item item--v item--3"></li>
        <li class="item digit__item item--h item--4"></li>
        <li class="item digit__item item--v item--5"></li>
        <li class="item digit__item item--v item--6"></li>
        <li class="item digit__item item--h item--7"></li>
    </ul>

    <ul class="digit hours--2">
        <li class="item digit__item item--h item--1"></li>
        <li class="item digit__item item--v item--2"></li>
        <li class="item digit__item item--v item--3"></li>
        <li class="item digit__item item--h item--4"></li>
        <li class="item digit__item item--v item--5"></li>
        <li class="item digit__item item--v item--6"></li>
        <li class="item digit__item item--h item--7"></li>
    </ul>

    <span class="dottes"></span>

    <ul class="digit min--0">
        <li class="item digit__item item--h item--1"></li>
        <li class="item digit__item item--v item--2"></li>
        <li class="item digit__item item--v item--3"></li>
        <li class="item digit__item item--h item--4"></li>
        <li class="item digit__item item--v item--5"></li>
        <li class="item digit__item item--v item--6"></li>
        <li class="item digit__item item--h item--7"></li>
    </ul>

    <ul class="digit min--1">
        <li class="item digit__item item--h item--1"></li>
        <li class="item digit__item item--v item--2"></li>
        <li class="item digit__item item--v item--3"></li>
        <li class="item digit__item item--h item--4"></li>
        <li class="item digit__item item--v item--5"></li>
        <li class="item digit__item item--v item--6"></li>
        <li class="item digit__item item--h item--7"></li>
    </ul>
    
</div>

<div class="left-panel-menu-info-stop">
    <div class="content">
        <div class="panel-info-bus" id="panel-info-bus" style="display: none"></div>
    </div>
</div>
