<?php

namespace App\Model;

class ModelFactory
{
    public static $models = [];

    public static function getInstance($model): Model
    {
        $modelName = ucfirst(strtolower($model));
        $modelClass = "\\App\\Model\\" . $modelName;

        if(!isset(self::$models[$modelName]) || empty(self::$models[$modelName])){
            self::$models[$modelName] = new $modelClass;
        }
        
        return self::$models[$modelName];
    }
}