<?php

use kartik\switchinput\SwitchInput;
use kartik\time\TimePicker;
use yii\helpers\Html;
use kartik\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model backend\models\BusRoute */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="bus-route-form row">

    <?php $form = ActiveForm::begin(); ?>

    <div class="col-md-12">
        <div class="col-md-4">
            <?= $form->field($model, 'number')->textInput(['maxlength' => true]) ?>
        </div>
        <div class="col-md-4">
            <?= $form->field($model, 'time_ot')->widget(TimePicker::class, [
                'pluginOptions' => [
                    'showSeconds' => false,
                    'showMeridian' => false,
                    'minuteStep' => 1,
                ]
            ]);?>
        </div>
        <div class="col-md-4">
            <?= $form->field($model, 'time_do')->widget(TimePicker::class, [
                'pluginOptions' => [
                    'showSeconds' => false,
                    'showMeridian' => false,
                    'minuteStep' => 1,
                ]
            ]);?>
        </div>
    </div>
    <div class="col-md-12">
        <div class="col-md-4">
            <?= $form->field($model, 'cost')->textInput() ?>
        </div>
        <div class="col-md-4">
            <?= $form->field($model, 'display')->widget(SwitchInput::class, [
                'pluginOptions' => [
                    'onText' => 'Да',
                    'offText' => 'Нет'
                ]
            ]) ?>
        </div>
    </div>

    <div class="col-md-12">
        <div class="col-md-12">
            <div class="form-group">
                <?= Html::submitButton('Сохранить', ['class' => 'btn btn-success']) ?>
            </div>
        </div>
    </div>

    <?php ActiveForm::end(); ?>

</div>
