<?php

namespace App\Classes;

class StatusEnum
{

    public const USER = "user";
    public const GUEST = "guest";

    public const CAR = "Cars";
    public const BIKE = "Bikes";
    public const AUTO_PARTS = "Auto Parts";

    public const POST_RELATIONSHIP = ['user', 'category', 'make', 'model', 'vehicleRegister'];
    public const TRANSMISSION_TYPE = ['automatic', 'manual', 'semi-automatic'];
    public const FUEL_TYPE = ['petrol', 'diesel', 'electric', 'hybrid', 'lpg', 'cng', 'bio-diesel', 'other'];
    public const BODY_TYPE = ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'van', 'pickup', 'truck', 'other'];
    public const CONDITION = ['new', 'used', 'certified-pre-owned', 'salvage'];
}
