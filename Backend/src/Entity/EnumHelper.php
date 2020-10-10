<?php

namespace App\Entity;

class EnumHelper
{
    public static function getEnum(array $data)
    {
        $ret = [];
        foreach ($data as $elt) {
            $ret[] = $elt['value'];
        };
        return $ret;
    }
}
