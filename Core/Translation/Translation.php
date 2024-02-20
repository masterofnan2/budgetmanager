<?php
namespace Core\Translation;

class Translation
{
    protected $currentLanguage = "en";
    protected $languages = ['en', 'fr', 'es'];
    protected static $_instance;

    public function __construct(string $language)
    {
        if (array_search($language, $this->languages) !== false) {
            $this->currentLanguage = $language;
        }
    }

    public static function getInstance(string $language): Translation
    {
        if (!self::$_instance) {
            self::$_instance = new Translation($language);
        }

        return self::$_instance;
    }

    public function translate(string $translationKey): string
    {
        $resource = require(dirname(__DIR__) . "/etc/translations_resources/{$this->currentLanguage}.php");

        if (is_array($resource) && array_key_exists($translationKey, $resource)) {
            return $resource[$translationKey];
        }

        return $translationKey;
    }

    public function getLanguages(): array
    {
        return $this->languages;
    }
}