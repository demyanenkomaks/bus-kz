<?php
use yii\bootstrap\ActiveForm;
use yii\helpers\Html;
use yii\widgets\MaskedInput;

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \common\models\LoginForm */
$this->title = 'Вход';

$fieldOptions1 = [
    'options' => ['class' => 'form-group has-feedback'],
    'inputTemplate' => "{input}<span class='glyphicon glyphicon-user form-control-feedback'></span>"
];

$fieldOptions2 = [
    'options' => ['class' => 'form-group has-feedback'],
    'inputTemplate' => "{input}<span class='glyphicon glyphicon-lock form-control-feedback'></span>"
];
$keyOpt = ['class'=>'form-control','id'=>'keypass','placeholder' =>'пароль от ключа'];

?>


<div class="login-box">
    <div class="login-logo">
    </div>
    <div class="login-box-body">
        <p class="login-box-msg">Пожалуйста, заполните следующие поля для входа:</p>

        <?php $form = ActiveForm::begin(['id' => 'login-form', 'enableClientValidation' => false]); ?>

        <?= $form
            ->field($model, 'username', $fieldOptions1)
            ->label(false)
            ->textInput(['autofocus' => true, 'placeholder' => 'Логин'])
        ?>

        <?= $form
            ->field($model, 'password', $fieldOptions2)
            ->label(false)
            ->passwordInput(['placeholder' => 'Пароль']) ?>


        <div class="row">
            <div class="col-xs-4">
                <?= $form->field($model, 'rememberMe')->checkbox()->label('Запомнить') ?>
            </div>
            <div class="col-xs-4">
                <a href="/" class="btn btn-default btn-flat">Сайт</a>
            </div>
            <div class="col-xs-4">
                <?= Html::submitButton(Yii::t('app','Вход'), ['class' => 'btn btn-primary btn-block btn-flat', 'name' => 'login-button']) ?>
            </div>
        </div>

        <?php ActiveForm::end(); ?>

    </div>
</div>
