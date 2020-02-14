<?php

use kartik\grid\GridView;
use yii\widgets\Pjax;

?>

<?php Pjax::begin(); ?>

<?= GridView::widget([
    'dataProvider' => $dataProvider,
    'columns' => [
        ['class' => 'kartik\grid\SerialColumn'],


        [
            'attribute' => 'bus_stop_id',
            'value' => 'busStopName',
            'format' => 'html',
        ]

    ],
]); ?>

<?php Pjax::end(); ?>