<?php

/*
 * This file was copied from the FOSRestBundle package.
 *
 * (c) FriendsOfSymfony <http://friendsofsymfony.github.com/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file at https://github.com/FriendsOfSymfony/FOSRestBundle/blob/master/LICENSE
 *
 * Original @author Ener-Getick <egetick@gmail.com>
 */

namespace App\Serializer;

use FOS\RestBundle\Serializer\Normalizer\FormErrorNormalizer as FosRestFormErrorNormalizer;

/**
 * Serializes invalid Form instances.
 */
class FormErrorSerializer extends FosRestFormErrorNormalizer
{
    /**
     * {@inheritdoc}
     */
    public function normalize($object, $format = null, array $context = array()): array
    {
        return [
            parent::normalize($object, $format, $context)['errors']
        ];
    }
}
