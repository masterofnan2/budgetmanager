<?php

$env = parse_ini_file(dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . ".env");

$debugMode = $env['DEBUG'];

if (boolval($debugMode)) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
}

header("Access-Control-Allow-Origin: {$env['ALLOW_ORIGINS']}");
header("Access-Control-Allow-Methods: {$env['ALLOW_METHODS']}");
header("Access-Control-Allow-Headers: {$env['ALLOW_HEADERS']}");
header("Access-Control-Allow-Credentials: {$env['ALLOW_CREDENTIALS']}");

const APP_WEBSOCKET_URL = "ws://localhost:8080";
const UNUSED_PATH_LENGTH = 2;