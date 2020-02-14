<?php

use yii\helpers\Html;
use yii\helpers\Url;

/* @var $this yii\web\View */
/* @var $model backend\models\DataBusHistory */

$this->title = $retranslator;
$this->params['breadcrumbs'][] = ['label' => 'Data Bus Histories', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
\yii\web\YiiAsset::register($this);

$this->registerCssFile('/css/leaflet.css');

$this->registerJsFile('/js/leaflet.js',['depends' => [\yii\web\JqueryAsset::class]]);
//$this->registerJsFile('/js/leaflet-src.js',['depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile(Url::to(['/js/data-history-map.js']),['depends' => [\yii\web\JqueryAsset::class]]);
?>
<div class="data-bus-history-view">

    <h1 id="retranslator-search"><?= Html::encode($this->title) ?></h1>

    <div id="map" style="z-index: 0; height: 75vh;"></div>
</div>
