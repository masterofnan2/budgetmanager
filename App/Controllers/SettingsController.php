<?php
namespace App\Controllers;

use App\Model\ModelFactory;
use Core\Validator\SettingsValidator;

class SettingsController extends Controller
{
    public function create()
    {
        $settings = new \App\Objects\Settings;
        $settings
            ->setConsumer(Auth()->user()->get('id'))
            ->setLanguage($_SERVER['HTTP_CONTENT_LANGUAGE']);

        $settingsModel = ModelFactory::getInstance('settings');

        $settingsData = $settingsModel
            ->create($settings->get('consumer_id', 'language'))
            ->save();

        if ($settingsData) {
            $currencyController = new CurrenciesController;
            $currency = $currencyController->getDefault();

            $settingsData->currency = $currency;
            Auth()->setSettings($settingsData);
        }
    }

    public function update(\stdClass $request)
    {
        Auth()->verify(true);

        $settingsModel = ModelFactory::getInstance('settings');
        $currentSettingsData = $settingsModel
            ->select()
            ->where(['consumer_id' => Auth()->user()->get('id')])
            ->first();

        if ($settingsModel) {
            $currentSettings = new \App\Objects\Settings;
            $currentSettings
                ->setId($currentSettingsData->id)
                ->setConsumer(Auth()->user()->get('id'))
                ->setLanguage($currentSettingsData->language)
                ->setCurrency($currentSettingsData->currency_id);

            $newSettings = new \App\Objects\Settings;
            $newSettings
                ->setConsumer(Auth()->user()->get('id'))
                ->setLanguage($request->language ?? $currentSettingsData->language)
                ->setCurrency($request->currency_id ?? $currentSettingsData->currency_id)
                ->setId($currentSettingsData->id);

            $changes = array_keys(array_diff($newSettings->get('language', 'currency_id'), $currentSettings->get('language', 'currency_id')));

            if (!empty($changes)) {
                $settingsValidator = new SettingsValidator($newSettings);
                $validationErrors = $settingsValidator
                    ->errors()
                    ->messages($changes);

                if (!empty($validationErrors)) {
                    Response()->json(['errors' => $validationErrors]);
                }

                Response()->json([
                    'success' => $settingsModel
                        ->update($newSettings->get('language', 'currency_id'))
                        ->save()
                ]);
            }
        }
    }
}