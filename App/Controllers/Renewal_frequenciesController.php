<?php
namespace App\Controllers;

use App\Model\Renewal_Frequency;

class Renewal_frequenciesController extends Controller
{
    public function get()
    {
        $renewalFrequencyModel = Renewal_Frequency::getInstance();
        $renewalFrequencies = $renewalFrequencyModel
            ->select()
            ->get();

        if (!empty($renewalFrequencies)) {
            array_map(function ($renewal_frequency) {
                $renewal_frequency->name = Translate($renewal_frequency->name);
                return $renewal_frequency;
            }, $renewalFrequencies);
        }

        Response()->json([
            'renewal_frequencies' => $renewalFrequencies
        ]);
    }
}