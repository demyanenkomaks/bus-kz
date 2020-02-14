<?php

use wbraganca\dynamicform\DynamicFormWidget;
use kartik\select2\Select2;
use yii\helpers\Html;
use yii\jui\JuiAsset;

/* @var $models_stops backend\models\BusStopRoute */

DynamicFormWidget::begin([
    'widgetContainer' => 'dynamicform_wrapper', // required: only alphanumeric characters plus "_" [A-Za-z0-9_]
    'widgetBody'      => '.form-options-body', // required: css class selector
    'widgetItem'      => '.form-options-item', // required: css class
    'limit'           => 10, // the maximum times, an element can be cloned (default 999)
    'min'             => 1, // 0 or 1 (default 1)
    'insertButton'    => '.add-item' , // css class
    'deleteButton'    => '.delete-item', // css class
    'model'           => $models_stops[0],
    'formId'          => 'stop-id',
    'formFields'      => [
        'bus_stop_id',
    ],
]);
?>
    <table class="table table-bordered table-striped margin-b-none">
        <thead>
        <tr>
            <th style="width: 90px; text-align: center"></th>
            <th class="required">Станции</th>
            <th style="width: 90px; text-align: center">Действия</th>
        </tr>
        </thead>
        <tbody class="form-options-body">
        <?php foreach ($models_stops as $index => $model): ?>
            <tr class="form-options-item">
                <?php
                if (!$model->isNewRecord) {
                    echo Html::activeHiddenInput($model, "[{$index}]id");
                }
                ?>
                <td class="sortable-handle text-center vcenter" style="cursor: move;">
                    <i class="fa fa-arrows"></i>
                </td>
                <td>
                    <?= $form->field($model, "[{$index}]bus_stop_id")->widget(Select2::class,[
                        'data' => $stationList,
                        'options' => [
                            'placeholder' => '',
                        ],
                        'pluginOptions' => [
                            'allowClear' => true
                        ],
                    ])->label(false) ?>
                </td>
                <td class="text-center">
                    <button type="button" class="delete-item btn btn-danger btn-xs"><i class="fa fa-minus"></i></button>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="2"></td>
            <td><button type="button" class="add-item btn btn-success btn-sm"><span class="fa fa-plus"></span> Добавить</button></td>
        </tr>
        </tfoot>
    </table>

<?php DynamicFormWidget::end(); ?>

<?php
$js = <<<'EOD'

$(".optionvalue-img").on("filecleared", function(event) {
    var regexID = /^(.+?)([-\d-]{1,})(.+)$/i;
    var id = event.target.id;
    var matches = id.match(regexID);
    if (matches && matches.length === 4) {
        var identifiers = matches[2].split("-");
        $("#optionvalue-" + identifiers[1] + "-deleteimg").val("1");
    }
});

var fixHelperSortable = function(e, ui) {
    ui.children().each(function() {
        $(this).width($(this).width());
    });
    return ui;
};

$(".form-options-body").sortable({
    items: "tr",
    cursor: "move",
    opacity: 0.6,
    axis: "y",
    handle: ".sortable-handle",
    helper: fixHelperSortable,
    update: function(ev){
        $(".dynamicform_wrapper").yiiDynamicForm("updateContainer");
    }
}).disableSelection();

EOD;

JuiAsset::register($this);
$this->registerJs($js);
?>
