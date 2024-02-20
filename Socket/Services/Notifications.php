<?php
namespace Socket\Services;

use Ratchet\ConnectionInterface;

class Notifications extends Service
{
    protected $storages = [];
    
    public function handleMessage(ConnectionInterface $connection, $message)
    {
        if ($message === "refresh") {
            $auth = $this->getAuth($connection);
            if ($auth && is_array($auth) && isset($auth['token_value'], $auth['user_id'])) {
                $consumerId = $auth['user_id'];
                if (!empty($this->storages[$consumerId]) && count($this->storages[$consumerId]) > 0) {
                    $currentStorage = $this->storages[$consumerId];
                    
                    foreach ($currentStorage as $client) {
                        $client->send($message);
                    }

                    if (!$currentStorage) {
                        unset($currentStorage);
                    }
                }
            }
        }

        $connection->close();
    }
}