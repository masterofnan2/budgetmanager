<?php
use Core\Auth\Auth;
use Core\DateObject\DateObject;
use Core\Response\Response;
use Core\Translation\Translation;

function Response(): Response
{
    return new Response;
}

function dd()
{
    $args = func_get_args();
    foreach ($args as $variable) {
        echo '<pre style="background-color : black; padding : 10px ; color : white">';
        if (is_string($variable)) {
            $path_to_file = __FILE__ . "\n";
            $string_length = ' (' . strlen($variable) . ')';
            echo $path_to_file. wordwrap($variable, 75) . $string_length;
        } else {
            var_dump($variable);
        }
        echo '</pre>';
    }
    die(200);
}

function Auth(): Auth
{
    return Auth::getInstance();
}

function Translate(string $string): string
{
    return Translation::getInstance($_SERVER['HTTP_CONTENT_LANGUAGE'])->translate($string);
}

function UseDate(): DateObject
{
    return DateObject::getInstance();
}