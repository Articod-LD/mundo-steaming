<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class paymentCardRequest extends FormRequest
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
            'plataforma_id' => ['required'],
            'user_id' => ['required'],
            'card_number' => ['required', 'string', 'min:13', 'max:19'],
            'card_expiry' => ['required', 'string', 'regex:/^(0[1-9]|1[0-2])\/([0-9]{2})$/'],
            'card_cvc' => ['required', 'string', 'min:3', 'max:4'],
            'card_holder' => ['required', 'string']
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'card_number.required' => 'El número de tarjeta es obligatorio',
            'card_number.min' => 'El número de tarjeta debe tener al menos 13 dígitos',
            'card_number.max' => 'El número de tarjeta no debe exceder los 19 dígitos',
            'card_expiry.required' => 'La fecha de vencimiento es obligatoria',
            'card_expiry.regex' => 'La fecha de vencimiento debe tener el formato MM/YY',
            'card_cvc.required' => 'El código de seguridad es obligatorio',
            'card_cvc.min' => 'El código de seguridad debe tener al menos 3 dígitos',
            'card_cvc.max' => 'El código de seguridad no debe exceder los 4 dígitos',
            'card_holder.required' => 'El nombre del titular es obligatorio'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
