<?php

namespace Core\Validator;

use App\Model\ModelFactory;
use Core\Translation\Translation;

class SettingsValidator extends Validator
{
    protected function currency_id()
    {
        $currencyModel = ModelFactory::getInstance('currency');
        $currencyExists = $currencyModel
            ->find($this->object->get('currency_id'));

        if (!$currencyExists) {
            $this->messages['currency_id'] = Translate('currency not existing');
        }
    }

    protected function language()
    {
        $languages = Translation::getInstance($_SERVER['HTTP_CONTENT_LANGUAGE'])->getLanguages();
        if(array_search($this->object->get('language'), $languages) === false){
            $this->messages['language'] = Translate('language not existing');
        }
    }
}