<?php
namespace App\Controllers;

use App\Model\ModelFactory;
use Core\Websocket\Websocket;
use WebSocket\Client;

class TokenController extends Controller
{
    public function create($request)
    {
        $deviceController = new DeviceController;
        $deviceInfo = $deviceController->getDeviceInfo();

        $token = new \App\Objects\Token;
        $token
            ->setConsumer($request->id)
            ->generateValue()
            ->setCreationDate()
            ->setExpirationDate()
            ->setUserAgent($_SERVER['HTTP_USER_AGENT'])
            ->setDevice($deviceInfo['platform'])
            ->setIcon($deviceInfo['isMobile'] ? 'mobile-alt' : 'desktop');

        $tokenModel = ModelFactory::getInstance('token');
        $tokenData = $tokenModel
            ->create($token->get('userAgent', 'consumer_id', 'value', 'created_at', 'exp_date', 'device', 'icon'))
            ->save();

        $token->setId($tokenData->id);
        Auth()->setToken($token);

        return $tokenData;
    }

    public function get()
    {
        Auth()->verify(true);

        $tokenModel = ModelFactory::getInstance('token');
        $tokenData = $tokenModel
            ->select('device', 'value', 'id', 'icon')
            ->where(['consumer_id' => Auth()->user()->get('id')])
            ->get();

        Response()->json(['tokenData' => $tokenData]);
    }

    /**
     * @param \StdClass|null $request
     * @param bool|null $return if set to true, the controller will return values instead of sending a Json response
     * @return void|array depending on the $return parameter;
     */
    public function clear(?\StdClass $request = new \stdClass, ?bool $return = false)
    {
        Auth()->verify(true);

        $condition = ["consumer_id" => Auth()->user()->get('id')];
        $response = [];

        $tokenModel = ModelFactory::getInstance('token');

        try {
            $pusher = Websocket::getInstance();

            if (isset($request->tokens)) {
                foreach ($request->tokens as $token) {
                    $tokenModel
                        ->delete()
                        ->where(['value' => $token])
                        ->save();
                    $pusher->trigger('bm-channel-' . $token, 'bm-session-event', '');
                }
            } else {
                $condition = [
                    'consumer_id' => Auth()->user()->get('id'),
                    ['value', '<>', Auth()->token()->get('value')]
                ];

                $tokens = $tokenModel
                    ->select('value')
                    ->where($condition)
                    ->get();

                foreach ($tokens as $token) {
                    $pusher->trigger('bm-channel-' . $token->value, 'bm-session-event', '');
                }

                $tokenModel
                    ->delete()
                    ->where($condition)
                    ->save();
            }
        } catch (\Exception $e) {
            $response['websocketException'] = $e->getMessage();
        }

        $response['success'] = true;

        if ($return) {
            return $response;
        }

        Response()->json($response);
    }
}