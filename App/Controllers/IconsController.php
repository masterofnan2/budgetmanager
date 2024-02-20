<?php
namespace App\Controllers;

class IconsController extends Controller
{
    public function get()
    {
        require dirname(__DIR__, 2) . '/Core/etc/constants/fontawesome_icons.php';

        Response()->json([
            'icons' => FONTAWESOME_ICONS
        ]);
    }
}