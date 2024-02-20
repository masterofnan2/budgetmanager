<?php
namespace App\Objects;

class Notification extends ParentObject
{
    protected $id;
    protected $title;
    protected $content;
    protected $action;

    public function setId($id): Notification
    {
        $this->id = $id;
        return $this;
    }

    public function setTitle($title): Notification
    {
        $this->title = $title;
        return $this;
    }

    public function setContent($content): Notification
    {
        $this->content = $content;
        return $this;
    }

    public function setAction($action): Notification
    {
        $this->action = $action;
        return $this;
    }
}