<?php

namespace backend\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;
use backend\models\DataBusHistory;

/**
 * DataBusHistorySearch represents the model behind the search form of `backend\models\DataBusHistory`.
 */
class DataBusHistorySearch extends DataBusHistory
{
    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id', 'd_t'], 'integer'],
            [['retranslator', 'lat', 'lng'], 'safe'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $data_bus_history = DataBusHistory::getTableSchema()->name;

        $query = DataBusHistory::find()
            ->select([$data_bus_history.'.retranslator', 'bus.id'])
            ->distinct([$data_bus_history.'.retranslator'])
            ->leftJoin('data_bus', 'data_bus.retranslator = '.$data_bus_history.'.retranslator')
            ->leftJoin('bus', 'bus.retranslator_id = data_bus.id');

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
//        $query->andFilterWhere([
//        ]);

        $query->andFilterWhere(['ilike', $data_bus_history.'.retranslator', $this->retranslator]);

        return $dataProvider;
    }
}
