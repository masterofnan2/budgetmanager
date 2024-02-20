<?php
namespace App\Controllers\Categories;

use App\Controllers\Controller;
use App\Model\ModelFactory;
use App\Objects\Budget;
use App\Objects\Category;
use Core\Validator\CategoryBudgetValidator;

class BudgetController extends Controller
{
    public function get()
    {
        Auth()->verify(true);

        $categoryModel = ModelFactory::getInstance('category');
        $categories = $categoryModel
            ->select('id', 'name', 'description', 'icon')
            ->with('budget')
            ->where([
                'consumer_id' => Auth()->user()->get('id'),
                'cycle_id' => Auth()->cycle()->get('id')
            ]);
            
        Response()->json(['categories' => $categories->get()]);
    }

    public function set($request)
    {
        Auth()->verify(true);

        $budget = new Budget;
        $budget->setAmount(floatval($request->amount))
            ->setConsumer(Auth()->user()->get('id'))
            ->setCategory($request->category_id)
            ->setCycle(Auth()->cycle()->get('id'));

        $validator = new CategoryBudgetValidator($budget);
        $validationErrors = $validator
            ->errors()
            ->messages('amount', 'category_id');

        if (!empty($validationErrors)) {
            Response()->json(['errors' => $validationErrors]);
        }

        $categoryModel = ModelFactory::getInstance('category');
        $budgetModel = ModelFactory::getInstance('budget');

        $budgetAlreadyExists = $budgetModel
            ->select()
            ->where([
                'consumer_id' => Auth()->user()->get('id'),
                'category_id' => $budget->get('category_id')
            ])
            ->first();

        if ($budgetAlreadyExists) {
            if ($budgetAlreadyExists) {
                $budget->setId($budgetAlreadyExists->id);
            }

            $budgetModel
                ->update(['amount' => $budget->get('amount')])
                ->where(['id' => $budget->get('id')])
                ->save();
        } else {
            $category = new Category;
            $budgetData = $budgetModel
                ->create($budget->get('amount', 'category_id', 'consumer_id', 'cycle_id'))
                ->save();

            $budget->setId($budgetData->id);

            $category
                ->setBudget($budget->get('id'));

            $categoryModel
                ->update(['budget_id' => $budget->get('id')])
                ->where(['id' => $budget->get('category_id')])
                ->save();
        }

        $categoryData = $categoryModel
            ->select()
            ->with('budget')
            ->where(['id' => $budget->get('category_id')])
            ->first();

        Response()->json(['category' => $categoryData]);
    }

    public function sum()
    {
        Auth()->verify(true);

        $budgetModel = ModelFactory::getInstance('budget');
        $budgetData = $budgetModel
            ->select('SUM(amount) AS total')
            ->where([
                'consumer_id' => Auth()->user()->get('id'),
                ['category_id', '>', 0],
                'cycle_id' => Auth()->cycle()->get('id')
            ])
            ->first();

        Response()->json(['total' => $budgetData->total]);
    }
}