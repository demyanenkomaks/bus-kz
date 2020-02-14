<?php

use kartik\select2\Select2;
use yii\helpers\Html;
use yii\grid\GridView;
use yii\widgets\Pjax;
/* @var $this yii\web\View */
/* @var $searchModel backend\models\BusSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Автобусы';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="bus-index">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Добавить', ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?php Pjax::begin(); ?>

    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            'number_sign',
            'number_bus',
            [
                'attribute' => 'route_id',
                'value' => 'routeName',
                'format' => 'html',
                'filter' => Select2::widget([
                    'model' => $searchModel,
                    'attribute' => 'route_id',
                    'data' => $searchModel->routeList,
                    'theme' => Select2::THEME_BOOTSTRAP,
                    'hideSearch' => false,
                    'options' => [
                        'placeholder' => '',
                    ],
                    'pluginOptions' => [
                        'allowClear' => true
                    ]
                ]),
                'headerOptions' => ['style' => 'min-width: 200px;'],
            ],

            [
                'attribute' => 'retranslator_id',
                'value' => 'dataBusName',
                'format' => 'html',
                'filter' => Select2::widget([
                    'model' => $searchModel,
                    'attribute' => 'retranslator_id',
                    'data' => $searchModel->dataBusList,
                    'theme' => Select2::THEME_BOOTSTRAP,
                    'hideSearch' => false,
                    'options' => [
                        'placeholder' => '',
                    ],
                    'pluginOptions' => [
                        'allowClear' => true
                    ]
                ]),
                'headerOptions' => ['style' => 'min-width: 200px;'],
            ],
            [
                'label' => 'Время данных ретранслятора',
                'value' => 'retranslatorDate',
                'format' => 'datetime'
            ],
            [
                'label' => 'Время внесения в базу',
                'value' => 'retranslatorUpdated',
                'format' => 'datetime'
            ],

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>

    <?php Pjax::end(); ?>

</div>
