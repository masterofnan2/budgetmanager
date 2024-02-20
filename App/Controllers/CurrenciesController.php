<?php
namespace App\Controllers;

use App\Model\ModelFactory;
use Core\Validator\CurrencyValidator;

class CurrenciesController extends Controller
{
    public function getDefault(): \stdClass
    {
        $currency = new \stdClass;
        $currency->id = 1;
        $currency->name = "usd";
        $currency->symbol = "dollar-sign";

        return $currency;
    }

    public function get()
    {
        $currencyModel = ModelFactory::getInstance('currency');
        $currencies = $currencyModel
            ->select()
            ->get();

        Response()->json(['currencies' => $currencies]);
    }

    public function set(\stdClass $request)
    {
        Auth()->verify(true);

        $currency = new \App\Objects\Currency;
        $currency->setId($request->currency);

        $currencyValidator = new CurrencyValidator($currency);
        $validationErrors = $currencyValidator
            ->errors()
            ->messages();

        if (!empty($validationErrors)) {
            Response()->json(['errors' => $validationErrors]);
        }

        $settingsController = new SettingsController;
        $settingsController->update($request);
    }
}