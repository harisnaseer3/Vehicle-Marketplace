<?php

namespace App\Http\Requests\Reviews;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
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
            'post_id' => 'required|exists:posts,id',
            'rating' => 'required|integer|between:1,5',
            'title' => 'required|string|max:255',
            'comment' => 'required|string|min:10|max:1000'
        ];
    }

    public function messages(): array
    {
        return [
            'post_id.required' => 'The post ID is required.',
            'post_id.exists' => 'The selected post does not exist.',
            'rating.required' => 'Please provide a rating between 1 and 5.',
            'rating.between' => 'Rating must be between 1 and 5.',
            'title.required' => 'Please provide a review title.',
            'comment.required' => 'Please provide a detailed comment.',
        ];
    }
}
