<?php
namespace Core\Validator;

class BudgetValidator extends Validator
{
    protected function amount(): BudgetValidator
    {
        $amount = $this->object->get('amount');

        if (!$amount) {
            $this->messages['amount'] = Translate('element is null');
        } else {
            if (floatval($amount) < 10) {
                $this->messages['amount'] = Translate('amount not numeric');
            }
        }

        return $this;
    }
}