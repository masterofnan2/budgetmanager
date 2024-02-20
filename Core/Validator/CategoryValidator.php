<?php
namespace Core\Validator;

class CategoryValidator extends Validator
{
    protected function name(): CategoryValidator
    {
        $name = $this->object->get('name');
        if (!$name) {
            $this->messages['name'] = Translate('name required');
        } else if (strlen($name) < 4) {
            $this->messages['name'] = Translate('name too short');
        } else if (!preg_match('/^[a-zéèàôîöïùüû\s]+$/i', $name)) {
            $this->messages['name'] = Translate('name not alphabetic');
        }
        return $this;
    }

    protected function description(): CategoryValidator
    {
        return $this;
    }

    protected function icon(): CategoryValidator
    {
        if (array_search($this->object->get('icon'), FONTAWESOME_ICONS) === false) {
            $this->messages['icon'] = Translate('icon not existing');
        }
        return $this;
    }
}