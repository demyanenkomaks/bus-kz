<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "bus_to_route".
 *
 * @property int $route_id
 * @property int $bus_id
 *
 * @property Bus $bus
 * @property BusRoute $route
 */
class BusToRoute extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'bus_to_route';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['route_id', 'bus_id'], 'required'],
            [['route_id', 'bus_id'], 'default', 'value' => null],
            [['route_id', 'bus_id'], 'integer'],
            [['bus_id'], 'exist', 'skipOnError' => true, 'targetClass' => Bus::className(), 'targetAttribute' => ['bus_id' => 'id']],
            [['route_id'], 'exist', 'skipOnError' => true, 'targetClass' => BusRoute::className(), 'targetAttribute' => ['route_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'route_id' => 'Route ID',
            'bus_id' => 'Bus ID',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBus()
    {
        return $this->hasOne(Bus::className(), ['id' => 'bus_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRoute()
    {
        return $this->hasOne(BusRoute::className(), ['id' => 'route_id']);
    }
}
