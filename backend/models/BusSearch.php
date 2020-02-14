<?php

namespace backend\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;
use backend\models\Bus;

/**
 * BusSearch represents the model behind the search form of `backend\models\Bus`.
 */
class BusSearch extends Bus
{
    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id', 'route_id', 'retranslator_id'], 'integer'],
            [['mark', 'model', 'number_sign', 'number_bus'], 'safe'],
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
        $query = Bus::find()->with(['route']);

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'sort' => [
                'defaultOrder' => ['id' => SORT_DESC]
            ]
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
            'route_id' => $this->route_id,
            'retranslator_id' => $this->retranslator_id,
        ]);

        $query->andFilterWhere(['ilike', 'mark', $this->mark])
            ->andFilterWhere(['ilike', 'model', $this->model])
            ->andFilterWhere(['ilike', 'number_sign', $this->number_sign])
            ->andFilterWhere(['ilike', 'number_bus', $this->number_bus]);

        return $dataProvider;
    }
}
