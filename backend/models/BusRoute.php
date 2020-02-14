<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "bus_route".
 *
 * @property int $id
 * @property string $number
 * @property string $time_ot
 * @property string $time_do
 * @property int $cost
 * @property bool $display
 *
 * @property BusRouteCoordinates[] $busRouteCoordinates
 * @property BusStopRoute[] $busStopRoutes
 */
class BusRoute extends \yii\db\ActiveRecord
{
    public $coordinates;
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'bus_route';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['number'], 'required'],
            [['cost'], 'default', 'value' => null],
            [['time_ot', 'time_do'], 'time'],
            [['cost'], 'integer'],
            [['display'], 'boolean'],
            [['number'], 'string', 'max' => 255],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'number' => 'Номер',
            'time_ot' => 'Работает от',
            'time_do' => 'Работет до',
            'cost' => 'Стоимость',
            'display' => 'Отображать',
            'time' => 'Время работы',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBusRouteCoordinates()
    {
        return $this->hasMany(BusRouteCoordinates::class, ['route_id' => 'id']);
    }

    public function getBusRouteCoordinates1()
    {
        return $this->hasMany(BusRouteCoordinates::class, ['route_id' => 'id'])->onCondition(['direction' => 1]);
    }

    public function getBusRouteCoordinates2()
    {
        return $this->hasMany(BusRouteCoordinates::class, ['route_id' => 'id'])->onCondition(['direction' => 2]);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBusStopRoutes()
    {
        return $this->hasMany(BusStopRoute::class, ['route_id' => 'id']);
    }

    public function getBusStopRoutes1()
    {
        return $this->hasMany(BusStopRoute::class, ['route_id' => 'id'])->onCondition(['direction' => 1]);
    }

    public function getBusStopRoutes2()
    {
        return $this->hasMany(BusStopRoute::class, ['route_id' => 'id'])->onCondition(['direction' => 2]);
    }


    public function getTimeView()
    {
        return ($this->time_ot != '00:00:00' ? $this->time_ot : '') . ' - ' . ($this->time_do != '00:00:00' ? $this->time_do : '');
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBus0()
    {
        return $this->hasMany(Bus::class, ['route_id' => 'id']);
    }
}
