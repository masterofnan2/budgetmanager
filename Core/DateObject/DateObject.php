<?php

namespace Core\DateObject;

class DateObject
{
    private static $_instance;

    public static function getInstance(): DateObject
    {
        if (!self::$_instance) {
            self::$_instance = new DateObject;
        }

        return self::$_instance;
    }

    /**
     * gets the iso string formated of a Datetime or the current time
     * @param \Datetime|null $datetime the date to get the iso string from
     * @return string iso formated date
     */
    public function get_iso(?\Datetime $datetime = null): string
    {
        $newDatetime = $datetime ? clone $datetime : date_create();
        return date_format($newDatetime, "Y-m-d");
    }

    /**
     * creates a Datetime object from a String Iso or the a Datetime from the current time
     * @param string|null $iso
     * @return \Datetime
     */
    public function create(?string $iso = null): \Datetime
    {
        $newIso = $iso ?? $this->get_iso();

        $time_component = "00:00:00";
        $datetime = "{$newIso} {$time_component}";

        return date_create($datetime);
    }

    /**
     * adds an interval to a Datetime object or the current Datetime
     * @param string $interval_string a string interval compatible with the {date_interval_create_from_date_string()} function
     * @param \Datetime|null The datetime to add the interval to
     * @return \Datetime
     */
    public function add(string $interval_string, ?\Datetime $datetime = null): \Datetime
    {
        $newDatetime = $datetime ? clone $datetime : $this->create();
        return date_add($newDatetime, date_interval_create_from_date_string($interval_string));
    }
}