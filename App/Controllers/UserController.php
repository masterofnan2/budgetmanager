<?php

namespace App\Controllers;

use App\Model\ModelFactory;
use App\Objects\User;
use Core\Validator\UserValidator;

class UserController extends Controller
{
    public function update($request)
    {
        Auth()->verify(true);

        $currentUser = Auth()->user();
        $newUser = new User;
        $newUser
            ->setId($currentUser->get('id'))
            ->setEmail($request->email ?? $currentUser->get('email'))
            ->setPassword($request->currentPassword ?? $currentUser->get('password'))
            ->setName($request->name ?? $currentUser->get('name'));

        $changes = array_keys(array_diff($newUser->get(), $currentUser->get()));

        if (!empty($changes)) {
            $validator = new UserValidator($newUser);
            $validationErrors = $validator
                ->update()
                ->errors()
                ->messages($changes);

            if (!empty($validationErrors['password'])) {
                $validationErrors['currentPassword'] = $validationErrors['password'];
                unset($validationErrors['password']);
            }

            if (isset($request->newPassword)) {
                $newUser
                    ->setPassword($request->newPassword);

                $validator = new UserValidator($newUser);
                $newPasswordError = $validator
                    ->errors()
                    ->messages('password');

                if (!empty($newPasswordError)) {
                    $validationErrors['password'] = $newPasswordError['password'];
                } else {
                    $newUser
                        ->setPassword(password_hash($newUser->get('password'), PASSWORD_DEFAULT));
                }
            }

            if (!empty($validationErrors)) {
                Response()->json(['errors' => $validationErrors]);
            }

            if (array_search('name', $changes) !== false) {
                $newUser->setName(ucfirst($newUser->get('name')));
            }

            if (array_search('password', $changes) !== false || array_search('email', $changes) !== false) {
                $tokenController = new TokenController;
                $tokenController->clear(null, true);
            }

            $consumerModel = ModelFactory::getInstance('consumer');

            Response()->json([
                'success' => $consumerModel
                    ->update($newUser->get('name', 'email', 'password'))
                    ->where(['id' => $currentUser->get('id')])
                    ->save()
            ]);
        } else {
            Response()->json([
                'success' => true
            ]);
        }
    }

    public function create($request): \stdClass
    {
        $user = new User;
        $user
            ->setEmail($request->email)
            ->setPassword($request->password)
            ->setName(strtolower($request->name));

        $signupValidator = new UserValidator($user);
        $validationErrors = $signupValidator
            ->signup()
            ->errors()
            ->messages('name', 'email', 'password');

        if (!empty($validationErrors)) {
            Response()->json(['errors' => $validationErrors]);
        }

        $user
            ->setPassword(password_hash($user->get('password'), PASSWORD_DEFAULT))
            ->setName(ucfirst($user->get('name')));

        $consumerModel = ModelFactory::getInstance('consumer');
        $consumerData = $consumerModel
            ->create($user->get('name', 'email', 'password'))
            ->save();

        $user->setId($consumerData->id);
        Auth()->setUser($user);
        
        return $consumerData;
    }
}