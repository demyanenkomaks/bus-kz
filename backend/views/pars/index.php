<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

$this->title = 'Распределение автобусов на маршруты';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="sp-gabarit-index">

    <h1><?= Html::encode($this->title) ?></h1>

    <div class="col-md-12">
        <div class="col-md-12">
            <?php $form = ActiveForm::begin() ?>
            <?= Html::submitButton('Убрать автобусы с маршрутов', [
                'data' => ['confirm' => 'Вы действительно хотите убрать автобусы с маршрутов?'],
                'name' => 'restart', 'class' => 'btn btn-warning', 'style' => 'margin-top: 15px']) ?>
            <?php ActiveForm::end() ?>
        </div>
    </div>
    <div class="col-md-12" style="padding-top: 25px">
        <?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]) ?>
        <div class="col-md-12">
            <?= $form->field($model, 'file[]')->fileInput(['multiple' => true]) ?>
        </div>
        <div class="col-md-12">
            <?= Html::submitButton('Спарсить', ['name' => 'pars', 'class' => 'btn btn-success']) ?>
        </div>
        <?php ActiveForm::end() ?>

        <div class="col-md-12" style="padding-top: 15px">
            <h3>Ошибки при парсинге</h3>
            <p>Причина читайте при выводе ошибки:</p>
            <p><span class="label label-warning">Цвет ошибка при парсинге</span> - Автобусам указанным в ошибке маршрут не добавлен.</p>
            <p><span class="label label-danger">Цвет ошибка при парсинге</span> - Автобусам маршрут не добавлен.</p>
        </div>
    </div>


</div>
