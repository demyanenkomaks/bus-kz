<?php

use kartik\select2\Select2;
use yii\helpers\Html;
use kartik\grid\GridView;

/* @var $this yii\web\View */
/* @var $searchModel backend\models\BusRouteSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Автобусные маршруты';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="bus-route-index">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Добавить', ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'kartik\grid\SerialColumn'],

            'number',
            [
                'attribute' => 'time',
                'value' => 'timeView',
                'format' => 'raw',
            ],
            'cost',
            'display:boolean',

            ['class' => 'kartik\grid\ActionColumn'],
        ],
    ]); ?>

</div>
