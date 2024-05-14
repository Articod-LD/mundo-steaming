<?php

namespace App\Http\Controllers;

use App\Http\Requests\paymentNequiRequest;
use App\Http\Requests\paymentPSERequest;
use App\Http\Requests\paymentRequest;
use App\Models\suscriptionType;
use App\Models\User;
use App\Services\ApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Tzsk\Payu\Concerns\Attributes;
use Tzsk\Payu\Concerns\Customer;
use Tzsk\Payu\Concerns\Transaction;
use Tzsk\Payu\Facades\Payu;

class PaymentController extends Controller
{
    protected $apiService;

    public function __construct(ApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    public function index()
    {
        $response = $this->apiService->request('post', null, [
            'command' => 'GET_PAYMENT_METHODS'
        ], true);

        if ($response === null) {
            return response()->json(['error' => 'Error al realizar la solicitud'], 500);
        }

        return $response;
    }

    function ping()
    {

        $response = $this->apiService->request('post', null, [
            'command' => 'PING'
        ], true);


        return  $response;
    }


    function bankList()
    {
        $response = $this->apiService->request('post', null, [
            'command' => 'GET_BANKS_LIST',
            "bankListInformation" => [
                "paymentMethod" => "PSE",
                "paymentCountry" => "CO"
            ]
        ], true);


        return  $response;
    }


    function SendTransactionByCard(paymentRequest $request)
    {
        $plataforma = suscriptionType::find($request->plataforma_id);
        $user = User::find($request->user_id);

        $data = [
            'command' => 'SUBMIT_TRANSACTION',
            'transaction' => [
                'order' => [
                    'accountId' => env('PAYU_API_ACCOUND_ID'),
                    'referenceCode' => 'Plataforma_' . $plataforma->name,
                    'description' => 'Compra en web de una plataforma de streaming',
                    'language' => 'es',
                    'signature' => $this->apiService->generateSignature('Plataforma_' . $plataforma->name, $plataforma->precio, 'COP'),
                    "notifyUrl" => "http://www.payu.com/notify",
                    "additionalValues" => [
                        "TX_VALUE" => [
                            "value" => $plataforma->precio,
                            "currency" => "COP"
                        ],
                        "TX_TAX" => [
                            "value" => 0,
                            "currency" => "COP"
                        ],
                    ],
                    'buyer' => [
                        "merchantBuyerId" => $user->id,
                        "fullName" => $user->name,
                        "emailAddress" => $user->email,
                        "contactPhone" => $user->telefono,
                        "dniNumber" => $user->documento,
                        "shippingAddress" => [
                            "street1" => $user->direccion,
                            "city" => "Bogotá",
                            "state" => "Bogotá D.C.",
                            "country" => "CO",
                            "postalCode" => "000000",
                            "phone" => $user->telefono
                        ]
                    ],
                    "shippingAddress" => [
                        "street1" => $user->direccion,
                        "city" => "Bogotá",
                        "state" => "Bogotá D.C.",
                        "country" => "CO",
                        "postalCode" => "000000",
                        "phone" => $user->telefono
                    ]
                ],
                'payer' => [
                    "merchantPayerId" => $user->id,
                    "fullName" => $user->name,
                    "emailAddress" => $user->email,
                    "contactPhone" => $user->telefono,
                    "dniNumber" => $user->documento,
                    "billingAddress" => [
                        "street1" => $user->direccion,
                        "city" => "Bogotá",
                        "country" => "CO",
                    ]
                ],
                'creditCard' => [
                    "number" => $request->card_number,
                    "securityCode" => $request->card_cvv,
                    "expirationDate" => $request->expirationDate,
                    "name" => 'APPROVED'
                ],
                "extraParameters" => [
                    "INSTALLMENTS_NUMBER" => 1
                ],
                "type" => "AUTHORIZATION_AND_CAPTURE",
                "paymentMethod" => "VISA",
                "paymentCountry" => "CO",
                "deviceSessionId" => "vghs6tvkcle931686k1900o6e1",
                "ipAddress" => "127.0.0.1",
                "cookie" => "pt1t38347bs6jc9ruv2ecpv7o2",
                "userAgent" => "Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0",
                "threeDomainSecure" => [
                    "embedded" => false,
                    "eci" => "01",
                    "cavv" => "AOvG5rV058/iAAWhssPUAAADFA==",
                    "xid" => "Nmp3VFdWMlEwZ05pWGN3SGo4TDA=",
                    "directoryServerTransactionId" => "00000-70000b-5cc9-0000-000000000cb"
                ]
            ]
        ];

        $response = $this->apiService->request('post', null, $data);

        return $response;
    }

    function SendTransactionByNequi(paymentNequiRequest $request)
    {
        $plataforma = suscriptionType::find($request->plataforma_id);
        $user = User::find($request->user_id);

        $data = [
            'command' => 'SUBMIT_TRANSACTION',
            'transaction' => [
                'order' => [
                    'accountId' => env('PAYU_API_ACCOUND_ID'),
                    'referenceCode' => 'Plataforma_' . $plataforma->name,
                    'description' => 'Compra en web de una plataforma de streaming',
                    'language' => 'es',
                    'signature' => $this->apiService->generateSignature('Plataforma_' . $plataforma->name, $plataforma->precio, 'COP'),
                    "notifyUrl" => "http://www.payu.com/notify",
                    "additionalValues" => [
                        "TX_VALUE" => [
                            "value" => $plataforma->precio,
                            "currency" => "COP"
                        ],
                        "TX_TAX" => [
                            "value" => 0,
                            "currency" => "COP"
                        ],
                    ],
                    'buyer' => [
                        "merchantBuyerId" => $user->id,
                        "fullName" => $user->name,
                        "emailAddress" => $user->email,
                        "contactPhone" =>  "57 " . $user->telefono,
                        "dniNumber" => $user->documento,
                        "shippingAddress" => [
                            "street1" => $user->direccion,
                            "city" => "Bogotá",
                            "state" => "Bogotá D.C.",
                            "country" => "CO",
                            "postalCode" => "000000",
                            "phone" => "57 " . $user->telefono,
                        ]
                    ],
                    "shippingAddress" => [
                        "street1" => $user->direccion,
                        "city" => "Bogotá",
                        "state" => "Bogotá D.C.",
                        "country" => "CO",
                        "postalCode" => "000000",
                        "phone" =>  "57 " . $user->telefono,
                    ]
                ],
                'payer' => [
                    "merchantPayerId" => $user->id,
                    "fullName" => $user->name,
                    "emailAddress" => $user->email,
                    "contactPhone" =>  "57 " . $user->telefono,
                    "dniNumber" => $user->documento,
                    "billingAddress" => [
                        "street1" => $user->direccion,
                        "city" => "Bogotá",
                        "country" => "CO",
                    ]
                ],
                "type" => "AUTHORIZATION_AND_CAPTURE",
                "paymentMethod" => "NEQUI",
                "paymentCountry" => "CO",
                "deviceSessionId" => "vghs6tvkcle931686k1900o6e1",
                "ipAddress" => "127.0.0.1",
                "cookie" => "pt1t38347bs6jc9ruv2ecpv7o2",
                "userAgent" => "Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0",
                "threeDomainSecure" => [
                    "embedded" => false,
                    "eci" => "01",
                    "cavv" => "AOvG5rV058/iAAWhssPUAAADFA==",
                    "xid" => "Nmp3VFdWMlEwZ05pWGN3SGo4TDA=",
                    "directoryServerTransactionId" => "00000-70000b-5cc9-0000-000000000cb"
                ]
            ]
        ];


        $response = $this->apiService->request('post', null, $data);

        return $response;
    }

    function SendTransactionByPSE(paymentPSERequest $request)
    {
        $plataforma = suscriptionType::find($request->plataforma_id);
        $user = User::find($request->user_id);
        $data = [
            'command' => 'SUBMIT_TRANSACTION',
            'transaction' => [
                'order' => [
                    'accountId' => env('PAYU_API_ACCOUND_ID'),
                    'referenceCode' => 'Plataforma_' . $plataforma->name,
                    'description' => 'Compra en web de una plataforma de streaming',
                    'language' => 'es',
                    'signature' => $this->apiService->generateSignature('Plataforma_' . $plataforma->name, $plataforma->precio, 'COP'),
                    "notifyUrl" => "http://www.payu.com/notify",
                    "additionalValues" => [
                        "TX_VALUE" => [
                            "value" => $plataforma->precio,
                            "currency" => "COP"
                        ],
                        "TX_TAX" => [
                            "value" => 0,
                            "currency" => "COP"
                        ],
                    ],
                    'buyer' => [
                        "merchantBuyerId" => $user->id,
                        "fullName" => $user->name,
                        "emailAddress" => $user->email,
                        "contactPhone" =>  "57 " . $user->telefono,
                        "dniNumber" => $user->documento,
                        "shippingAddress" => [
                            "street1" => $user->direccion,
                            "city" => "Bogotá",
                            "state" => "Bogotá D.C.",
                            "country" => "CO",
                            "postalCode" => "000000",
                            "phone" => "57 " . $user->telefono,
                        ]
                    ],
                    "shippingAddress" => [
                        "street1" => $user->direccion,
                        "city" => "Bogotá",
                        "state" => "Bogotá D.C.",
                        "country" => "CO",
                        "postalCode" => "000000",
                        "phone" =>  "57 " . $user->telefono,
                    ]
                ],
                'payer' => [
                    "merchantPayerId" => $user->id,
                    "fullName" => $user->name,
                    "emailAddress" => $user->email,
                    "contactPhone" =>  "57 " . $user->telefono,
                    "dniNumber" => $user->documento,
                    "billingAddress" => [
                        "street1" => $user->direccion,
                        "city" => "Bogotá",
                        "country" => "CO",
                    ]
                ],
                "extraParameters" => [
                    "RESPONSE_URL" => "http://www.payu.com/response",
                    "PSE_REFERENCE1" => "127.0.0.1",
                    "FINANCIAL_INSTITUTION_CODE" => $request->FINANCIAL_INSTITUTION_CODE,
                    "USER_TYPE" => $request->USER_TYPE,
                    "PSE_REFERENCE2" => $request->PSE_REFERENCE2,
                    "PSE_REFERENCE3" => "123456789"
                ],
                "type" => "AUTHORIZATION_AND_CAPTURE",
                "paymentMethod" => "PSE",
                "paymentCountry" => "CO",
                "deviceSessionId" => "vghs6tvkcle931686k1900o6e1",
                "ipAddress" => "127.0.0.1",
                "cookie" => "pt1t38347bs6jc9ruv2ecpv7o2",
                "userAgent" => "Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0",
                "threeDomainSecure" => [
                    "embedded" => false,
                    "eci" => "01",
                    "cavv" => "AOvG5rV058/iAAWhssPUAAADFA==",
                    "xid" => "Nmp3VFdWMlEwZ05pWGN3SGo4TDA=",
                    "directoryServerTransactionId" => "00000-70000b-5cc9-0000-000000000cb"
                ]
            ]
        ];

        $response = $this->apiService->request('post', null, $data);

        return $response;
    }

    function getPaymentByOrderId(Request $request, string $orderId)
    {
        $response = $this->apiService->request('post', null, [
            "command" => "ORDER_DETAIL",
            "details" => [
                "orderId" => $orderId
            ]
        ], true);

        return $response;
    }

    function getPaymentByTransationId(Request $request, string $transactionId)
    {
        $response = $this->apiService->request('post', null, [
            "command" => "TRANSACTION_RESPONSE_DETAIL",
            "details" => [
                "transactionId" => $transactionId
            ]
        ], true);

        return $response;
    }

    function getPaymentByReferenceId(Request $request, string $referenceCode)
    {
        $response = $this->apiService->request('post', null, [
            "command" => "ORDER_DETAIL_BY_REFERENCE_CODE",
            "details" => [
                "referenceCode" => $referenceCode
            ]
        ], true);

        return $response;
    }
}
