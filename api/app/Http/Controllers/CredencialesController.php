<?php

namespace App\Http\Controllers;

use App\Exceptions\ShopException;
use App\Http\Requests\CredencialesCreateRequest;
use App\Models\credenciales;
use Illuminate\Http\Request;

class CredencialesController extends Controller
{

    public $repository;

    public function __construct(credenciales $repository)
    {
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $credenciales = $this->repository::with([])->get();
        return response()->json(['credenciales' => $credenciales], 200);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create(CredencialesCreateRequest  $request)
    {
        try {
            $validatedData = $request->all();
            return $this->repository->create($validatedData);
        } catch (ShopException $e) {
            throw new ShopException('COULD_NOT_CREATE_THE_RESOURCE');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
