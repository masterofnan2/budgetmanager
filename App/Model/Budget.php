<?php
namespace App\Model;

class Budget extends Model
{
    public function __construct(){
        $this->belongsTo('consumer', 'category', 'renewal_frequency', 'cycle');
        parent::__construct();
    }
}