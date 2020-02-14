<?php

namespace backend\models;

use yii\base\Model;
use yii\web\UploadedFile;

/**
 * UploadForm is the model behind the upload form.
 */
class UploadForm extends Model
{
    /**
     * @var UploadedFile file attribute
     */
    public $file;

    /**
     * @return array the validation rules.
     */
    public function rules()
    {
        return [
            [['file'], 'file',  'extensions' => 'xls, xlsx', 'maxFiles' => 5],
        ];
    }

    public function attributeLabels()
    {
        return [
            'file' => 'Файл',
        ];
    }


}