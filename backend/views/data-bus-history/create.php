<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model backend\models\DataBusHistory */

$this->title = 'Create Data Bus History';
$this->params['breadcrumbs'][] = ['label' => 'Data Bus Histories', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="data-bus-history-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
