<?php

namespace Socket\Services;

use Ratchet\ConnectionInterface;

class Tokens extends Service
{
    protected $storages = [];
    public function handleMessage(ConnectionInterface $connection, $message)
    {
        $auth = $this->getAuth($connection);

        if ($auth && is_array($auth) && isset($auth['user_id'], $auth['token_value'])) {
            $consumerId = (int) $auth['user_id'];
            $tokenValue = $auth['token_value'];

            if ($message === "disconnectAll") {
                if ($this->storages[$consumerId] && count($this->storages[$consumerId]) > 1) {
                    $currentStorage = $this->storages[$consumerId];

                    foreach ($currentStorage as $client) {
                        if ($currentStorage[$client] !== $tokenValue) {

                            $client->send("disconnection");

                            $connectionInfo = $this->getConnectionInfo($currentStorage[$client], $consumerId);
                            $resourceId = $connectionInfo ? $connectionInfo->resourceId : null;
                            echo "{$connection->resourceId} has disconnected {$resourceId} \n";
                        }
                    }
                }
            } else {
                $requestedTokens = json_decode($message);

                if (count($requestedTokens) > 0) {
                    if (!empty($this->storages[$consumerId])) {
                        $currentStorage = $this->storages[$consumerId];

                        foreach ($requestedTokens as $requestedToken) {
                            foreach ($currentStorage as $client) {
                                if ($currentStorage[$client] === $requestedToken) {

                                    $client->send("disconnection");

                                    $connectionInfo = $this->getConnectionInfo($requestedToken, $consumerId);
                                    $resourceId = $connectionInfo ? $connectionInfo->resourceId : null;
                                    echo "{$connection->resourceId} has disconnected {$resourceId} \n";
                                }
                            }
                        }

                    }
                }
            }
        }

        $connection->close();
    }
}