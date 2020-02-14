<?php

namespace backend\models;

use Yii;
use yii\helpers\Html;

/**
 * This is the model class for table "bus_stop".
 *
 * @property int $id
 * @property string $latitude
 * @property string $longitude
 * @property string $title
 * @property int $side
 */
class BusStop extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'bus_stop';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['latitude', 'longitude', 'title'], 'required'],
            [['side'], 'default', 'value' => null],
            [['side'], 'integer'],
            [['latitude', 'longitude', 'title'], 'string', 'max' => 255],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'latitude' => 'Широта',
            'longitude' => 'Долгота',
            'title' => 'Название',
            'side' => 'Идентификатор стороны',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBusStopRoutes()
    {
        return $this->hasMany(BusStopRoute::class, ['bus_stop_id' => 'id']);
    }

    public function getRoute()
    {
        return $this->hasMany(BusRoute::class, ['id' => 'route_id'])->onCondition(['display' => true])
            ->via('busStopRoutes');
    }

    public function getViewUrlStop()
    {
        return Html::a('Перейти', '/site/info-stop?id=' . $this->id, ['class' => 'label label-primary', 'target' => '_blank']);
//        return '<a href="user/view?id=' . $this->id . '" class="label label-primary" target="_blank">Перейти</a>';
    }
}
