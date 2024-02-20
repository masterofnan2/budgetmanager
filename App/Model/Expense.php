<?php
namespace App\Model;

class Expense extends Model
{
    public function __construct()
    {
        $this->belongsTo('consumer', 'category', 'cycle');
        parent::__construct();
    }
}