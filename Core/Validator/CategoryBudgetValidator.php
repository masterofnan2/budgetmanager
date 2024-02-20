<?php
namespace Core\Validator;

use App\Model\ModelFactory;

class CategoryBudgetValidator extends BudgetValidator
{
    protected function amount(): CategoryBudgetValidator
    {
        $amount = floatVal($this->object->get('amount'));

        $budgetModel = ModelFactory::getInstance('budget');
        $mainBudget = $budgetModel
            ->select('amount')
            ->where([
                'consumer_id' => Auth()->user()->get('id'),
                'category_id' => 0,
                'cycle_id' => Auth()->cycle()->get('id')
            ])
            ->first();

        if ($mainBudget) {
            if ($mainBudget->amount > 0) {
                if ($amount > $mainBudget->amount) {
                    $this->messages['amount'] = Translate('category greater than budget');
                } else {
                    $conditions = [
                        'consumer_id' => Auth()->user()->get('id'),
                        ['category_id', '>', 0],
                        'cycle_id' => Auth()->cycle()->get('id')
                    ];

                    $this->object->get('id') ? $conditions[] = ['id', '<>', $this->object->get('id')] : null;

                    $budgetCategories = $budgetModel
                        ->select("SUM(amount) AS total")
                        ->where($conditions)
                        ->first();

                    if ($mainBudget->amount < ($budgetCategories->total + $amount)) {
                        $this->messages['amount'] = Translate('sum exceeds main budget');
                    }
                }
            } else {
                $this->messages['amount'] = Translate('main category not configured');
            }
        }

        return $this;
    }

    protected function category_id(): CategoryBudgetValidator
    {
        $category_id = $this->object->get('category_id');
        if ($category_id) {
            $categoryModel = ModelFactory::getInstance('category');
            $categoryExists = $categoryModel
                ->select()
                ->where([
                    'id' => $category_id,
                    'consumer_id' => Auth()->user()->get('id'),
                    'cycle_id' => Auth()->cycle()->get('id')
                ])
                ->first();

            if (!$categoryExists) {
                $this->messages['category_id'] = Translate('category not existing');
            }
        }

        return $this;
    }
}