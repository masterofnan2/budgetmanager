<?php
namespace Core\Validator;
use App\Model\ModelFactory;


class UserValidator extends Validator
{
    protected $isLogin = false;
    protected $isSignup = false;
    protected $isUpdate = false;

    public function login(): UserValidator
    {
        $this->isLogin = true;
        return $this;
    }

    public function signup(): UserValidator
    {
        $this->isSignup = true;
        return $this;
    }

    public function update(): UserValidator
    {
        $this->isUpdate = true;
        return $this;
    }

    protected function email(): UserValidator
    {
        $email = $this->object->get('email');
        if (isset($email) && !empty($email)) {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->messages["email"] = Translate('email not valid');
            } else {
                if ($this->isLogin || $this->isSignup || $this->isUpdate) {
                    $user = ModelFactory::getInstance('consumer');
                    $userData = $user
                        ->select()
                        ->where(['email' => $email])
                        ->first();

                    if ($this->isLogin) {
                        if (empty($userData)) {
                            $this->messages['email'] = Translate('account not found');
                        }
                    } else {
                        if (!empty($userData)) {
                            $this->messages['email'] = Translate('account already used');
                        }
                    }
                }
            }
        } else {
            $this->messages["email"] = Translate('email required');
        }
        return $this;
    }

    protected function name(): UserValidator
    {
        $name = $this->object->get('name');
        if (isset($name) && !empty($name)) {
            if (strlen($name) <= 3) {
                $this->messages['name'] = Translate('name too short');
            } else if (!preg_match('/^[a-z]+( [a-z]{2,})*$/i', $name)) {
                $this->messages["name"] = Translate('name not alphabetic');
            }
        } else {
            $this->messages["name"] = Translate('name required');
        }
        return $this;
    }

    protected function password(): UserValidator
    {
        $password = $this->object->get('password');
        if (isset($password) && !empty($password)) {
            if (strlen($password) < 8) {
                $this->messages['password'] = Translate('password too short');
            } else {
                if ($this->isLogin) {
                    if (empty($this->messages['email'])) {
                        $consumerModel = ModelFactory::getInstance('consumer');
                        $consumer = $consumerModel
                            ->select('password')
                            ->where(['email' => $this->object->get('email')])
                            ->first();

                        if (!password_verify($password, $consumer->password)) {
                            $this->messages['password'] = Translate('wrong account');
                        }
                    }
                } else if ($this->isUpdate) {
                    $currentPassword = Auth()->user()->get('password');
                    if (!password_verify($password, $currentPassword)) {
                        $this->messages['password'] = Translate('wrong current password');
                    }
                }
            }
        } else {
            $this->messages['password'] = Translate('password required');
        }

        return $this;
    }
}