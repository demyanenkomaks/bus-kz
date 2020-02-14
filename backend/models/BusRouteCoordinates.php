<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "bus_route_coordinates".
 *
 * @property int $route_id
 * @property int $direction
 * @property string $latitude
 * @property string $longitude
 * @property int $orders
 *
 * @property BusRoute $route
 */
class BusRouteCoordinates extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'bus_route_coordinates';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['route_id', 'direction', 'latitude', 'longitude'], 'required'],
            [['route_id'], 'default', 'value' => null],
            [['route_id', 'direction', 'orders'], 'integer'],
            [['latitude', 'longitude'], 'string', 'max' => 255],
            [['route_id'], 'exist', 'skipOnError' => true, 'targetClass' => BusRoute::class, 'targetAttribute' => ['route_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'route_id' => 'Route ID',
            'latitude' => 'Latitude',
            'longitude' => 'Longitude',
            'orders' => 'orders',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRoute()
    {
        return $this->hasOne(BusRoute::class, ['id' => 'route_id']);
    }
}
