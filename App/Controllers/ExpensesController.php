<?php

namespace App\Controllers;

use App\Model\ModelFactory;
use App\Objects\Expense;
use Core\Validator\ExpenseValidator;

class ExpensesController extends Controller
{

    protected function getRelatedCategories($categoryId): ?array
    {
        $categoryModel = ModelFactory::getInstance('category');
        $category = $categoryModel
            ->select('name')
            ->where(['id' => $categoryId])
            ->first();

        if ($category) {
            $categoriesData = $categoryModel
                ->select('id')
                ->where(['name' => $category->name, 'consumer_id' => Auth()->user()->get('id')])
                ->get();

            return $categoriesData;
        }

        return null;
    }
    
    public function available($request)
    {
        if (isset($request->category_id) && is_numeric($request->category_id)) {
            $expenseModel = ModelFactory::getInstance('expense');
            $expenses = $expenseModel
                ->select('SUM(amount) AS total')
                ->where(['category_id' => $request->category_id])
                ->first();

            $budgetModel = ModelFactory::getInstance('budget');
            $categoryBudget = $budgetModel
                ->select('amount')
                ->where(['category_id' => $request->category_id])
                ->first();

            if ($expenses && $categoryBudget) {
                $available = (float) $categoryBudget->amount - (float) $expenses->total;
                Response()->json(['available' => $available]);
            } else {
                Response()->json(['available' => 0]);
            }
        }
    }

    public function delete($request)
    {
        Auth()->verify(true);

        $expenseModel = ModelFactory::getInstance('expense');
        $expense = new Expense;

        $expense->setId($request->id);

        Response()->json([
            'success' => $expenseModel
                ->delete($expense)
                ->save()
        ]);
    }

    public function get($request = new \stdClass)
    {
        Auth()->verify(true);

        $array_conditions = [];

        if (isset($request->cycle_id)) {
            if ($request->cycle_id) {
                $array_conditions['cycle_id'] = $request->cycle_id;
            } else {
                $array_conditions['consumer_id'] = Auth()->user()->get('id');
            }
        } else {
            $array_conditions['cycle_id'] = Auth()->cycle()->get('id');
        }

        if (isset($request->categories) && !empty($request->categories)) {
            foreach ($request->categories as $categoryId) {
                if (isset($request->cycle_id) && $request->cycle_id) {
                    $array_conditions[] = ['category_id', '<>', $categoryId];
                } else {
                    $categoriesData = $this->getRelatedCategories($categoryId);

                    if (!empty($categoriesData)) {
                        foreach ($categoriesData as $categoryData) {
                            $array_conditions[] = ['category_id', '<>', $categoryData->id];
                        }
                    }
                }
            }
        }

        $expenseModel = ModelFactory::getInstance('expense');
        $expenses = $expenseModel
            ->select()
            ->with('category')
            ->where($array_conditions)
            ->orderBy('id', isset($_GET['limit']) ? 'DESC' : 'ASC')
            ->get();

        Response()->json(['expenses' => $expenses]);
    }

    public function set($request)
    {
        Auth()->verify(true);

        $expense = new Expense;

        $expense
            ->setAmount($request->amount)
            ->setCategory($request->category_id)
            ->setConsumer(Auth()->user()->get('id'))
            ->setDate($request->date ?? UseDate()->get_iso())
            ->setDescription($request->description ?? '')
            ->setCycle(Auth()->cycle()->get('id'));

        if (isset($request->id)) {
            $expense->setId($request->id);
        }

        $validator = new ExpenseValidator($expense);
        $validationErrors = $validator
            ->errors()
            ->messages();

        if (!empty($validationErrors)) {
            Response()->json(['errors' => $validationErrors]);
        }

        $expenseModel = ModelFactory::getInstance('expense');

        if ($expense->get('id')) {
            $expenseModel
                ->update($expense->get('amount', 'description', 'category_id', 'date'))
                ->where(['id' => $expense->get('id')])
                ->save();

            $expenseData =
                $expenseModel
                    ->select()
                    ->where(['id' => $expense->get('id')])
                    ->first();
        } else {
            $expenseData =
                $expenseModel
                    ->create($expense->get('amount', 'description', 'category_id', 'consumer_id', 'date', 'cycle_id'))
                    ->save();
        }

        $notificationsController = new NotificationsController;
        $notificationsController->verify();

        Response()->json([
            'expense' => $expenseModel
        ]);
    }

    public function getConsumption()
    {
        $expensesModel = ModelFactory::getInstance('expense');
        $expenses = $expensesModel
            ->select('SUM(amount) AS total')
            ->where([
                'cycle_id' => Auth()->cycle()->get('id')
            ])
            ->first();

        $budgetModel = ModelFactory::getInstance('budget');
        $mainBudget = $budgetModel
            ->select('amount')
            ->where([
                'cycle_id' => Auth()->cycle()->get('id'),
                'category_id' => 0
            ])
            ->first();

        $consumption = $expenses->total * 100 / $mainBudget->amount;
        return $consumption;
    }
}