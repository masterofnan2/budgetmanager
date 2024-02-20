<?php
namespace App\Controllers;

use App\Model\ModelFactory;
use App\Objects\Budget;
use App\Objects\Cycle;
use Core\Validator\BudgetValidator;
use Core\Validator\CycleValidator;

class BudgetController extends Controller
{
    public function get()
    {
        Auth()->verify(true);

        $budgetModel = ModelFactory::getInstance('budget');
        $budgetData = $budgetModel
            ->select('amount')
            ->where([
                'category_id' => 0,
                'cycle_id' => Auth()->cycle()->get('id')
            ])
            ->array()
            ->first();

        if ($budgetData) {
            Response()->json(['budget' => array_merge($budgetData, Auth()->cycle()->get())]);
        }
    }

    public function update($request)
    {
        Auth()->verify(true);

        $auth_cycle_id = Auth()->cycle()->get('id');

        $budget = new Budget;
        $budget
            ->setAmount($request->amount)
            ->setConsumer(Auth()->user()->get('id'))
            ->setCategory($request->category_id ?? 0)
            ->setCycle($auth_cycle_id);

        $budgetValidator = new BudgetValidator($budget);
        $budgetErrors = $budgetValidator
            ->errors()
            ->messages();

        $cycle = new Cycle;
        $cycle
            ->setId($auth_cycle_id)
            ->setEndDate($request->end_date)
            ->setRenewalFrequency($request->renewal_frequency_id);

        $cycleValidator = new CycleValidator($cycle);
        $cycleErrors = $cycleValidator
            ->errors()
            ->messages('renewal_frequency_id', 'end_date');

        $validationErrors = array_merge($budgetErrors, $cycleErrors);

        if (!empty($validationErrors)) {
            Response()->json(['errors' => $validationErrors]);
        }

        $budgetModel = ModelFactory::getInstance('budget');
        $budgetData = $budgetModel
            ->select()
            ->where([
                'category_id' => $budget->get('category_id'),
                'cycle_id' => $auth_cycle_id
            ])
            ->first();

        if ($budgetData) {
            $budget
                ->setId($budgetData->id);

            if (floatval($budgetData->amount) > floatval($budget->get('amount'))) {
                $budgetModel
                    ->update(['amount' => 0])
                    ->where([
                        'cycle_id' => $auth_cycle_id
                    ])
                    ->save();
            }

            $budgetModel
                ->update($budget->get())
                ->where(['id' => $budget->get('id')])
                ->save();

            $cycleModel = ModelFactory::getInstance('cycle');
            $cycleModel
                ->update($cycle->get('renewal_frequency_id', 'end_date'))
                ->where(['id' => $auth_cycle_id])
                ->save();

            $cycleData = $cycleModel->find($auth_cycle_id);

            $budgetData = $budgetModel
                ->select()
                ->where(['id' => $budget->get('id')])
                ->first();

            $response = array_merge(get_object_vars($cycleData), get_object_vars($budgetData));
            Response()->json(['budget' => $response]);
        }
    }

    public function create(?Budget $budget = null): \stdClass
    {
        $newBudget = $budget ?? $this->getDefault();

        $payload = $newBudget->get('id') ?
            $newBudget->get('id', 'amount', 'category_id', 'consumer_id', 'cycle_id') :
            $newBudget->get('amount', 'category_id', 'consumer_id', 'cycle_id');

        $budgetModel = ModelFactory::getInstance('budget');
        $budgetData = $budgetModel
            ->create($payload)
            ->save();

        return $budgetData;
    }

    public function recycle()
    {
        $consumer_id = Auth()->user()->get('id');
        $budgetModel = ModelFactory::getInstance('budget');

        $budgetDatas = $budgetModel
            ->select('amount', 'category_id')
            ->where([
                'cycle_id' => $_SESSION['previousCycle']->id
            ])
            ->orderBy('category_id', 'ASC')
            ->get();

        $currentCategories = ModelFactory::getInstance('category')
            ->select('id', 'budget_id')
            ->where([
                'cycle_id' => Auth()->cycle()->get('id'),
                ['budget_id', '<>', null]
            ])
            ->orderBy('id', 'ASC')
            ->get();

        $i = 0;
        foreach ($budgetDatas as $budgetData) {
            $budget = new Budget;

            if ($budgetData->category_id > 0) {
                $budget
                    ->setId($currentCategories[$i]->budget_id)
                    ->setCategory($currentCategories[$i]->id);
                $i++;
            } else {
                $budget->setCategory(0);
            }

            $budget->setAmount((float) $budgetData->amount)
                ->setConsumer($consumer_id)
                ->setCycle(Auth()->cycle()->get('id'));

            $this->create($budget);
        }
    }

    private function getDefault(): Budget
    {
        $category_id = 0;
        $amount = 0;
        $cycle_id = Auth()->cycle()->get('id');
        $consumer_id = Auth()->user()->get('id');

        $budget = new Budget;
        $budget->setAmount(floatval($amount))
            ->setConsumer($consumer_id)
            ->setCategory($category_id)
            ->setCycle($cycle_id);

        return $budget;
    }
}