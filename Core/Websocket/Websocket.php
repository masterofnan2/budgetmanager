<?php

namespace Core\Websocket;

use Pusher\Pusher;

class Websocket
{
    private static $app_id = 1701174;
    private static $app_key = "c97985bd23ed4a081ca8";
    private static $app_secret = "55faa6f343c048383b83";
    private static $cluster = "ap2";

    protected static $Pusher;


    public static function getInstance(): Pusher
    {
        if (!self::$Pusher) {
            self::$Pusher = new Pusher(self::$app_key, self::$app_secret, self::$app_id, [
                'cluster' => self::$cluster
            ]);
        }

        return self::$Pusher;
    }
}