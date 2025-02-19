<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class createProductoRequest extends FormRequest
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
            'plataforma_id' => [
                'required',
                'exists:App\Models\plataforma,id'
            ],
            'email' => [
                'required',
                'email'
            ],
            'password' => [
                'required',
                'string'
            ],
            'perfil' => [
                'nullable',
                'string'
            ],
            'pin_perfil' => [
                'nullable',
                'numeric'
            ],
            'fecha_compra' => [
                'required'
            ],
            'meses' => [
                'required',
                'numeric',
                'min:1'
            ],
        ];
    }


    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
