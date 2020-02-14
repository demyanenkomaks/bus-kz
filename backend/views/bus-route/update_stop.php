<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model backend\models\BusRoute */
/* @var $models_stops backend\models\BusStopRoute */
if ($direction == 1) {
    $name = 'прямого';
} elseif ($direction == 2) {
    $name = 'обратного';
}

$this->title = 'Редактирование станций ' . $name . ' маршрута: ' . $model->number;
$this->params['breadcrumbs'][] = ['label' => 'Автобусные маршруты', 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->number, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="bus-route-update">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= Html::a('Перейти к просмотру маршрута', ['view', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>

    <?php $form = ActiveForm::begin(['id' => 'stop-id']); ?>

    <?= $this->render('_form_stop', [
        'form' => $form,
        'models_stops' => $models_stops,
        'stationList' => $stationList,
    ]) ?>

    <div class="form-group col-md-6">
        <?= Html::submitButton('Сохранить', ['class' => 'btn btn-success']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
