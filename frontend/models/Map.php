<?php

namespace frontend\models;


class Map
{
    /** Расстояние между точками координат */
    public static function distanceCoordinates($lat1, $lng1, $lat2, $lng2) {

        $theta = $lng1 - $lng2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $km = $dist * 60 * 1.1515 * 1.609344;

        return $km;
    }

    /**  Расчет коефициента */
    public function calculateCoefficient($latP, $lngP, $lat1, $lng1, $lat2, $lng2) {
        $latP = (double)$latP;
        $lngP = (double)$lngP;
        $lat1 = (double)$lat1;
        $lng1 = (double)$lng1;
        $lat2 = (double)$lat2;
        $lng2 = (double)$lng2;
        $line = self::distanceCoordinates($lat1, $lng1, $lat2, $lng2);
        $oneLine = self::distanceCoordinates($latP, $lngP, $lat1, $lng1);
        $twoLine = self::distanceCoordinates($latP, $lngP, $lat2, $lng2);

        $coefficient = $oneLine + $twoLine - $line;
        return $coefficient;
    }

    /** Координаты ближайшей точки маршрута к остановкам */
    public function coordinatesExtremePointsToStop($stop, $arrayCoordinates) {
        $arrayResultStop = [];
        foreach ($arrayCoordinates as $key => $coordinate) {
            for ($i = 0; $i < count($coordinate) - 1; $i++) {
                $arrayResultStop[$key][$i]['coef'] = self::calculateCoefficient($stop['latitude'], $stop['longitude'], $coordinate[$i]['latitude'], $coordinate[$i]['longitude'], $coordinate[$i+1]['latitude'], $coordinate[$i+1]['longitude']);
                $arrayResultStop[$key][$i]['orders'] = $coordinate[$i]['orders'];
                $arrayResultStop[$key][$i]['latitude'] = $stop['latitude'];
                $arrayResultStop[$key][$i]['longitude'] = $stop['longitude'];
            }

            usort($arrayResultStop[$key], function ($item1, $item2) {
                return $item1['coef'] <=> $item2['coef'];
            });

            $arrayResultStop[$key] = $arrayResultStop[$key][0];
        }
        return $arrayResultStop;
    }

    /** Координаты ближайшей точки маршрута к автобусам */
    public function coordinatesExtremePointsToBus($buses, $arrayCoordinates) {
        $coordinatesBus = [];
        $result = [];
        foreach ($buses as $key => $bus) {
            $coordinate = $arrayCoordinates[$bus['route_id']];
            for ($i = 0; $i < count($coordinate) - 1; $i++) {
                $coordinatesBus[$key][$i]['coef'] = Map::calculateCoefficient($bus['lat'], $bus['lng'], $coordinate[$i]['latitude'], $coordinate[$i]['longitude'], $coordinate[$i+1]['latitude'], $coordinate[$i+1]['longitude']);
                $coordinatesBus[$key][$i]['orders'] = $coordinate[$i]['orders'];
                $coordinatesBus[$key][$i]['route_id'] = $bus['route_id'];
                $coordinatesBus[$key][$i]['number'] = $bus['number'];
                $coordinatesBus[$key][$i]['number_sign'] = $bus['number_sign'];
                $coordinatesBus[$key][$i]['latitude'] = $bus['lat'];
                $coordinatesBus[$key][$i]['longitude'] = $bus['lng'];
            }

            usort($coordinatesBus[$key], function ($item1, $item2) {
                return $item1['coef'] <=> $item2['coef'];
            });

            if ($coordinatesBus[$key][0]['coef'] < 0.1)
                $result[$key] = $coordinatesBus[$key][0];
        }
        return $result;
    }

}