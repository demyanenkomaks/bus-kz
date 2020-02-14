<?php

/**
 * Debug function
 * debug($var);
 */
function debug($var,$caller=null)
{
//    if(!isset($caller)){
//        $caller = array_shift(debug_backtrace(1));
//    }
    echo '<code>File: '.$caller['file'].' / Line: '.$caller['line'].'</code>';
    echo '<pre>';
    yii\helpers\VarDumper::dump($var, 10, true);
    echo '</pre>';
}

/**
 * Debug function with die() after
 * dd($var);
 */
function dd($var)
{
    $caller = array_shift(debug_backtrace(1));
    debug($var,$caller);
    die();
}