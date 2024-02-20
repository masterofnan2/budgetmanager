<?php
namespace Core\Auth;

use App\Controllers\CycleController;
use App\Model\ModelFactory;
use App\Objects\Cycle;
use App\Objects\Token;
use App\Objects\User;

class Auth
{
    protected $token;
    protected $user;
    protected $settings;
    protected $cycle;

    protected static $_instance;

    public function __construct()
    {
        $this->user = new User;
        $this->token = new Token;
        $this->settings = new \stdClass;
        $this->cycle = new Cycle;

        $this->token
            ->setValue($_SERVER['HTTP_X_AUTH_TOKEN'] ?? null)
            ->setUserAgent($_SERVER['HTTP_USER_AGENT'] ?? null);
    }

    public function setToken(Token $token): Auth
    {
        $this->token = $token;
        return $this;
    }

    public function setCycle(Cycle $cycle): Auth
    {
        $this->cycle = $cycle;
        return $this;
    }

    public function setSettings(?\stdClass $settings = null): Auth
    {
        if ($settings) {
            $this->settings = $settings;
        } else {
            $this->fetchSettings();
        }

        return $this;
    }

    public static function getInstance(): Auth
    {
        if (!self::$_instance) {
            self::$_instance = new Auth;
        }

        return self::$_instance;
    }

    /**
     * Checks if a token already exists in the database and if the userAgent matches
     * @return \stdClass|bool the information of the already registered token or false
     */
    protected function getTokenData()
    {
        $tokenValue = $this->token->get('value');

        if ($tokenValue) {
            $tokenModel = ModelFactory::getInstance('token');
            $date_now_iso = UseDate()->get_iso();

            $tokenData = $tokenModel
                ->select()
                ->with('consumer')
                ->where([
                    'value' => $tokenValue,
                    ['created_at', '<=', $date_now_iso],
                    ['exp_date', '>', $date_now_iso]
                ])
                ->first();

            if ($tokenData) {
                if ($tokenData->userAgent === $this->token->get('userAgent')) {
                    return $tokenData;
                }
            }
        }

        return false;
    }

    /**
     * verifies if a token and a user agent is already registered
     * @param bool|null $aim
     */
    public function verify($aim = null)
    {
        $responseData = [];
        $this->setInstance();
        $isAuth = boolval($this->user()->get('id'));

        $responseData['authenticated'] = ($_SERVER['REQUEST_URI'] === "/api/auth/check" && !$isAuth) ? null : $isAuth;

        if ($isAuth) {
            $cycle_id = $this->cycle()->get('id');

            if (!$cycle_id) {
                $this->recycle();
            }

            $responseData['user'] = $this->user()->get('name', 'email');
            $responseData['settings'] = $this->settings();
        }

        if ($aim !== $isAuth) {
            Response()->json($responseData);
        }
    }

    protected function setInstance(): Auth
    {
        $tokenData = $this->getTokenData();

        if ($tokenData) {
            $this->user
                ->setEmail($tokenData->consumer->email)
                ->setId($tokenData->consumer->id)
                ->setName($tokenData->consumer->name)
                ->setPassword($tokenData->consumer->password);

            $this->token
                ->setId($tokenData->id)
                ->setConsumer($tokenData->consumer->id)
                ->setValue($tokenData->value)
                ->setUserAgent($tokenData->userAgent);
        }

        return $this;
    }

    public function recycle(): Auth
    {
        $cycleController = new CycleController;
        $cycleController->recycle();

        return $this;
    }

    protected function fetchCycle()
    {
        $date_now_iso = useDate()->get_iso();

        $cycleModel = ModelFactory::getInstance('cycle');
        $cycleData = $cycleModel
            ->select()
            ->where([
                'consumer_id' => $this->user->get('id'),
                ['start_date', '<=', $date_now_iso],
                ['end_date', '>', $date_now_iso]
            ])
            ->first();

        if ($cycleData) {
            $this->cycle
                ->setConsumer($this->user->get('id'))
                ->setEndDate($cycleData->end_date)
                ->setId($cycleData->id)
                ->setRenewalFrequency($cycleData->renewal_frequency_id)
                ->setStartDate($cycleData->start_date);
        }
    }

    protected function fetchSettings()
    {
        if ($this->user->get('id')) {
            $settingsModel = ModelFactory::getInstance('settings');
            $settingsData = $settingsModel
                ->select('language')
                ->with('currency')
                ->where(['consumer_id' => $this->user->get('id')])
                ->first();

            if ($settingsData) {
                $this->settings = $settingsData;
            }
        }
    }

    public function setUser(User $user): Auth
    {
        $this->user = $user;
        return $this;
    }

    public function user(): User
    {
        if (!$this->user->get('id')) {
            $this->setInstance();
        }

        return $this->user;
    }

    public function token(): Token
    {
        return $this->token;
    }

    public function settings(): \stdClass
    {
        if (!isset($this->settings->id) || !$this->settings->id) {
            $this->setSettings();
        }

        return $this->settings;
    }

    public function cycle(): Cycle
    {
        if (!$this->cycle->get('id')) {
            $this->fetchCycle();
        }

        return $this->cycle;
    }
}