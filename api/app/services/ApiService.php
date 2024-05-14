<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ApiService
{
  protected $baseUrl;

  public function __construct()
  {
    $this->baseUrl = rtrim(env('PAYU_URL'), '/');
  }

  public function request($method, $endpoint, $data = [], $isTest = false)
  {
    $url = $this->baseUrl;

    // Agregar el endpoint si se proporciona
    if (!is_null($endpoint)) {
      $url .= '/' . ltrim($endpoint, '/');
    }

    $data['test'] = $isTest;
    $data['language'] = 'es';
    $data['merchant'] = [
      'apiLogin' => env('PAYU_API_LOGIN'),
      'apiKey' => env('PAYU_API_KEY'),
    ];

    // dd($data);

    $response = Http::timeout(60)->withHeaders([
      'Accept' => 'application/json',
    ])->$method($url, $data);

    // dd($response);

    if ($response->successful()) {
      return $response->json();
    } else {
      return null;
    }
  }

  public static function generateSignature($referenceCode, $amount, $currency)
  {
    $signaturebefore = env('PAYU_API_KEY') . '~' . env('PAYU_API_MERCHANT_ID') . '~' . $referenceCode . '~' . $amount . '~' . $currency;
    // dd($signaturebefore);
    $signature = md5($signaturebefore);
    return $signature;
  }
}
