<?php
namespace App\Objects;

class Settings extends ParentObject
{
    protected $id;
    protected $language;
    protected $currency_id;
    protected $consumer_id;

    public function setId($id): Settings
    {
        $this->id = $id;
        return $this;
    }

    public function setLanguage($language): Settings
    {
        $this->language = $language;
        return $this;
    }

    public function setCurrency($currency_id): Settings
    {
        $this->currency_id = $currency_id;
        return $this;
    }

    public function setConsumer($consumer_id): Settings
    {
        $this->consumer_id = $consumer_id;
        return $this;
    }
}