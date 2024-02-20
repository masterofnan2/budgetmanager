<?php

namespace App\Controllers;

class DeviceController extends Controller
{
    protected function getPlatform()
    {
        $user_agent = $_SERVER['HTTP_USER_AGENT'];
        $platforms = array(
            'Android' => 'Android',
            'iOS' => 'iPhone|iPad|iPod',
            'Windows' => 'Windows NT|Windows XP|Windows Vista|Windows 7|Windows 8|Windows 10',
            'Linux' => 'Linux|Ubuntu|Debian|Fedora|CentOS',
            'Mac' => 'Mac OS X|Macintosh',
        );

        $platform = 'Unknown';
        foreach ($platforms as $name => $pattern) {
            if (preg_match("/$pattern/i", $user_agent)) {
                $platform = $name;
                break;
            }
        }

        return $platform;
    }

    protected function isMobile(): bool
    {
        $mobile_agents = array('Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone');
        $user_agent = $_SERVER['HTTP_USER_AGENT'];
        foreach ($mobile_agents as $mobile_agent) {
            if (preg_match("/$mobile_agent/i", $user_agent)) {
                return true;
            }
        }

        return false;
    }
    public function getDeviceInfo(): array
    {
        $isMobile = $this->isMobile();
        $platform = $this->getPlatform();
        $device_info = array(
            'isMobile' => $isMobile,
            'platform' => $platform
        );

        return $device_info;
    }
}