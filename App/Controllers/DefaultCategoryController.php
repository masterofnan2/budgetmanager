<?php
namespace App\Controllers;

use App\Database\Database;
use App\Model\ModelFactory;
use App\Objects\Category;

class DefaultCategoryController extends Controller
{
    public function create()
    {
        require dirname(__DIR__, 2) . '/Core/etc/constants/default_categories.php';

        $categoryModel = ModelFactory::getInstance('category');
        $category = new Category;

        $defaultCategories = array_map(function ($category) {
            $category['consumer_id'] = Auth()->user()->get('id');
            $category['cycle_id'] = Auth()->cycle()->get('id');

            return $category;
        }, DEFAULT_CATEGORIES);

        $categoryModel
            ->create($defaultCategories)
            ->save();
    }

    public function recycle()
    {
        if (!empty($_SESSION['previousCycle'])) {
            $date_now_iso = UseDate()->get_iso();

            if ($_SESSION['previousCycle']->end_date <= $date_now_iso) {
                $categoryModel = ModelFactory::getInstance('category');
                $previousCategories = $categoryModel
                    ->select('name', 'consumer_id', 'description', 'icon', 'budget_id')
                    ->where([
                        'cycle_id' => $_SESSION['previousCycle']->id
                    ])
                    ->orderBy('id', 'ASC')
                    ->array()
                    ->get();

                $next_budget_id = ModelFactory::getInstance('budget')
                    ->query('SELECT AUTO_INCREMENT
                        FROM information_schema.TABLES 
                        WHERE TABLE_SCHEMA = "' . Database::getDbname() . '" AND TABLE_NAME = "budget"')
                    ->first()->AUTO_INCREMENT;
                
                if (!empty($previousCategories)) {
                    $newCategories = [];
                    $cycle_id = Auth()->cycle()->get('id');

                    foreach ($previousCategories as $previousCategory) {
                        $newCategory = $previousCategory;
                        $newCategory['cycle_id'] = $cycle_id;

                        if ($previousCategory['budget_id']) {
                            $newCategory['budget_id'] = ++$next_budget_id;
                        }

                        $newCategories[] = $newCategory;
                    }

                    $categoryModel
                        ->create($newCategories)
                        ->save();
                }
            }
        }
    }
}