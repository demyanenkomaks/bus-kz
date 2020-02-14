<?php

use yii\helpers\Html;
use yii\grid\GridView;
use yii\helpers\Url;

/* @var $this yii\web\View */
/* @var $searchModel backend\models\BusStopSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Автобусные остановки';
$this->params['breadcrumbs'][] = $this->title;

$this->registerCssFile('/css/leaflet.css');

$this->registerJsFile('/js/leaflet.js',['depends' => [\yii\web\JqueryAsset::class]]);
//$this->registerJsFile('/js/leaflet-src.js',['depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile(Url::to(['/js/bus-stop/view-all-stops.js']),['depends' => [\yii\web\JqueryAsset::class]]);
?>
<div class="bus-stop-index">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Добавить', ['create'], ['class' => 'btn btn-success']) ?>
    </p>


    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

//            'latitude',
//            'longitude',
            'title',
            'side',
            [
                'attribute' => 'viewUrlStop',
                'label' => 'Карта',
                'format' => 'raw',
            ],

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>

    <div class="map" id="map" style="z-index: 0; height: 60vh;"></div>

</div>
