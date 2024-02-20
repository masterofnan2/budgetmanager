<?php

namespace App\Objects;

class ParentObject
{

    /**
     * @param null|string properties
     * @return array|int|string|float|null|bool array if many properties are mentionned or the value of the unique property
     */
    public function get()
    {
        $args = func_get_args();
        $instanceData = [];

        if (!empty($args) && count($args) === 1) {

            $arg = $args[0];
            if (property_exists($this, $arg)) {
                return $this->$arg;
            } else {
                return false;
            }

        } else if (!empty($args) && count($args) > 1) {

            foreach ($args as $property) {
                if (property_exists($this, $property)) {
                    $instanceData[$property] = $this->$property;
                }
            }
        } else {
            // $properties = get_class_vars(get_class($this));
            $properties = get_object_vars($this);
            foreach ($properties as $property => $value) {
                $instanceData[$property] = $this->$property;
            }
        }

        return $instanceData;
    }
}