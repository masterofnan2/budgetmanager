<?php
namespace App\Objects;

class Expense extends ParentObject
{
    protected $id;
    protected $date;
    protected $description;
    protected $amount;
    protected $consumer_id;
    protected $category_id;
    protected $cycle_id;

    public function setId($id): Expense
    {
        $this->id = $id;
        return $this;
    }
    public function setDate($date): Expense
    {
        $this->date = $date;
        return $this;
    }

    public function setDescription($description): Expense
    {
        $this->description = $description;
        return $this;
    }
    public function setAmount($amount): Expense
    {
        $this->amount = $amount;
        return $this;
    }
    public function setConsumer($consumer_id): Expense
    {
        $this->consumer_id = $consumer_id;
        return $this;
    }
    public function setCategory($category_id): Expense
    {
        $this->category_id = $category_id;
        return $this;
    }

    public function setCycle($cycle_id): Expense
    {
        $this->cycle_id = $cycle_id;
        return $this;
    }
}