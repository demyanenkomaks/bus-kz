<?php
namespace console\controllers;

use backend\models\DataBus;
use Yii;
use yii\console\Controller;

class ParsController extends Controller
{

    public function actionGo()
    {
        $path = Yii::getAlias('@console/controllers/');

        $file = fopen($path . 'file.txt', 'r');

        $res_arr = [];

        while(!feof($file))  {
            $result = fgets($file);

            if (strpos($result, '#L#') !== false) {
                $retranslator = strstr(substr($result, 3), ';', true);

                $model = DataBus::find()->where(['retranslator' => $retranslator])->one();

                if (!empty($model)) {
                    $model = new DataBus();
                    $model->retranslator = $retranslator;
                }

                $i = 0;
            }

            if (strpos($result, '#D#') !== false) {
                $line = substr($result, 3);
                $arr = explode(";", $line);


                if (!empty($arr[0]) && !empty($arr[1]) && !empty($arr[2]) && !empty($arr[4]) && !empty($arr[7])) {

                    $d_t = \DateTime::createFromFormat('dmyHis', $arr[0] . $arr[1]);
                    $res_arr[$i]['d_t'] = $d_t->getTimestamp();
                    $res_arr[$i]['lat'] = $arr[2];
                    $res_arr[$i]['lng'] = $arr[4];
                    $res_arr[$i]['course'] = $arr[7];
                }

                $i++;
            }
        }

        print_r($res_arr);

        fclose($file);
    }

    //self::nmeaCoordinatesToDouble($arr[2]);
    static public function nmeaCoordinatesToDouble($nmeagps)
    {
        $intDeg = (int) ($nmeagps/100);
        $result = $intDeg + ($nmeagps - 100*$intDeg)/60;

        return $result;
    }

    static public function doubleCoordinatesToNmea($coord)
    {
        return floor($coord) * 100 + ($coord - floor($coord)) * 60;
    }

}