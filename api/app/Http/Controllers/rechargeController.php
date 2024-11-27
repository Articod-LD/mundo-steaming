<?php

namespace App\Http\Controllers;

use App\Models\recharge;
use Illuminate\Http\Request;

class rechargeController extends Controller
{

    public $repository;

    public function __construct(recharge $repository)
    {
        $this->repository = $repository;
    }


    function index()
    {
        return $this->repository->with(['user','user.permissions'])->get()
            ->values(); // Forzar a que sea un array
    }


    function find(Request $request, $user_id)
    {
        return $this->repository->with(['user'])->where('user_id',$user_id)->get()
        ->values();
    }
}
