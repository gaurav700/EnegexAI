<?php

return [

    'default' => env('CACHE_DRIVER', 'file'),

    'stores' => [
        'array' => [
            'driver' => 'array',
        ],

        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
        ],
    ],

    'prefix' => env('CACHE_PREFIX', 'lumen_cache'),

];
