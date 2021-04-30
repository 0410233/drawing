<?php

require_once '../vendor/autoload.php';

define('ROOT', __DIR__);

$request = \Symfony\Component\HttpFoundation\Request::createFromGlobals();

$response = \Drawing\DrawingToPDF::handle($request);

$response->send();

exit;
