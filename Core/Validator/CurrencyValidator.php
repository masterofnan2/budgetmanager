<?php
namespace Core\Validator;

use App\Model\ModelFactory;

class CurrencyValidator extends Validator
{
    protected function id()
    {
        $currencyModel = ModelFactory::getInstance('currency');
        $currencyExists = $currencyModel
            ->find($this->object->get('id'));

        if (!$currencyExists) {
            $this->messages['currency_id'] = Translate('currency not existing');
        }
    }
}