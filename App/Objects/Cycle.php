<?php

namespace App\Objects;

class Cycle extends ParentObject
{
    protected $id;
    protected $number;
    protected $consumer_id;
    protected $start_date;
    protected $end_date;
    protected $renewal_frequency_id;

    public function setId($id): Cycle
    {
        $this->id = $id;
        return $this;
    }

    public function setConsumer($consumer_id): Cycle
    {
        $this->consumer_id = $consumer_id;
        return $this;
    }

    public function setStartDate(string $start_date): Cycle
    {
        $this->start_date = $start_date;
        return $this;
    }

    public function setEndDate(string $end_date): Cycle
    {
        $this->end_date = $end_date;
        return $this;
    }

    public function setRenewalFrequency($renewal_frequency_id): Cycle
    {
        $this->renewal_frequency_id = $renewal_frequency_id;
        return $this;
    }
}