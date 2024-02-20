<?php
namespace Core\Validator;

class Validator
{
    protected $object;
    protected $messages = [];

    public function __construct(object $object)
    {
        $this->object = $object;
    }

    public function errors(): Validator
    {
        $object = $this->object;
        $properties = array_keys($object->get());

        if (!empty($properties)) {
            foreach ($properties as $property) {
                if (method_exists($this, $property)) {
                    $this->$property();
                }
            }
        }
        return $this;
    }

    public function messages(): array
    {
        $args = func_get_args();
        $errors_keys = array_keys($this->messages);
        $messages = [];

        if (!empty($args)) {
            foreach ($args as $arg) {
                if (is_array($arg)) {
                    foreach($arg as $key){
                        if (array_search($key, $errors_keys) !== false) {
                            $messages[$key] = $this->messages[$key];
                        }
                    }
                } else {
                    if (array_search($arg, $errors_keys) !== false) {
                        $messages[$arg] = $this->messages[$arg];
                    }
                }
            }
            return $messages;
        }
        return $this->messages;
    }
}