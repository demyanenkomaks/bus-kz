<?php

use kartik\date\DatePicker;
use yii\helpers\Html;
use kartik\grid\GridView;
use yii\widgets\Pjax;
/* @var $this yii\web\View */
/* @var $searchModel backend\models\UserSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Пользователи';
$this->params['breadcrumbs'][] = $this->title;

$layout_dp ='{input1}
             <span class="input-group-addon">-</span>
             {input2}
             <span class="input-group-addon kv-date-remove">
              <i class="glyphicon glyphicon-remove"></i>
             </span>';
?>
<div class="user-index">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Добавить', ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?php Pjax::begin(); ?>

    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'kartik\grid\SerialColumn'],

            'username',
            [
                'attribute' => 'status',
                'format' => 'raw',
                'filter' => [
                    10 => 'Активные',
                    9 => 'Заблокированные',
                ],
                'value' => function ($model, $key, $index, $column) {
                    $active = $model->{$column->attribute} === 10;
                    return \yii\helpers\Html::tag(
                        'span',
                        $active ? 'Активный' : 'Заблокирован',
                        [
                            'class' => ($active ? 'text-success' : 'text-danger'),
                        ]
                    );
                },
            ],
            [
                'attribute' => 'created_at',
                'format' => 'date',
                'filter' => DatePicker::widget([
                    'model' => $searchModel,
                    'layout' => $layout_dp,
                    'attribute' => 'created_at[1]',
                    'attribute2' => 'created_at[2]',
                    'name'=>'created_at[1]',
                    'value' => 'created_at[1]',
                    'separator' => 'по',
                    'value2' => 'created_at[2]',
                    'name2'=>'created_at[2]',
                    'type' => DatePicker::TYPE_RANGE,
                    'pluginOptions' => ['autoclose' => true,'format' => 'dd.mm.yyyy']
                ]),
            ],
            [
                'attribute' => 'updated_at',
                'format' => 'date',
                'filter' => DatePicker::widget([
                    'model' => $searchModel,
                    'layout' => $layout_dp,
                    'attribute' => 'updated_at[1]',
                    'attribute2' => 'updated_at[2]',
                    'name'=>'updated_at[1]',
                    'value' => 'updated_at[1]',
                    'separator' => 'по',
                    'value2' => 'updated_at[2]',
                    'name2'=>'updated_at[2]',
                    'type' => DatePicker::TYPE_RANGE,
                    'pluginOptions' => ['autoclose' => true,'format' => 'dd.mm.yyyy']
                ]),
            ],


            ['class' => 'kartik\grid\ActionColumn'],
        ],
    ]); ?>

    <?php Pjax::end(); ?>

</div>
