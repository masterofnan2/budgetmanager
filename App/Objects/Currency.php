<?php

namespace App\Objects;

class Currency extends ParentObject
{
    protected $id;
    protected $name;
    protected $symbol;

    public function setId($id): Currency
    {
        $this->id = $id;
        return $this;
    }

    public function setName($name): Currency
    {
        $this->name = $name;
        return $this;
    }

    public function setSymbol($symbol): Currency
    {
        $this->symbol = $symbol;
        return $this;
    }
}