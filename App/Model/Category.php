<?php
    namespace App\Model;

    class Category extends Model{
        public function __construct(){
            $this->belongsTo('consumer', 'budget', 'cycle');
            parent::__construct();
        }
    }