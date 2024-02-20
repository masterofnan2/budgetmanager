<?php

namespace App\Controllers;

use App\Model\ModelFactory;

class BalanceController extends Controller
{
    public function get()
    {
        Auth()->verify(true);

        $budgetModel = ModelFactory::getInstance('budget');
        $expenseModel = ModelFactory::getInstance('expense');

        $mainBudget = $budgetModel
            ->select('amount')
            ->where([
                'category_id' => 0,
                'consumer_id' => Auth()->user()->get('id'),
                'cycle_id' => Auth()->cycle()->get('id')
            ])
            ->first();

        if (isset($mainBudget->amount) && !empty($mainBudget->amount)) {
            $expenses = $expenseModel
                ->select('SUM(amount) AS total')
                ->where([
                    'consumer_id' => Auth()->user()->get('id'),
                    'cycle_id' => Auth()->cycle()->get('id')
                ])
                ->first();

            if (isset($expenses->total) && !empty($expenses->total)) {
                Response()->json(['balance' => $mainBudget->amount - $expenses->total]);
            } else {
                Response()->json(['balance' => $mainBudget->amount]);
            }
        } else {
            Response()->json(['balance' => 0]);
        }
    }
}