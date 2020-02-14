<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "data_bus_history".
 *
 * @property int $id
 * @property string $retranslator
 * @property int $d_t
 * @property string $lat
 * @property string $lng
 */
class DataBusHistory extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'data_bus_history2';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['retranslator', 'd_t', 'lat', 'lng'], 'required'],
            [['d_t'], 'default', 'value' => null],
            [['d_t'], 'integer'],
            [['retranslator', 'lat', 'lng'], 'string', 'max' => 255],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'retranslator' => 'Retranslator',
            'd_t' => 'D T',
            'lat' => 'Lat',
            'lng' => 'Lng',
        ];
    }
}
