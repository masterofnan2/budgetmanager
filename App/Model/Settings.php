<?php
namespace App\Model;

class Settings extends Model
{
    public function __construct()
    {
        $this->belongsTo('consumer', 'currency');
        parent::__construct();
    }
}