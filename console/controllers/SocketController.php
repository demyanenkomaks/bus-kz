<?php
namespace console\controllers;

use backend\models\Bus;
use backend\models\DataBus;
use backend\models\DataBusHistory;
use Yii;
use yii\console\Controller;


class SocketController extends Controller
{

    public function actionListen()
    {
        error_reporting(-1);
        set_time_limit(0);

        $address = '192.168.0.116';
        $port = 8081;

        $sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        @socket_bind($sock, $address, $port) or die("Could not bind to socket\n");
        socket_listen($sock, 150) or die("Could not set up socket listener\n");

        $clients = [];
        $retranslator = [];

        do {
            $read = [];
            $read[] = $sock;

            $read = array_merge($read,$clients);

            $write = NULL;
            $except = NULL;
            $tv_sec = 5;

            if(socket_select($read, $write, $except, $tv_sec) < 1)
            {
                continue;
            }

            if (in_array($sock, $read)) {
                if (($msgsock = socket_accept($sock)) === false) {
                    break;
                }
                $clients[] = $msgsock;
            }

            foreach ($clients as $key => $client) {
                if (in_array($client, $read)) {
                    if (false === ($buf = @socket_read($client, 2048, PHP_NORMAL_READ))) {
                        unset($clients[$key]);
                        unset($retranslator[$key]);

                        break;
                    }

                    if (!$buf = trim($buf)) {
                        continue;
                    }

                    if (strpos($buf, '#L#') !== false) {
                        $retranslator[$key] = strstr(substr($buf, 3), ';', true);
                    }

                    if (strpos($buf, '#D#') !== false) {
                        $line = substr($buf, 3);
                        $arr = explode(";", $line);

                        if (!empty($arr[0]) && !empty($arr[1]) && !empty($arr[2]) && $arr[2] != 'NA' && !empty($arr[4]) && $arr[4] != 'NA' && !empty($arr[7]) && $arr[7] != 'NA') {

                            $model = DataBus::find()->where(['retranslator' => $retranslator[$key]])->one();

                            $d_t_create = \DateTime::createFromFormat('dmyHis', $arr[0] . $arr[1]);
                            $d_t = $d_t_create->getTimestamp();

                            $lat = self::nmeaCoordinatesToDouble($arr[2]);
                            $lng = self::nmeaCoordinatesToDouble($arr[4]);

                            if (empty($model)) {
                                $model = new DataBus();

                                $model->retranslator = $retranslator[$key];
                                $model->d_t = $d_t;
                                $model->lat = (string)$lat;
                                $model->lng = (string)$lng;
                                $model->speed = (integer)$arr[6];
                                $model->course = $arr[7];

                                $model->save();
                            } else {
                                if ($d_t > $model->d_t) {
                                    $model->d_t = $d_t;
                                    $model->lat = (string)$lat;
                                    $model->lng = (string)$lng;
                                    $model->speed = (integer)$arr[6];
                                    $model->course = $arr[7];

                                    $model->save();
                                }
                            }

                            $model_bus = Bus::find()
                                ->with(['route', 'route.busRouteCoordinates1', 'route.busRouteCoordinates2'])
                                ->where(['retranslator_id' => $model->id])->one();

                            if (!empty($model_bus) && !empty($model_bus->route)) {
                                $plus = 0.001;

//                                latitude
//                                longitude

                                if (!empty($model_bus->route->busRouteCoordinates1)) {
                                    if (
                                        ($model_bus->route->busRouteCoordinates1[0]->longitude + $plus) > $lng
                                        && ($model_bus->route->busRouteCoordinates1[0]->longitude - $plus) < $lng
                                        && ($model_bus->route->busRouteCoordinates1[0]->latitude + $plus) > $lat
                                        && ($model_bus->route->busRouteCoordinates1[0]->latitude - $plus) < $lat
                                    ) {
                                        $model_bus->direction = 1;
                                        $model_bus->save();
                                    }
                                }

                                if (!empty($model_bus->route->busRouteCoordinates2)) {
                                    if (
                                        ($model_bus->route->busRouteCoordinates2[0]->longitude + $plus) > $lng
                                        && ($model_bus->route->busRouteCoordinates2[0]->longitude - $plus) < $lng
                                        && ($model_bus->route->busRouteCoordinates2[0]->latitude + $plus) > $lat
                                        && ($model_bus->route->busRouteCoordinates2[0]->latitude - $plus) < $lat
                                    ) {
                                        $model_bus->direction = 2;
                                        $model_bus->save();
                                    }
                                }
                            }

//                            // История автобусов
//                            $model = new DataBusHistory();
//
//                            $model->retranslator = $retranslator[$key];
//                            $model->d_t = $d_t;
//                            $model->lat = (string)$lat;
//                            $model->lng = (string)$lng;
//
//                            $model->save();

                        }
                    }
                }
            }

        } while (true);

        echo "exit";

        socket_close($sock);
    }

    static public function nmeaCoordinatesToDouble($nmeagps)
    {
        $nmeagps = (float)$nmeagps;
        $intDeg = (int)($nmeagps/100);
        $result = $intDeg + ($nmeagps - 100*$intDeg)/60;

        return $result;
    }

    static public function doubleCoordinatesToNmea($coord)
    {
        return floor($coord) * 100 + ($coord - floor($coord)) * 60;
    }

}