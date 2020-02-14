<?php

namespace backend\models;

use Yii;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "data_bus".
 *
 * @property int $id
 * @property string $retranslator
 * @property integer $d_t
 * @property string $lat
 * @property string $lng
 * @property string $course
 * @property integer $speed
 * @property integer $updated_at
 *
 * @property Bus[] $buses
 */
class DataBus extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'data_bus';
    }

    public function behaviors()
    {
        return [
            [
                'class' => TimestampBehavior::class,
                'attributes' => [
                    ActiveRecord::EVENT_BEFORE_INSERT => ['updated_at'],
                    ActiveRecord::EVENT_BEFORE_UPDATE => ['updated_at'],
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['d_t', 'lat', 'lng', 'course'], 'required'],
            [['d_t', 'speed', 'updated_at'], 'integer'],
            [['retranslator', 'lat', 'lng', 'course'], 'string', 'max' => 255],
            [['retranslator'], 'unique'],
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
            'course' => 'Course',
            'speed' => 'speed',
            'updated_at' => 'updated_at',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBuses()
    {
        return $this->hasMany(Bus::class, ['retranslator_id' => 'id']);
    }
}
