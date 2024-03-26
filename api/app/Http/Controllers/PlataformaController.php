<?php

namespace App\Http\Controllers;

use App\Exceptions\ShopException;
use App\Http\Requests\PlataformaCreateRequest;
use App\Models\suscriptionType;
use Illuminate\Http\Request;

class PlataformaController extends Controller
{


    public $repository;

    public function __construct(suscriptionType $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->repository->with(['credenciales' => function ($query) {
            $query->where('is_active', true);
        }])->get();
    }

    public function plataformasDisponibles()
    {
        return $this->repository->with([])->whereHas('credenciales', function ($query) {
            $query->where('is_active', true);
        })->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(PlataformaCreateRequest $request)
    {
        try {
            $validatedData = $request->all();
            // dd($validatedData);
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
