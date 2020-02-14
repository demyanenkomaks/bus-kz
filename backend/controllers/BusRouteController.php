<?php

namespace backend\controllers;

use backend\models\BusRouteCoordinates;
use backend\models\BusStop;
use backend\models\BusStopRoute;
use backend\models\BusStopRouteSearch;
use backend\models\Model;
use Yii;
use backend\models\BusRoute;
use backend\models\BusRouteSearch;
use yii\helpers\ArrayHelper;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\web\Response;

/**
 * BusRouteController implements the CRUD actions for BusRoute model.
 */
class BusRouteController extends Controller
{
    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::class,
                'actions' => [
                    'delete' => ['POST'],
                ],
            ],
        ];
    }

    /**
     * Lists all BusRoute models.
     * @return mixed
     */
    public function actionIndex()
    {
        $searchModel = new BusRouteSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single BusRoute model.
     * @param integer $id
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionView($id)
    {
        $model = $this->findModel($id);

        $searchModelStraight = new BusStopRouteSearch();
        $searchModelStraight->route_id = $id;
        $searchModelStraight->direction = 1;
        $dataProviderStraight = $searchModelStraight->search(Yii::$app->request->queryParams);

        $searchModelBack = new BusStopRouteSearch();
        $searchModelBack->route_id = $id;
        $searchModelBack->direction = 2;
        $dataProviderBack = $searchModelBack->search(Yii::$app->request->queryParams);

        return $this->render('view', [
            'model' => $model,
            'dataProviderStraight' => $dataProviderStraight,
            'dataProviderBack' => $dataProviderBack,
        ]);
    }

    /**
     * Creates a new BusRoute model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new BusRoute();
        $model->time_ot = '00:00';
        $model->time_do = '00:00';

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        }

        return $this->render('create', [
            'model' => $model,
        ]);
    }

    /**
     * Updates an existing BusRoute model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);
        if (empty($model->time_ot))
            $model->time_ot = '00:00';
        if (empty($model->time_do))
            $model->time_do = '00:00';

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        }

        return $this->render('update', [
            'model' => $model,
        ]);
    }

    public function actionUpdateRoute($id, $direction)
    {
        $model = $this->findModel($id);

        return $this->render('update_route', [
            'model' => $model,
            'direction' => $direction,
        ]);
    }

    /**
     * Deletes an existing BusRoute model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        return $this->redirect(['index']);
    }

    /**
     * Finds the BusRoute model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return BusRoute the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = BusRoute::findOne($id)) !== null) {
            return $model;
        }

        throw new NotFoundHttpException('The requested page does not exist.');
    }

    public function actionCoordinatesRouteViewAjax()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if(Yii::$app->request->isAjax) {
            $data = Yii::$app->request->get();
            $id = $data['id'];
            $result = [];

            $model_coordinates = BusRoute::find()->asArray()
                ->with(['busRouteCoordinates1', 'busRouteCoordinates2'])
                ->where(['id' => $id])
                ->one();

            if (!empty($model_coordinates)) {

                if (!empty($data['direction'])) {
                    $direction = $data['direction'];

                    if ($direction == 1) {
                        $straight = $model_coordinates['busRouteCoordinates1'] ?? [];
                        $back = $model_coordinates['busRouteCoordinates2'] ?? [];
                    } elseif ($direction == 2) {
                        $straight = $model_coordinates['busRouteCoordinates2'] ?? [];
                        $back = $model_coordinates['busRouteCoordinates1'] ?? [];
                    }
                } else {
                    $straight = $model_coordinates['busRouteCoordinates1'] ?? [];
                    $back = $model_coordinates['busRouteCoordinates2'] ?? [];
                }

                if (!empty($straight)) {
                    foreach ($straight as $key => $coordinates) {
                        $result[0][$key]['lat'] = $coordinates['latitude'];
                        $result[0][$key]['lng'] = $coordinates['longitude'];
                    }
                }

                if (!empty($back)) {
                    foreach ($back as $key => $coordinates) {
                        $result[1][$key]['lat'] = $coordinates['latitude'];
                        $result[1][$key]['lng'] = $coordinates['longitude'];
                    }
                }

                return $result;
            }
        }

        return 'Connect error';
    }

    public function actionUpdateStop($id, $direction)
    {
        $model = $this->findModel($id);

        $stationList = ArrayHelper::map(BusStop::find()->asArray()->all(), 'id', function($data) {
            return $data['title'] . (!empty($data['side']) ? ' (' . $data['side'] . ')' : '');
        });

        $models_stops = BusStopRoute::find()->where(['route_id' => $id, 'direction' => $direction])->all();
        if(empty($models_stops))
            $models_stops = [new BusStopRoute()];

        if (Yii::$app->request->post()) {
            $oldIDs = ArrayHelper::map($models_stops, 'id', 'id');
            $models_stops = Model::createMultiple(BusStopRoute::class, $models_stops);

            Model::loadMultiple($models_stops, Yii::$app->request->post());
            $deletedIDs = array_diff($oldIDs, array_filter(ArrayHelper::map($models_stops, 'id', 'id')));

            foreach ($models_stops as $index => $models) {
                $models->orders = $index;
            }

            if (Model::validateMultiple($models_stops)) {
                $transaction = \Yii::$app->db->beginTransaction();
                try {
                    if (!empty($deletedIDs)) {
                        BusStopRoute::deleteAll(['id' => $deletedIDs]);
                    }
                    foreach ($models_stops as $ya) {
                        $ya->route_id = $id;
                        $ya->direction = $direction;

                        if (! ($flag = $ya->save(false))) {
                            $transaction->rollBack();
                            break;
                        }
                    }
                    if ($flag) {
                        $transaction->commit();
                        return $this->redirect(['view', 'id' => $model->id]);
                    }
                } catch (\Exception $e) {
                    $transaction->rollBack();
                }
            }

        }

        return $this->render('update_stop', [
            'model' => $model,
            'models_stops' => $models_stops,
            'stationList' => $stationList,
            'direction' => $direction,
        ]);
    }

    public function actionBusStopViewAjax()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if(Yii::$app->request->isAjax) {
            $id = Yii::$app->request->get()['id'];

            $models_stops = BusStopRoute::find()->with(['busStop'])->where(['route_id' => $id])->all();

            if (!empty($models_stops)) {
                foreach ($models_stops as $key => $stop) {
                    $result[$key]['lat'] = $stop->busStop->latitude;
                    $result[$key]['lng'] = $stop->busStop->longitude;
                    $result[$key]['title'] = $stop->busStop->title . (!empty($stop->busStop->side) ? ' (' . $stop->busStop->side . ')' : '');
                }

                return $result;
            }
        }

        return 'Connect error';
    }

    public function actionCoordinatesRouteSaveAjax()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if(Yii::$app->request->isAjax) {
            $data = Yii::$app->request->post();

            if (!empty($data)) {
                $id = $data['id'];
                $direction = $data['direction'];
                $op = $data['op'];

                if ($op == 1 || $op == 2) {
                    $transaction = Yii::$app->db->beginTransaction();
                    try {
                        if ($op == 2) {
                            BusRouteCoordinates::deleteAll(['route_id' => $id, 'direction' => $direction]);
                        }

                        if (!empty($data['coordinates'])) {
                            $ar_coordinates = json_decode($data['coordinates']);

                            foreach ($ar_coordinates as $key => $c) {
                                $model_c = new BusRouteCoordinates();
                                $model_c->route_id = $id;
                                $model_c->direction = $direction;
                                $model_c->latitude = $c->lat;
                                $model_c->longitude = $c->lng;
                                $model_c->orders = $key;

                                if (!($flag = $model_c->save(false))) {
                                    $transaction->rollBack();
                                    break;
                                }
                            }
                        }

                        if ($flag) {
                            $transaction->commit();
                            Yii::$app->session->setFlash('success', 'Данные сохранены успешно.');

                            return true;
                        }
                    } catch (\Exception $e) {
                        $transaction->rollBack();
                    }
                } elseif ($op == 3) {
                    BusRouteCoordinates::deleteAll(['route_id' => $id, 'direction' => $direction]);
                    Yii::$app->session->setFlash('success', 'Данные удалены успешно.');

                    return true;
                }
            }
        }
        return false;
    }
}