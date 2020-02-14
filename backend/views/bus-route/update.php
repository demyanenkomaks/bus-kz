<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model backend\models\BusRoute */

$this->title = 'Редактирование информации о маршруте: ' . $model->number;
$this->params['breadcrumbs'][] = ['label' => 'Автобусные маршруты', 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->number, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="bus-route-update">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
