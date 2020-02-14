<?php

namespace backend\controllers;

use backend\models\BusRoute;
use backend\models\BusStopRoute;
use Yii;
use backend\models\DataBusHistory;
use backend\models\DataBusHistorySearch;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\web\Response;

/**
 * DataBusHistoryController implements the CRUD actions for DataBusHistory model.
 */
class DataBusHistoryController extends Controller
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
     * Lists all DataBusHistory models.
     * @return mixed
     */
    public function actionIndex()
    {
        $searchModel = new DataBusHistorySearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single DataBusHistory model.
     * @param integer $id
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionView($retranslator)
    {
//        $models = DataBusHistory::find()->where(['retranslator' => $retranslator])->all();

        if (empty($retranslator))
            throw new NotFoundHttpException('The requested page does not exist.');

        return $this->render('view', [
            'retranslator' => $retranslator,
        ]);
    }

    public function actionBusStopViewAjax()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if(Yii::$app->request->isAjax) {
            $models_stops = BusStopRoute::find()->with(['busStop'])->all();

            if (!empty($models_stops)) {
                foreach ($models_stops as $key => $stop) {
                    $result[$key]['lat'] = $stop->busStop->latitude;
                    $result[$key]['lng'] = $stop->busStop->longitude;
                    $result[$key]['title'] = $stop->busStop->title . (!empty($stop->busStop->side) ? ' (' . $stop->busStop->side . ')' : '');
                }

                return $result;
            }
        }

        return false;
    }

    public function actionCoordinatesRetranslatorViewAjax()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if(Yii::$app->request->isAjax) {
            $retranslator = Yii::$app->request->get()['retranslator'];

            $models = DataBusHistory::find()->asArray()
                ->where(['retranslator' => $retranslator])
                ->orderBy(['d_t' => SORT_ASC])
                ->all();

            if (!empty($models)) {

                foreach ($models as $key => $rouse) {
                    $result[$key]['lat'] = $rouse['lat'];
                    $result[$key]['lng'] = $rouse['lng'];
                }

                return $result;
            }
        }

        return false;
    }

//    /**
//     * Creates a new DataBusHistory model.
//     * If creation is successful, the browser will be redirected to the 'view' page.
//     * @return mixed
//     */
//    public function actionCreate()
//    {
//        $model = new DataBusHistory();
//
//        if ($model->load(Yii::$app->request->post()) && $model->save()) {
//            return $this->redirect(['view', 'id' => $model->id]);
//        }
//
//        return $this->render('create', [
//            'model' => $model,
//        ]);
//    }
//
//    /**
//     * Updates an existing DataBusHistory model.
//     * If update is successful, the browser will be redirected to the 'view' page.
//     * @param integer $id
//     * @return mixed
//     * @throws NotFoundHttpException if the model cannot be found
//     */
//    public function actionUpdate($id)
//    {
//        $model = $this->findModel($id);
//
//        if ($model->load(Yii::$app->request->post()) && $model->save()) {
//            return $this->redirect(['view', 'id' => $model->id]);
//        }
//
//        return $this->render('update', [
//            'model' => $model,
//        ]);
//    }
//
//    /**
//     * Deletes an existing DataBusHistory model.
//     * If deletion is successful, the browser will be redirected to the 'index' page.
//     * @param integer $id
//     * @return mixed
//     * @throws NotFoundHttpException if the model cannot be found
//     */
//    public function actionDelete($id)
//    {
//        $this->findModel($id)->delete();
//
//        return $this->redirect(['index']);
//    }
//
//    /**
//     * Finds the DataBusHistory model based on its primary key value.
//     * If the model is not found, a 404 HTTP exception will be thrown.
//     * @param integer $id
//     * @return DataBusHistory the loaded model
//     * @throws NotFoundHttpException if the model cannot be found
//     */
//    protected function findModel($id)
//    {
//        if (($model = DataBusHistory::findOne($id)) !== null) {
//            return $model;
//        }
//
//        throw new NotFoundHttpException('The requested page does not exist.');
//    }
}
