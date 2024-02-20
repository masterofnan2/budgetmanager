<?php
namespace App\Controllers;

use App\Model\ModelFactory;
use App\Objects\Category;
use Core\Validator\CategoryValidator;

require dirname(__DIR__, 2) . '/Core/etc/constants/fontawesome_icons.php';

class CategoriesController extends Controller
{
    protected function makeCategoriesUnique(array $categories): array
    {
        $categoriesNames = [];
        $returns = [];

        if (!empty($categories)) {
            foreach ($categories as $category) {
                if (array_search($category->name, $categoriesNames) === false) {
                    $categoriesNames[] = $category->name;
                    $returns[] = $category;
                }
            }
        }

        return $returns;
    }

    public function create($request)
    {
        Auth()->verify(true);
        $category = new Category;

        $category
            ->setName($request->name)
            ->setDescription($request->description)
            ->setIcon($request->icon)
            ->setConsumer(Auth()->user()->get('id'))
            ->setCycle(Auth()->cycle()->get('id'));

        $validator = new CategoryValidator($category);

        $validationErrors = $validator
            ->errors()
            ->messages('name', 'icon');

        if (!empty($validationErrors)) {
            Response()->json(['errors' => $validationErrors]);
        }

        $categoryModel = ModelFactory::getInstance('category');
        $categoryData = $categoryModel
            ->create($category->get('name', 'description', 'icon', 'consumer_id', 'cycle_id'))
            ->save();

        Response()->json([
            'category' => $categoryData
        ]);
    }

    public function delete($request)
    {
        Auth()->verify(true);

        $category = new Category;
        $category->setId($request->id);

        $categoryModel = ModelFactory::getInstance('category');
        $categoryData = $categoryModel
            ->select('budget_id')
            ->where(['id' => $category->get('id')])
            ->first();

        if (is_numeric($categoryData->budget_id) && $categoryData->budget_id > 0) {
            $budget = new \App\Objects\Budget;
            $budget->setId($categoryData->budget_id);

            $budgetModel = ModelFactory::getInstance('budget');
            $budgetModel
                ->delete($budget)
                ->save();
        }

        Response()->json([
            'success' => $categoryModel
                ->delete($category)
                ->save()
        ]);
    }

    public function get($request)
    {
        Auth()->verify(true);

        $conditions = [
            'consumer_id' => Auth()->user()->get('id'),
            'cycle_id' => Auth()->cycle()->get('id')
        ];

        if (isset($request->cycle_id)) {
            if ($request->cycle_id === 0) {
                unset($conditions['cycle_id']);
            } else {
                $conditions['cycle_id'] = $request->cycle_id;
            }
        }

        $categoryModel = ModelFactory::getInstance('category');
        $categories = $categoryModel
            ->select('id', 'name', 'description', 'icon')
            ->where($conditions)
            ->get();

        $response = isset($conditions['cycle_id']) ? $categories : $this->makeCategoriesUnique($categories);

        Response()->json(['categories' => $response]);
    }

    public function update($request)
    {

        Auth()->verify(true);

        $category = new Category;
        $category
            ->setId($request->id)
            ->setConsumer(Auth()->user()->get('id'))
            ->setIcon($request->icon)
            ->setName($request->name)
            ->setDescription($request->description);

        $validator = new CategoryValidator($category);
        $validationErrors = $validator
            ->errors()
            ->messages('name', 'icon');

        if (!empty($validationErrors)) {
            Response()->json([
                'errors' => $validationErrors
            ]);
        }

        $categoryModel = ModelFactory::getInstance('category');
        $categoryModel
            ->update($category->get('name', 'description', 'icon'))
            ->where(['id' => $category->get('id')])
            ->save();

        Response()->json([
            'category' => $categoryModel
                ->select()
                ->where(['id' => $category->get('id')])
                ->first()
        ]);
    }
}