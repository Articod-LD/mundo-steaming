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
        Permission::firstOrCreate(['name' => EnumsPermission::PROVIDER]);


        $user = User::create([
            'name'     => 'Usuario Admin',
            'email'    => 'admin@mundostreaming.com',
            'password' => Hash::make('mundostreamingadmin')
        ]);
        $permissions = [EnumsPermission::SUPER_ADMIN];
        $user->givePermissionTo($permissions);


        
        $user = User::create([
            'name'     => 'Usuario Cliente',
            'email'    => 'cliente@mundostreaming.com',
            'password' => Hash::make('mundostreamingadmin')
        ]);
        $permissions = [EnumsPermission::CUSTOMER];
        $user->givePermissionTo($permissions);


                
        $user = User::create([
            'name'     => 'Usuario PROVEEDOR',
            'email'    => 'PROVIDER@mundostreaming.com',
            'password' => Hash::make('mundostreamingadmin')
        ]);
        $permissions = [EnumsPermission::PROVIDER];
        $user->givePermissionTo($permissions);
    }
}
