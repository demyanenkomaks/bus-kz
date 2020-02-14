<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model backend\models\BusStop */

$this->title = 'Редактирование автобусной остановки: ' . $model->title;
$this->params['breadcrumbs'][] = ['label' => 'Автобусные остановки', 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->title, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="bus-stop-update">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
