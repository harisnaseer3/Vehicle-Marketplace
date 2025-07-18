<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'make' => 'sometimes|string|max:100',
            'model' => 'sometimes|string|max:100',
            'year' => 'sometimes|integer|min:1900|max:' . (date('Y') + 1),
            'mileage' => 'nullable|integer|min:0',
            'transmission_type' => 'nullable|in:automatic,manual,semi-automatic',
            'fuel_type' => 'nullable|in:petrol,diesel,electric,hybrid,lpg,cng,bio-diesel,other',
            'body_type' => 'nullable|in:sedan,suv,hatchback,coupe,convertible,wagon,van,pickup,truck,other',
            'condition' => 'nullable|in:new,used,certified-pre-owned,salvage',
            'location' => 'nullable|string|max:255',
            'is_featured' => 'nullable|boolean',
            'images' => 'nullable|array',
            'images.*' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
