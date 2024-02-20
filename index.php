<?php

session_start();

require __DIR__ . '/Core/etc/scripts.php';
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/Core/etc/tools.php';

try {
    $request = json_decode(file_get_contents('php://input'));

    if (!isset($_SERVER['HTTP_X_AUTH_TOKEN'])) {
        throw new Exception("Security concern, this action has been blocked", 1);
    }

    $query = parse_url($_SERVER['REQUEST_URI']);
    $pathInfoArray = explode('/', $query['path']);
    $controllerMethod = null;
    $controllerName = null;
    $pathToController = 'App\Controllers';

    for ($i = UNUSED_PATH_LENGTH; $i < count($pathInfoArray); $i++) {
        switch ($i) {
            case count($pathInfoArray) - 1:
                $controllerMethod = $pathInfoArray[$i];
                break;

            case count($pathInfoArray) - 2:
                $controllerName = ucfirst($pathInfoArray[$i]) . 'Controller';
                $pathToController .= '\\' . $controllerName;
                break;

            default:
                $pathToController .= '\\' . ucfirst($pathInfoArray[$i]);
                break;
        }
    }


    if (class_exists($pathToController)) {
        if (method_exists($pathToController, $controllerMethod)) {
            $currentController = new $pathToController;
            $currentController->$controllerMethod($request);
        } else {
            throw new \Exception("unkown method '{$controllerMethod}' in {$controllerName}", 1);
        }
    }

    throw new \Exception(" undefined controller : '{$controllerMethod}' in '{$pathToController}'");

} catch (\Exception $e) {
    Response()->json([
        'exception' => $e->getMessage()
    ]);
}