<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model backend\models\BusRoute */
/* @var $form yii\widgets\ActiveForm */
if ($direction == 1) {
    $name = 'прямого';
} elseif ($direction == 2) {
    $name = 'обратного';
}

$this->title = 'Редактирование ' . $name . ' маршрута: ' . $model->number;
$this->params['breadcrumbs'][] = ['label' => 'Автобусные маршруты', 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->number, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = $this->title;

$this->registerCssFile('/css/leaflet.css');
$this->registerCssFile('/css/leaflet.draw.css');

$this->registerJsFile('/js/leaflet-src.js',['depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile('/js/leaflet.draw-src.js',['depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile(\yii\helpers\Url::to(['/js/bus-route-coordinates-map.js']),['depends' => [\yii\web\JqueryAsset::class]]);

?>
<div class="bus-route-update">

    <h1><?= Html::encode($this->title) ?></h1>

    <div class="bus-route-form">
        <div>
            <?= Html::a('Перейти к просмотру маршрута', ['view', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>

            <?php if ($direction == 1): ?>
                <?= Html::a('<i class="fa fa-pencil-square-o"></i> Обратный маршрут', ['update-route', 'id' => $model->id, 'direction' => 2], ['class' => 'btn btn-primary']) ?>
            <?php elseif ($direction == 2): ?>
                <?= Html::a('<i class="fa fa-pencil-square-o"></i> Прямой маршрут', ['update-route', 'id' => $model->id, 'direction' => 1], ['class' => 'btn btn-primary']) ?>
            <?php endif;?>
        </div>
        <div id="map" style="height: 700px;margin: 10px 0;"></div>
    </div>

</div>
