<?php

namespace App\Controllers;

use App\Model\ModelFactory;

class ChartController extends Controller
{
    private $categories;
    private $expenses;
    private $cycle;
    private $chartHeader = [];
    private $chartBody = [];
    private $target_chartBody_length = 4;
    private $subcycle_number;

    public function expense($request = new \stdClass)
    {
        Auth()->verify(true);
        $cycle = null;

        if (isset($request->cycle) && !empty($request->cycle)) {
            $cycle = get_object_vars($request->cycle);
        } else {
            $cycle = Auth()->cycle()->get();
        }

        $categoryModel = ModelFactory::getInstance('category');
        $categories = $categoryModel
            ->select('id', 'name')
            ->where(['cycle_id' => $cycle['id']])
            ->orderBy('id')
            ->get();

        $expenseModel = ModelFactory::getInstance('expense');
        $expenses = $expenseModel
            ->select('amount', 'date', 'category_id')
            ->where(['cycle_id' => $cycle['id']])
            ->orderBy('date')
            ->get();

        if (!empty($cycle) && !empty($categories) && !empty($expenses)) {
            $this->categories = $categories;
            $this->expenses = $expenses;
            $this->cycle = $cycle;

            Response()->json([
                'chartData' => $this->getChartData(),
                'chartOptions' => $this->getChartOptions()
            ]);
        }

        Response()->json([
            'chartData' => [],
            'chartOptions' => []
        ]);
    }

    private function getChartData(): array
    {
        $tempChartHeader = ['Cycle'];

        foreach ($this->categories as $category) {
            $tempChartHeader[$category->id] = $category->name;
        }

        $end_date_timestamp = UseDate()->create($this->cycle['end_date'])->getTimestamp();
        $start_date_timestamp = UseDate()->create($this->cycle['start_date'])->getTimestamp();
        $cycle_duration = $end_date_timestamp - $start_date_timestamp;

        $last_cycle_start_date_timestamp = $start_date_timestamp;
        $quarter_cycle = ceil($cycle_duration / 4);
        $last_cycle_end_date_timestamp = $last_cycle_start_date_timestamp + $quarter_cycle;

        $chartBody = [];
        $chartRow = [];
        $subcycle_number = 1;

        for ($i = 0; $i < count($this->expenses); $i++) {
            $expense = $this->expenses[$i];
            $expense_date_timestamp = UseDate()->create($expense->date)->getTimestamp();

            if ($expense_date_timestamp >= $last_cycle_end_date_timestamp) {
                $chartBody[] = $this->fillDifference($tempChartHeader, $chartRow);
                $chartRow = [];

                $last_cycle_start_date_timestamp = $last_cycle_end_date_timestamp;
                $last_cycle_end_date_timestamp += $quarter_cycle;
                ++$subcycle_number;
            }

            if (empty($chartRow)) {
                $chartRow[] = "Sub-cycle {$subcycle_number}";
            }

            if ($expense_date_timestamp >= $last_cycle_start_date_timestamp && $expense_date_timestamp < $last_cycle_end_date_timestamp) {
                if (!isset($chartRow[$expense->category_id])) {
                    $chartRow[$expense->category_id] = (float) $expense->amount;
                } else {
                    $chartRow[$expense->category_id] += (float) $expense->amount;
                }
            }

            if ($i === (count($this->expenses) - 1)) {
                $chartBody[] = $this->fillDifference($tempChartHeader, $chartRow);
            }
        }

        $this->subcycle_number = $subcycle_number;
        $this->chartHeader = $tempChartHeader;
        $this->chartBody = $chartBody;

        if ($end_date_timestamp <= time()) {
            if (count($chartBody) < $this->target_chartBody_length) {
                $this->fillChartBody();
            }
        }

        return array_merge([array_values($tempChartHeader)], $this->chartBody);
    }

    private function fillChartBody()
    {
        $chartBodyLength = count($this->chartBody);
        $length_difference = $this->target_chartBody_length - $chartBodyLength;
        $subcycle_number = $this->subcycle_number + 1;

        for ($i = 0; $i < $length_difference; $i++) {
            $chartRow = ["Sub-cycle {$subcycle_number}"];
            $this->chartBody[] = $this->fillDifference($this->chartHeader, $chartRow);
            $subcycle_number++;
        }
    }

    private function fillDifference(array $chartHeader, array $chartRow): array
    {
        $difference = array_diff_key($chartHeader, $chartRow);

        if (!empty($difference)) {
            foreach ($difference as $key => $value) {
                $chartRow[$key] = 0;
            }
        }

        ksort($chartRow);
        return array_values($chartRow);
    }

    private function getChartOptions(): array
    {
        $chartOptions = [
            'title' => 'Expense Per Category',
            'curveType' => 'function',
            'legend' => [
                'position' => 'bottom',
                'maxLines' => 2
            ],
            'colors' => $this->generate_colors(count($this->categories)),
            'interpolateNulls' => false,
            'hAxis' => [
                'title' => 'cycle',
                'format' => 'string'
            ],
            'vAxis' => [
                'title' => 'expense (' . Auth()->settings()->currency->name . ')',
                'format' => '#'
            ]
        ];

        return $chartOptions;
    }

    /**
     * generates an array of hexadecimal colors
     * @param number the number of colors to be generated
     * @return array contains the colors
     */
    private function generate_colors($number): array
    {
        $colors = [];
        for ($i = 0; $i < $number; $i++) {
            $color = "#" . str_pad(dechex(rand(0, 16777215)), 6, "0", STR_PAD_LEFT);
            array_push($colors, $color);
        }

        return $colors;
    }
}