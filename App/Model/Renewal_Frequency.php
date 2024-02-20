<?php
namespace App\Model;

class Renewal_Frequency extends Model
{
    protected static $_instance;
    public static function getInstance(): Renewal_Frequency
    {
        if (!self::$_instance) {
            self::$_instance = new Renewal_Frequency;
        }

        return self::$_instance;
    }
}