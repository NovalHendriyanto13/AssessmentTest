<?php
namespace App\Http\DTO\Api;

class BaseDTO
{
    public function __construct() {}

    public static function fromItem($data)
    {
        $items = static::setItems($data);
        return $items;
    }

    public static function setItems($data) 
    {
        return [];
    }
}