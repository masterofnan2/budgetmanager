<?php

namespace App\Controllers;

use App\Model\ModelFactory;
use App\Objects\Token;
use Core\Validator\UserValidator;
use App\Objects\User;

class AuthController extends Controller
{
    public function login($request)
    {
        Auth()->verify(false);

        $user = new User;
        $user->setEmail($request->email)
            ->setPassword($request->password);

        $LoginValidator = new UserValidator($user);
        $validationErrors = $LoginValidator
            ->login()
            ->errors()
            ->messages('email', 'password');

        if (!empty($validationErrors)) {
            Response()->json(['errors' => $validationErrors]);
        }

        $consumerModel = ModelFactory::getInstance('consumer');
        $consumerData = $consumerModel
            ->select()
            ->where(['email' => $user->get('email')])
            ->first();

        $user
            ->setId($consumerData->id)
            ->setName($consumerData->name);

        Auth()->setUser($user);

        $date_now_iso = UseDate()->get_iso();

        $tokenModel = ModelFactory::getInstance('token');
        $userToken = $tokenModel
            ->select('id', 'value', 'userAgent')
            ->where([
                'consumer_id' => $consumerData->id,
                ['created_at', '<=', $date_now_iso],
                ['exp_date', '>', $date_now_iso]
            ])
            ->first();

        if (!$userToken || $userToken->userAgent !== $_SERVER['HTTP_USER_AGENT']) {
            $tokenController = new TokenController;
            $tokenController->create($consumerData);
        } else {
            $token = new Token;
            $token
                ->setId($userToken->id)
                ->setValue($userToken->value);

            Auth()->setToken($token);
        }

        if (!Auth()->cycle()->get('id')) {
            Auth()->recycle();
        }

        Response()->json([
            'user' => Auth()->user()->get('name', 'email'),
            'token' => Auth()->token()->get('id', 'value'),
            'settings' => Auth()->settings()
        ]);
    }

    public function signup($request)
    {
        Auth()->verify(false);

        $userController = new UserController;
        $consumerData = $userController->create($request);

        $tokenController = new TokenController;
        $tokenController->create($consumerData);

        $cycleController = new CycleController;
        $cycleController->create();

        $defaultCategoryController = new DefaultCategoryController;
        $defaultCategoryController->create();

        $budgetController = new BudgetController;
        $budgetController->create();

        $settingsController = new SettingsController;
        $settingsController->create();

        $notificationsController = new NotificationsController;
        $notificationsController->push(1);

        Response()->json([
            'user' => Auth()->user()->get('name', 'email'),
            'token' => Auth()->token()->get('value', 'userAgent'),
            'settings' => Auth()->settings()
        ]);
    }

    public function check()
    {
        Auth()->verify();
    }
}