<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UserCreateRequest extends FormRequest
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
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users'],
            'password' => ['required', 'string'],
            'documento' => ['required', 'string'],
            'telefono' => ['required', 'string'],
            'direccion' => ['required', 'string'],
        ];
    }


    public function messages()
    {
        return [
            'name.required'      => 'Name is required',
            'name.string'        => 'Name is not a valid string',
            'name.max:255'       => 'Name can not be more than 255 character',
            'email.required'     => 'email is required',
            'email.email'        => 'email is not a valid email address',
            'email.unique:users' => 'email must be unique',
            'password.required'  => 'password is required',
            'password.string'    => 'password is not a valid string',
            'documento.required'      => 'documento is required',
            'documento.string'        => 'documento is not a valid string',
            'telefono.required'      => 'telefono is required',
            'telefono.string'        => 'telefono is not a valid string',
            'direccion.required'      => 'direccion is required',
            'direccion.string'        => 'direccion is not a valid string',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
