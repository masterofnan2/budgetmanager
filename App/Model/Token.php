<?php
namespace App\Model;

class Token extends Model
{
    public function __construct()
    {
        $this->belongsTo('consumer');
        parent::__construct();
    }
}