<?php
namespace Core\Response;

class Response
{
    public function json(array $array)
    {
        header('Content-Type: application/json');
        echo json_encode($array);
        die(200);
    }
}