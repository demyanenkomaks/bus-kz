<?php

use yii\widgets\DetailView;

$this->registerCssFile('/css/leaflet.css');

$this->registerJsFile('/js/leaflet-src.js',['depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile(\yii\helpers\Url::to(['/js/bus-route-coordinates-map-view.js']),['depends' => [\yii\web\JqueryAsset::class]]);
?>

<?= DetailView::widget([
    'model' => $model,
    'attributes' => [
        'number',
        [
            'attribute' => 'time',
            'value' => $model->timeView,
            'format' => 'raw',
        ],
        'cost',
        'display:boolean',
    ],
]) ?>

<div id="map" style="height: 500px; margin-bottom: 10px"></div>

