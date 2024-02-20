<?php
namespace App\Model;

class Consumer_Notification extends Model
{
    protected static $_instance;

    public function __construct()
    {
        $this->belongsTo('consumer', 'notification');
        parent::__construct();
    }

    public static function getInstance(): Consumer_Notification
    {
        if (!self::$_instance) {
            self::$_instance = new Consumer_Notification;
        }

        return self::$_instance;
    }
}