<?php

use yii\helpers\Html;
use kartik\grid\GridView;

/* @var $this yii\web\View */
/* @var $searchModel backend\models\DataBusHistorySearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Data Bus Histories';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="data-bus-history-index">

    <h1><?= Html::encode($this->title) ?></h1>


    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'kartik\grid\SerialColumn'],

            'retranslator',
            'id',

            [
                'class' => 'kartik\grid\ActionColumn',
                'template' => '{view}',
                'buttons' => [
                    'view' => function ($url, $model, $key) {
                        return Html::a ( '<span class="fa fa-map" aria-hidden="true"></span> ', ['data-bus-history/view', 'retranslator' => $model->retranslator] );
                    },
                ],
            ],
        ],
    ]); ?>


</div>
