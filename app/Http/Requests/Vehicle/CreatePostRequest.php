<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Foundation\Http\FormRequest;

class CreatePostRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'make' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'mileage' => 'nullable|integer|min:0',
            'transmission_type' => 'nullable|in:automatic,manual,semi-automatic',
            'fuel_type' => 'nullable|in:petrol,diesel,electric,hybrid,lpg,cng,bio-diesel,other',
            'body_type' => 'nullable|in:sedan,suv,hatchback,coupe,convertible,wagon,van,pickup,truck,other',
            'condition' => 'nullable|in:new,used,certified-pre-owned,salvage',
            'location' => 'nullable|string|max:255',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_featured' => 'nullable|boolean',
        ];
    }
}
