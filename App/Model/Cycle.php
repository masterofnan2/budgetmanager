<?php

namespace App\Model;

class Cycle extends Model
{
    public function __construct()
    {
        $this->belongsTo('consumer', 'renewal_frequency');
        parent::__construct();
    }
}