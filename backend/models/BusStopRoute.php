<?php

namespace backend\models;

use Yii;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "bus_stop_route".
 *
 * @property int $route_id
 * @property int $bus_stop_id
 * @property int $orders
 * @property int $direction
 *
 * @property BusRoute $route
 * @property BusStop $busStop
 */
class BusStopRoute extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'bus_stop_route';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['bus_stop_id', 'orders'], 'required'],
            [['route_id', 'bus_stop_id'], 'default', 'value' => null],
            [['route_id', 'bus_stop_id', 'direction', 'orders'], 'integer'],
            [['route_id'], 'exist', 'skipOnError' => true, 'targetClass' => BusRoute::class, 'targetAttribute' => ['route_id' => 'id']],
            [['bus_stop_id'], 'exist', 'skipOnError' => true, 'targetClass' => BusStop::class, 'targetAttribute' => ['bus_stop_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'route_id' => 'Маршрут',
            'bus_stop_id' => 'Станция',
            'orders' => 'Порядок',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRoute()
    {
        return $this->hasOne(BusRoute::class, ['id' => 'route_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBusStop()
    {
        return $this->hasOne(BusStop::class, ['id' => 'bus_stop_id']);
    }

    public function getBusStopName()
    {
        return isset($this->busStop) ? $this->busStop->title . (!empty($this->busStop->side) ? ' (' . $this->busStop->side . ')' : '') : '';
    }

    public function getBusStopList()
    {
        return ArrayHelper::map(BusStop::find()->asArray()->all(), 'id', function($data) {
            return $data['title'] . (!empty($data['side']) ? ' (' . $data['side'] . ')' : '');
        });
    }
}
