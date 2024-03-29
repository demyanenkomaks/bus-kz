<?php

namespace backend\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;
use backend\models\BusRoute;

/**
 * BusRouteSearch represents the model behind the search form of `backend\models\BusRoute`.
 */
class BusRouteSearch extends BusRoute
{
    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id', 'cost'], 'integer'],
            [['time_ot', 'time_do'], 'time'],
            [['number'], 'safe'],
            [['display'], 'boolean'],
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
        $query = BusRoute::find();

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
        $query->andFilterWhere([
            'id' => $this->id,
            'time_ot' => $this->time_ot,
            'time_do' => $this->time_do,
            'cost' => $this->cost,
            'display' => $this->display,
        ]);

        $query->andFilterWhere(['ilike', 'number', $this->number]);

        return $dataProvider;
    }
}
