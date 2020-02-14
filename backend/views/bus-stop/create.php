<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model backend\models\BusStop */

$this->title = 'Добавление автобусной остановки';
$this->params['breadcrumbs'][] = ['label' => 'Автобусные остановки', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="bus-stop-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
