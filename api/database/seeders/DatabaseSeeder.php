<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Enums\Permission as EnumsPermission;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Permission::firstOrCreate(['name' => EnumsPermission::SUPER_ADMIN]);
        Permission::firstOrCreate(['name' => EnumsPermission::CUSTOMER]);


        $user = User::create([
            'name'     => 'Usuario Admin',
            'email'    => 'admin@mundostreaming.com',
            'password' => Hash::make('mundostreamingadmin'),
            'documento' => '123456789',
            'telefono' => '123456789',
            'direccion' => 'direccion mundo streaming',
        ]);
        $permissions = [EnumsPermission::SUPER_ADMIN];
        $user->givePermissionTo($permissions);
    }
}
