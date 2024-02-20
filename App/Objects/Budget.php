<?php
namespace App\Objects;

class Budget extends ParentObject
{
    protected $id;
    protected $amount;
    protected $consumer_id;
    protected $category_id;
    protected $cycle_id;

    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    public function setAmount($amount)
    {
        $this->amount = $amount;
        return $this;
    }

    public function setConsumer($consumer_id)
    {
        $this->consumer_id = $consumer_id;
        return $this;
    }

    public function setCategory($category_id)
    {
        $this->category_id = $category_id;
        return $this;
    }

    public function setCycle($cycle_id): Budget
    {
        $this->cycle_id = $cycle_id;
        return $this;
    }
}