<?php
namespace Core\Validator;

use App\Model\ModelFactory;

class ExpenseValidator extends Validator
{
    protected function amount()
    {
        $amount = $this->object->get('amount');

        if (!$amount) {
            $this->messages['amount'] = Translate('amount required');
        } else if (!is_numeric($amount)) {
            $this->messages['amount'] = Translate('amount not number');
        } else {
            $budgetModel = ModelFactory::getInstance('budget');
            $categoryBudget = $budgetModel
                ->select('amount')
                ->where(['category_id' => $this->object->get('category_id')])
                ->first();

            if (!$categoryBudget) {
                $this->messages['category_id'] = Translate('budget limit not set');
            } else {
                $expenseModel = ModelFactory::getInstance('expense');

                $conditions = ['category_id' => $this->object->get('category_id')];
                $this->object->get('id') ? $conditions[] = ['id', '<>', $this->object->get('id')] : null;

                $expenses = $expenseModel
                    ->select('SUM(amount) AS total')
                    ->where($conditions)
                    ->first();

                if (!$expenses) {
                    if ($amount > $categoryBudget->amount) {
                        $this->messages['amount'] = Translate('expense exceeding defined amount');
                    }
                } else {
                    if (($expenses->total + $amount) > $categoryBudget->amount) {
                        $this->messages['amount'] = Translate('expense exceeding defined amount');
                    }
                }
            }
        }
    }

    protected function category_id()
    {
        $category_id = $this->object->get('category_id');
        if (!$category_id) {
            $this->messages['category_id'] = Translate('category required');
        } else if (!is_numeric($category_id)) {
            $this->messages['category_id'] = Translate('category not valid');
        } else {
            $categoryModel = ModelFactory::getInstance('category');
            $categoryData = $categoryModel
                ->select()
                ->where([
                    'id' => $category_id,
                    'cycle_id' => Auth()->cycle()->get('id')
                ])
                ->first();

            if (!$categoryData) {
                $this->messages['category_id'] = Translate('category not existing');
            }
        }
    }

    protected function date()
    {
        $date = $this->object->get('date');
        $cycle = Auth()->cycle()->get('start_date', 'end_date');

        if (!$cycle) {
            $this->messages['date'] = Translate('main budget not set');
        } else {
            if ($date < $cycle['start_date'] || $date >= $cycle['end_date']) {
                $this->messages['date'] = Translate('expenses in cycle');
            }
        }
    }
}