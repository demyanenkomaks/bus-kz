<?php
namespace backend\controllers;


use backend\models\Bus;
use backend\models\BusRoute;
use yii\filters\VerbFilter;
use yii\web\Controller;
use backend\models\UploadForm;
use Yii;
use yii\web\UploadedFile;
use PhpOffice\PhpSpreadsheet\IOFactory;


/**
 * SpWagonFactoryController implements the CRUD actions for SpWagonFactory model.
 */
class ParsController extends Controller
{
    /**
     * @inheritdoc
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
     * Lists all SpWagonFactory models.
     * @return mixed
     */
    public function actionIndex()
    {
        $model = new UploadForm();

        if (Yii::$app->request->isPost) {
            if (!is_null(Yii::$app->request->post('restart'))) {
                Bus::updateAll(['route_id' => NULL, 'direction' => NULL]);

                Yii::$app->session->setFlash('success', 'Автобусы убраны с маршрутов');
            }

            if (!is_null(Yii::$app->request->post('pars'))) {
                $model->file = UploadedFile::getInstances($model, 'file');
                if ($model->file && $model->validate()) {

                    foreach ($model->file as $file) {
                        $spreadsheet = IOFactory::load($file->tempName);
                        $sheet = $spreadsheet->getActiveSheet();

                        $numRoute = preg_replace("/[^0-9]/", '', $sheet->getCell('E4')->getValue());

                        $modelRoute = BusRoute::find()->where(['number' => $numRoute])->one();

                        if (!empty($modelRoute)) {

                            $transaction = \Yii::$app->db->beginTransaction();
                            try {

                                $row = 8;
                                while ($row < $sheet->getHighestRow()) {
                                    $numBus = $sheet->getCell('B'.$row)->getValue();

                                    $numBus = str_ireplace("В", "b", $numBus);
                                    $numBus = str_ireplace("А", "a", $numBus);
                                    $numBus = str_ireplace("Р", "p", $numBus);

                                    if (!empty($numBus)) {
                                        $modelBus = Bus::find()->where(['ilike', 'number_sign', $numBus])->all();

                                        if (!empty($modelBus)) {
                                            if (count($modelBus) == 1) {
                                                $modelBus[0]->route_id = $modelRoute->id;

                                                if (!($tr = $modelBus[0]->save(false))) {
                                                    $transaction->rollBack();
                                                    break;
                                                }
                                            } else {
                                                Yii::$app->session->addFlash('warning', 'Автобус под номером "' . $numBus . '" в базе больше одного (файл: ' . $file->name . ', ячейка: ' . 'B'.$row . ')' );
                                            }

                                        } else {
                                            Yii::$app->session->addFlash('warning', 'Автобуса под номером "' . $numBus . '" нет в базе (файл: ' . $file->name . ', ячейка: ' . 'B'.$row . ')' );
                                        }
                                    }

                                    $row++;
                                }

                                if ($tr) {
                                    $transaction->commit();
                                }
                            } catch (\Exception $e) {
                                $transaction->rollBack();
                            }

                        } else {
                            Yii::$app->session->addFlash('error', 'Маршрута под номером "' . $numRoute . '" нет в базе (файл: ' . $file->name . ')' );
                        }
                    }
                }
            }
        }

        return $this->render('index', [
            'model' => $model,
        ]);
    }

}
