<?php

use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model backend\models\Bus */

$this->title = $model->busViewName;
$this->params['breadcrumbs'][] = ['label' => 'Автобусы', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
\yii\web\YiiAsset::register($this);

$this->registerCssFile('/css/leaflet.css');

$this->registerJsFile('/js/leaflet-src.js',['depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile(\yii\helpers\Url::to(['/js/bus/bus-view-map.js']), ['depends' => [\yii\web\JqueryAsset::class]]);

?>
<div class="bus-view">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Редактировать', ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
        <?= Html::a('Удалить', ['delete', 'id' => $model->id], [
            'class' => 'btn btn-danger',
            'data' => [
                'confirm' => 'Вы действительно хотите удалить?',
                'method' => 'post',
            ],
        ]) ?>
    </p>

    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            'mark',
            'model',
            'number_sign',
            'number_bus',
            [
                'attribute' => 'route_id',
                'value' => $model->routeName,
            ],
            [
                'attribute' => 'retranslator_id',
                'value' => $model->dataBusName,
            ],
            [
                'label' => 'Время данных ретранслятора',
                'value' => $model->dataBus0->d_t,
                'format' => 'datetime'
            ],
            [
                'label' => 'Время внесения в базу',
                'value' => $model->dataBus0->updated_at,
                'format' => 'datetime'
            ],

        ],
    ]) ?>

    <div id="map" style="height: 500px; margin-bottom: 10px"></div>

</div>
