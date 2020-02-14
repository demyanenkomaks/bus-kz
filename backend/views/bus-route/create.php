<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model backend\models\BusRoute */

$this->title = 'Добавление автобусного маршрута';
$this->params['breadcrumbs'][] = ['label' => 'Автобусные маршруты', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="bus-route-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
