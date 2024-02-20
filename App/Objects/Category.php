<?php
namespace App\Objects;

class Category extends ParentObject
{
    protected $id;
    protected $name;
    protected $consumer_id;
    protected $budget_id;
    protected $description;
    protected $icon;
    protected $cycle_id;

    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    public function setConsumer($consumer_id)
    {
        $this->consumer_id = $consumer_id;
        return $this;
    }

    public function setBudget($budget_id)
    {
        $this->budget_id = $budget_id;
        return $this;
    }

    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    public function setIcon($icon){
        $this->icon = $icon;
        return $this;
    }

    public function setCycle($cycle_id): Category
    {
        $this->cycle_id = $cycle_id;
        return $this;
    }
}