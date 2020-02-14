<?php

namespace backend\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;
use backend\models\BusStop;

/**
 * BusStopSearch represents the model behind the search form of `backend\models\BusStop`.
 */
class BusStopSearch extends BusStop
{
    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id', 'side'], 'integer'],
            [['latitude', 'longitude', 'title'], 'safe'],
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
        $query = BusStop::find();

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
             $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
        $query->andFilterWhere([
            'id' => $this->id,
            'side' => $this->side,
        ]);

        $query->andFilterWhere(['ilike', 'latitude', $this->latitude])
            ->andFilterWhere(['ilike', 'longitude', $this->longitude])
            ->andFilterWhere(['ilike', 'title', $this->title]);

        return $dataProvider;
    }
}
