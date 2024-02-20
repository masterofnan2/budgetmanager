<?php

namespace Socket;

use Ratchet\MessageComponentInterface;

class WebsocketController implements MessageComponentInterface
{
    private $services = [];

    private function getService($connection)
    {
        $uri = $connection->httpRequest->getUri();
        $service = ucfirst(str_replace('/', '', $uri->getPath()));

        return $service;
    }

    public function onOpen(\Ratchet\ConnectionInterface $connection)
    {
        $service = $this->getService($connection);

        if (empty($this->services[$service])) {
            $serviceClass = "\\Socket\Services\\$service";

            if (class_exists($serviceClass)) {
                $this->services[$service] = new $serviceClass;
            } else {
                echo "class {$serviceClass} does not exist";
            }
        }

        $this
            ->services[$service]
            ->handleOpen($connection);
    }

    public function onClose(\Ratchet\ConnectionInterface $connection)
    {
        $service = $this->getService($connection);
        $this->services[$service]->handleClose($connection);
    }

    public function onMessage(\Ratchet\ConnectionInterface $connection, $message)
    {
        $service = $this->getService($connection);
        $this->services[$service]->handleMessage($connection, $message);
    }

    public function onError(\Ratchet\ConnectionInterface $connection, \Exception $e)
    {
        $service = $this->getService($connection);
        $this->services[$service]->handleError($connection, $e);
    }
}