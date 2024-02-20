<?php
namespace App\Objects;

class Consumer_Notification extends ParentObject
{
    protected $id;
    protected $date;
    protected $seen;
    protected $consumer_id;
    protected $notification_id;

    public function setId($id): Consumer_Notification
    {
        $this->id = $id;
        return $this;
    }

    public function setDate($date): Consumer_Notification
    {
        $this->date = $date;
        return $this;
    }

    public function setSeen($seen): Consumer_Notification
    {
        $this->seen = $seen;
        return $this;
    }

    public function setConsumer($consumer_id): Consumer_Notification
    {
        $this->consumer_id = $consumer_id;
        return $this;
    }

    public function setNotification($notification_id): Consumer_Notification
    {
        $this->notification_id = $notification_id;
        return $this;
    }
}