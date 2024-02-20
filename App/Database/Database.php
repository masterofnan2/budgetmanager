<?php
namespace App\Database;

class Database
{
    private static $username;
    private static $password;
    private static $dbname;
    private static $host;
    private static $pdo;

    private static function init()
    {
        $databaseData = parse_ini_file(dirname(__DIR__, 2) . '/.env');

        self::$dbname = $databaseData['DBNAME'];
        self::$host = $databaseData['DBHOST'];
        self::$username = $databaseData['USERNAME'];
        self::$password = $databaseData['PASSWORD'];
    }

    public static function connect(): \PDO
    {
        if (!self::$pdo) {
            self::init();
            try {
                $pdo = new \PDO(
                    'mysql:dbname=' . self::$dbname . ';host=' . self::$host,
                    self::$username,
                    self::$password,
                    [
                        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
                    ]
                );
                self::$pdo = $pdo;
            } catch (\PDOException $e) {

            }
        }

        return self::$pdo;
    }

    public static function getDbname(): string
    {
        return self::$dbname;
    }
}