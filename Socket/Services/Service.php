<?php
namespace Socket\Services;
use App\Model\Token;
use Ratchet\ConnectionInterface;

class Service{

    protected function getAuth(ConnectionInterface $connection): ?array
    {
        $query = $connection->httpRequest->getUri()->getQuery();
        parse_str($query, $params);

        if (isset($params['user_id'], $params['token_value'])) {
            return $params;
        }

        return null;
    }

    protected function getTokenValue(ConnectionInterface $connection): ?string
    {
        $query = $connection->httpRequest->getUri()->getQuery();
        parse_str($query, $params);

        if (!empty($params['token']) && strlen($params['token']) >= 32) {
            return $params['token'];
        }

        return null;
    }

    protected function getConnectionInfo(string $tokenValue, int $consumer_id): ?ConnectionInterface
    {
        $currentStorage = $this->storages[$consumer_id];

        foreach ($currentStorage as $client) {
            if ($currentStorage[$client] === $tokenValue) {
                return $client;
            }
        }

        return null;
    }

    protected function getConsumerId(string $tokenValue): ?int
    {
        $tokenModel = new Token;
        $tokenData = $tokenModel
            ->select('consumer_id')
            ->where(['value' => $tokenValue])
            ->first();

        if ($tokenData) {
            return (int) $tokenData->consumer_id;
        }

        return null;
    }

    public function handleOpen(ConnectionInterface $connection)
    {
        $tokenValue = $this->getTokenValue($connection);

        if ($tokenValue) {
            $consumer_id = $this->getConsumerId($tokenValue);
            if ($consumer_id) {
                if (empty($this->storages[$consumer_id])) {
                    $this->storages[$consumer_id] = new \SplObjectStorage;
                }

                $this->storages[$consumer_id]->attach($connection, $tokenValue);
                echo "{$connection->resourceId} has connected \n";
            }
        }
    }

    public function handleClose(ConnectionInterface $connection)
    {
        $tokenValue = $this->getTokenValue($connection);

        if ($tokenValue) {
            $consumer_id = $this->getConsumerId($tokenValue);

            if ($tokenValue && $consumer_id) {
                $this->storages[$consumer_id]->detach($connection);
            }
        }

        echo "{$connection->resourceId} is disconnected \n";
    }

    public function handleError(ConnectionInterface $connection, \Exception $e)
    {
        $connection->close();
    }
}