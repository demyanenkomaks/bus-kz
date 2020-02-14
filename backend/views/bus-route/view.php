<?php

use yii\helpers\Html;
use kartik\tabs\TabsX;

/* @var $this yii\web\View */
/* @var $model backend\models\BusRoute */

$this->title = 'Автобусный маршрут: ' . $model->number;
$this->params['breadcrumbs'][] = ['label' => 'Автобусные маршруты', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
\yii\web\YiiAsset::register($this);
?>
<div class="bus-route-view">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('<i class="fa fa-pencil-square-o"></i> Информация о маршруте', ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
        <?= Html::a('<i class="fa fa-pencil-square-o"></i> Прямой маршрут', ['update-route', 'id' => $model->id, 'direction' => 1], ['class' => 'btn btn-primary']) ?>
        <?= Html::a('<i class="fa fa-pencil-square-o"></i> Обратный маршрут', ['update-route', 'id' => $model->id, 'direction' => 2], ['class' => 'btn btn-primary']) ?>

        <?= Html::a('<i class="fa fa-pencil-square-o"></i> Станции прямого маршрута', ['update-stop', 'id' => $model->id, 'direction' => 1], ['class' => 'btn btn-primary']) ?>
        <?= Html::a('<i class="fa fa-pencil-square-o"></i> Станции обратного маршрута', ['update-stop', 'id' => $model->id, 'direction' => 2], ['class' => 'btn btn-primary']) ?>

        <?= Html::a('<i class="fa fa-trash-o"></i> Удалить', ['delete', 'id' => $model->id], [
            'class' => 'btn btn-danger',
            'data' => [
                'confirm' => 'Вы действительно хотите удалить?',
                'method' => 'post',
            ],
        ]) ?>
    </p>

    <?php $items = [
        [
            'label' => '<i class="fa fa-info"></i> Информация о маршруте',
            'content' => $this->render('view_route', [
                'model' => $model,
            ]),
//            'active' => true,
        ],
        [
            'label' => '<i class="fa fa-map"></i> Станции прямого маршрута',
            'content' => $this->render('view_stop_straight', [
                'model' => $model,
                'dataProvider' => $dataProviderStraight,
            ]),
        ],
        [
            'label' => '<i class="fa fa-map"></i> Станции обратного маршрута',
            'content' => $this->render('view_stop_back', [
                'model' => $model,
                'dataProvider' => $dataProviderBack,
            ]),
        ],
    ];

    echo TabsX::widget([
        'items' => $items,
        'position' => TabsX::POS_ABOVE,
        'encodeLabels' => false,
    ]);
    ?>
</div>
