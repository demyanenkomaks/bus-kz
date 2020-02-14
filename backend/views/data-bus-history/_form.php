<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model backend\models\DataBusHistory */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="data-bus-history-form">

    <?php $form = ActiveForm::begin(); ?>

    <?= $form->field($model, 'retranslator')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'd_t')->textInput() ?>

    <?= $form->field($model, 'lat')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'lng')->textInput(['maxlength' => true]) ?>

    <div class="form-group">
        <?= Html::submitButton('Save', ['class' => 'btn btn-success']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
