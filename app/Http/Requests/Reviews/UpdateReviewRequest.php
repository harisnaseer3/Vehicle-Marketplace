<?php

namespace App\Http\Requests\Reviews;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
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
            'rating' => 'sometimes|integer|between:1,5',
            'title' => 'sometimes|string|max:255',
            'comment' => 'sometimes|string|min:10|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'rating.between' => 'Rating must be between 1 and 5.',
            'title.max' => 'Title cannot exceed 255 characters.',
            'comment.min' => 'Comment must be at least 10 characters.',
            'comment.max' => 'Comment cannot exceed 1000 characters.',
        ];
    }
}
