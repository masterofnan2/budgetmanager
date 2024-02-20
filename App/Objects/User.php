<?php
namespace App\Objects;

class User extends ParentObject
{
    protected $id;
    protected $name;
    protected $email;
    protected $password;

    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    public function setName($name){
        $this->name = $name;
        return $this;
    }

    public function setEmail($email){
        $this->email = $email;
        return $this;
    }

    public function setPassword($password){
        $this->password = $password;
        return $this;
    }
}