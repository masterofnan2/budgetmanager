<?php
namespace App\Objects;

class Token extends ParentObject
{
    protected $consumer_id;
    protected $value;
    protected $created_at;
    protected $exp_date;
    protected $userAgent;
    protected $id;
    protected $device;
    protected $icon;

    public function setId($id): Token
    {
        $this->id = $id;
        return $this;
    }

    public function setIcon($icon): Token
    {
        $this->icon = $icon;
        return $this;
    }

    public function setDevice($name): Token
    {
        $this->device = $name;
        return $this;
    }

    public function setCreationDate(?string $date = null): Token
    {
        $created_at_iso = $date ?? UseDate()->get_iso();
        $this->created_at = $created_at_iso;

        return $this;
    }

    public function setExpirationDate(?string $date = null): Token
    {
        $date_created_at = UseDate()->create($this->created_at);
        $created_at_plus_month_iso = UseDate()->add('1 month', $date_created_at)->format('Y-m-d');

        $exp_date_iso = $date ?? $created_at_plus_month_iso;
        $this->exp_date = $exp_date_iso;

        return $this;
    }

    public function generateValue($length = 32): Token
    {
        $this->value = bin2hex(random_bytes($length));
        return $this;
    }

    public function setValue($value): Token
    {
        $this->value = $value;
        return $this;
    }

    public function setConsumer($id): Token
    {
        $this->consumer_id = $id;
        return $this;
    }

    public function setUserAgent($userAgent): Token
    {
        $this->userAgent = $userAgent;
        return $this;
    }
}