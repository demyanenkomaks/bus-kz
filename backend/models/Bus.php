<?php

namespace backend\models;

use Yii;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "bus".
 *
 * @property int $id
 * @property string $mark
 * @property string $model
 * @property string $number_sign
 * @property string $number_bus
 * @property string $retranslator_id
 * @property int $route_id
 * @property int $direction
 *
 * @property BusRoute $route
 */
class Bus extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'bus';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['mark'], 'required'],
            [['route_id'], 'default', 'value' => null],
            [['route_id', 'retranslator_id', 'direction'], 'integer'],
            [['mark', 'model', 'number_sign', 'number_bus'], 'string', 'max' => 255],
            [['route_id'], 'exist', 'skipOnError' => true, 'targetClass' => BusRoute::class, 'targetAttribute' => ['route_id' => 'id']],
            [['retranslator_id'], 'unique']
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'mark' => 'Марка',
            'model' => 'Модель',
            'number_sign' => 'Номерной знак',
            'number_bus' => 'Номер в автобусном парке',
            'retranslator_id' => 'Retranslator',
            'route_id' => 'Маршрут',
            'direction' => 'Направление',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRoute()
    {
        return $this->hasOne(BusRoute::class, ['id' => 'route_id']);
    }

    public function getRouteName()
    {
        return !empty($this->route) ? $this->route->number : '';
    }

    public function getRouteList()
    {
        return ArrayHelper::map(BusRoute::find()->asArray()->where(['display' => true])->all(), 'id', 'number');
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getDataBus0()
    {
        return $this->hasOne(DataBus::class, ['id' => 'retranslator_id']);
    }

    public function getDataBusName()
    {
        return !empty($this->dataBus0) ? $this->dataBus0->retranslator : '';
    }

    public function getDataBusList()
    {
        return ArrayHelper::map(DataBus::find()->asArray()->all(), 'id', 'retranslator');
    }

    public function getDataBusListForm()
    {
        $data_buses = DataBus::find()->with(['buses'])->asArray()->all();
        foreach ($data_buses as $data) {
            if (empty($data['buses']) || $data['id'] == $this->retranslator_id) {
                $result[$data['id']] = $data['retranslator'];
            }
        }

        return $result;
    }

    public function getBusViewName()
    {
        return (empty($this->number_bus) ? '' : '(' . $this->number_bus . ') ') . (empty($this->mark) ? '' : $this->mark . ' ') . (empty($this->model) ? '' : $this->model . ' ') . (empty($this->number_sign) ? '' : ' №' . $this->number_sign);
    }

    public function getRetranslatorDate()
    {
        return !empty($this->dataBus0) ? $this->dataBus0->d_t : '';
    }

    public function getRetranslatorUpdated()
    {
        return !empty($this->dataBus0) ? $this->dataBus0->updated_at : '';
    }
}
