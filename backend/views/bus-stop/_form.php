<?php

use yii\helpers\Html;
use kartik\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model backend\models\BusStop */
/* @var $form yii\widgets\ActiveForm */

$this->registerCssFile('/css/leaflet.css');
//$this->registerJsFile('/js/leaflet.js');
$this->registerJsFile('/js/leaflet-src.js',['depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile(\yii\helpers\Url::to(['/js/map.js']),['depends' => [\yii\web\JqueryAsset::class]]);
?>

<div class="bus-stop-form row">

    <div class="col-md-6">

        <?php $form = ActiveForm::begin(); ?>

        <?= $form->field($model, 'latitude')->textInput(['maxlength' => true]) ?>

        <?= $form->field($model, 'longitude')->textInput(['maxlength' => true]) ?>

        <?= $form->field($model, 'title')->textInput(['maxlength' => true]) ?>

        <?= $form->field($model, 'side')->textInput() ?>

        <div class="form-group">
            <?= Html::submitButton('Сохранить', ['class' => 'btn btn-success']) ?>
        </div>

        <?php ActiveForm::end(); ?>
    </div>

    <div class="col-md-6">
        <div id="map" style="height: 500px"></div>
    </div>

</div>
