<?php

namespace App\Http\Controllers;

use App\Exceptions\ShopException;
use App\Http\Requests\soporteRequest;
use App\Models\soporte;
use Illuminate\Http\Request;

class SoporteController extends Controller
{
    public $repository;

    public function __construct(soporte $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(soporteRequest $request)
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


    function soportes(Request $request)
    {
        $limit = $request->limit ? $request->limit : 15;
        $soportes = $this->repository
            ->paginate($limit);

        return $soportes;
    }
}
