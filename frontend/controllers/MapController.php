<?php
namespace frontend\controllers;

use backend\models\Bus;
use backend\models\BusRoute;
use backend\models\BusStop;
use frontend\models\Map;
use Yii;
use yii\web\Controller;
use yii\web\Response;

/**
 * Site controller
 */
class MapController extends Controller
{
    /**
     * {@inheritdoc}
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
        ];
    }

    public function actionBusStopsAjax()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if(Yii::$app->request->isAjax) {
            return BusStop::find()->with(['route'])->asArray()->all();
        }

        return 'Connect error';
    }

    public function actionRoutesBusAjax()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if(Yii::$app->request->isAjax) {
            $modelRoute = BusRoute::find()
                ->asArray()
                ->with(['busRouteCoordinates', 'busStopRoutes', 'busStopRoutes.busStop'])
                ->where(['display' => true])
                ->orderBy(['number' => SORT_ASC])
                ->all();

            if (!empty($modelRoute)) {
                $i = 0;
                foreach ($modelRoute as $route) {
                    $numberRoute[$i]['id'] = $route['id'];
                    $numberRoute[$i]['number'] = $route['number'];
                    $numberRoute[$i]['time_ot'] = $route['time_ot'];
                    $numberRoute[$i]['time_do'] = $route['time_do'];
                    $numberRoute[$i]['cost'] = $route['cost'];

                    if (!empty($route['busRouteCoordinates'])) {
                        $direction_route = null;
                        foreach ($route['busRouteCoordinates'] as $coordinate) {
                            if ($direction_route != $coordinate['direction']) {
                                $direction_route = $coordinate['direction'];
                                $j = 0;
                            }

                            $numberRoute[$i]['coordinate'][$direction_route][$j]['lat'] = $coordinate['latitude'];
                            $numberRoute[$i]['coordinate'][$direction_route][$j]['lng'] = $coordinate['longitude'];
                            $j++;
                        }
                    }

                    if (!empty($route['busStopRoutes'])) {
                        $direction_stop = null;
                        foreach ($route['busStopRoutes'] as $stop) {
                            if ($direction_stop != $stop['direction']) {
                                $direction_stop = $stop['direction'];
                                $s = 0;
                            }

                            $numberRoute[$i]['stops'][$direction_stop][$s]['id'] = $stop['busStop']['id'];
                            $numberRoute[$i]['stops'][$direction_stop][$s]['lat'] = $stop['busStop']['latitude'];
                            $numberRoute[$i]['stops'][$direction_stop][$s]['lng'] = $stop['busStop']['longitude'];
                            $numberRoute[$i]['stops'][$direction_stop][$s]['title'] = $stop['busStop']['title'];
                            $s++;
                        }
                    }
                    $i++;
                }

                return $numberRoute;
            }
        }

        return 'Connect error';
    }

    public function actionSelectedRoutesBusAjax($num)
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if(Yii::$app->request->isAjax) {
            $result['coordinate'] = [];
            $result['stop'] = [];

            $model = BusRoute::find()->with(['busRouteCoordinates', 'busStopRoutes', 'busStopRoutes.busStop'])
                ->where(['number' => $num, 'display' => true])
                ->orderBy(['direction' => SORT_ASC])->all();


            $arrayStop = [];
            $j = 0;

            foreach ($model as $key => $one_route) {
                if (!empty($one_route->busRouteCoordinates)) {
                    $arrayCoordinates = [];
                    $i = 0;

                    foreach ($one_route->busRouteCoordinates as $coordinate) {
                        $arrayCoordinates[$i]['lat'] = $coordinate->latitude;
                        $arrayCoordinates[$i]['lng'] = $coordinate->longitude;
                        $i++;
                    }
                    $result['coordinate'][$key] = $arrayCoordinates;
                }

                if (!empty($one_route->busStopRoutes)) {
                    foreach ($one_route->busStopRoutes as $stop) {
                        $arrayStop[$j]['lat'] = $stop->busStop->latitude;
                        $arrayStop[$j]['lng'] = $stop->busStop->longitude;
                        $arrayStop[$j]['title'] = $stop->busStop->title;
                        $j++;
                    }
                    $result['stop'] += $arrayStop;
                }
            }

            return $result;
        }

        return 'Connect error';
    }


    public function actionBusAjax($route = null)
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if(Yii::$app->request->isAjax) {
            $res_ar = [];
            $model = Bus::find()->with(['dataBus0'])->joinWith(['route']);

            if (!empty($route)) {
                $model->where(['bus_route.number' => $route]);
            }

            $model = $model->asArray()->all();

            $i = 0;
            $j = 0;
            foreach ($model as $bus) {
                if (!empty($bus['route']['number']) && !empty($bus['retranslator_id']) && $bus['route']['display'] === true) {

                    if (
                        44.78406482405246 < (double)$bus['dataBus0']['lat'] || 44.780580502299856 > (double)$bus['dataBus0']['lat'] ||
                        65.54147243499757 > (double)$bus['dataBus0']['lng'] || 65.54958343505861 < (double)$bus['dataBus0']['lng']
                    ) {
                        $res_ar[$j]['id'] = $bus['id'];
                        $res_ar[$j]['route'] = $bus['route']['number'];
                        $res_ar[$j]['bus'] = (empty($bus['mark']) ? '' : $bus['mark'] . ' ') . (empty($bus['number_sign']) ? '' : 'KZ ' . $bus['number_sign'] . ' 11 ') . (empty($bus['number_bus']) ? '' : '(' . $bus['number_bus'] . ')');
                        $res_ar[$j]['lat'] = $bus['dataBus0']['lat'];
                        $res_ar[$j]['lng'] = $bus['dataBus0']['lng'];
                        $res_ar[$j]['course'] = $bus['dataBus0']['course'];

                        $j++;
                    }
                    $i++;
                }
            }

            return $res_ar;
        }

        return 'Connect error';
    }

    public function actionInfoStopAjax($id)
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if(Yii::$app->request->isAjax) {
            $speed = 34;

                $stop = BusStop::find()->asArray()
                    ->where(['id' => $id])
                    ->one();

            $route_coordinates = Yii::$app->db->createCommand('
SELECT "brc".*
    FROM "bus_stop"
    LEFT JOIN "bus_stop_route" "bsr" ON "bus_stop"."id" = "bsr"."bus_stop_id"
    LEFT JOIN "bus_route" "r" ON "bsr"."route_id" = "r"."id"
    LEFT JOIN "bus_route_coordinates" "brc" ON "r"."id" = "brc"."route_id"
    WHERE ("bsr"."direction" = "brc"."direction") AND ("bus_stop"."id"=' . $id . ')
')->queryAll();

            $arrayCoordinates = [];
            array_walk($route_coordinates, function($item, $key) use (&$arrayCoordinates) {
                $arrayCoordinates[$item['route_id']][] = $item;
            });

            $coordinatesExtremePointsToStop = Map::coordinatesExtremePointsToStop($stop, $arrayCoordinates);

            $buses = Yii::$app->db->createCommand('
SELECT "b".*, "db"."lat", "db"."lng", "br"."number"
FROM "bus_stop"
LEFT JOIN "bus_stop_route" "bsr" ON "bus_stop"."id" = "bsr"."bus_stop_id"
LEFT JOIN "bus_route" "br" ON "bsr"."route_id" = "br"."id"
LEFT JOIN "bus" "b" ON "br"."id" = "b"."route_id"
LEFT JOIN "data_bus" "db" ON "db"."id" = "b"."retranslator_id"
WHERE ("bsr"."direction" = "b"."direction") AND ("bus_stop"."id"=' . $id . ')
')->queryAll();

            $coordinatesExtremePointsToBus = Map::coordinatesExtremePointsToBus($buses, $arrayCoordinates);

            $resultTime = [];
            $q = 0;

            foreach ($coordinatesExtremePointsToBus as $bus) {
                $route_id = $bus['route_id'];
                $coordinatesStop = $coordinatesExtremePointsToStop[$route_id];
                $distance = 0;
                $orderBus = $bus['orders'];
                $orderStop = $coordinatesStop['orders'];

                if ($orderBus == $orderStop) {

                    $distance = Map::distanceCoordinates($coordinatesStop['latitude'], $coordinatesStop['longitude'], $bus['latitude'], $bus['longitude']);

                } elseif ($orderBus < $orderStop) {

                    $distance += Map::distanceCoordinates($arrayCoordinates[$route_id][$orderBus]['latitude'], $arrayCoordinates[$route_id][$orderBus]['longitude'], $bus['latitude'], $bus['longitude']);

                    for ($i = $orderBus; $i < $orderStop - 1; $i++) {
                        $distance += Map::distanceCoordinates($arrayCoordinates[$route_id][$i]['latitude'], $arrayCoordinates[$route_id][$i]['longitude'], $arrayCoordinates[$route_id][$i+1]['latitude'], $arrayCoordinates[$route_id][$i+1]['longitude']);
                    }

                    $distance += Map::distanceCoordinates($arrayCoordinates[$route_id][$orderStop]['latitude'], $arrayCoordinates[$route_id][$orderStop]['longitude'], $bus['latitude'], $bus['longitude']);

                }

                if (!empty($distance)) {
                    $time_m = ceil((60 * $distance / $speed));
                    $h = floor($time_m / 60);
                    $m = $time_m % 60;

//                    $resultTime[$q]['distance'] = $distance;
//                    $resultTime[$q]['route_id'] = $route_id;
                    $resultTime[$q]['number'] = $bus['number'];
                    $resultTime[$q]['number_sign'] = $bus['number_sign'];
                    $resultTime[$q]['time_m'] = $time_m;
                    $resultTime[$q]['h'] = $h;
                    $resultTime[$q]['m'] = $m;
                    $q++;
                }
            }

            $keys = array_column($resultTime, 'time_m');
            array_multisort($keys, SORT_ASC, $resultTime);

            $i = 0;
            $key_array = [];
            $result = [];
            foreach($resultTime as $val) {
                if (!in_array($val['number'], $key_array)) {
                    $key_array[$i] = $val['number'];
                    $result[$i] = $val;
                    $i++;
                }

            }

            return $result;
        }

        return 'Connect error';
    }
}
