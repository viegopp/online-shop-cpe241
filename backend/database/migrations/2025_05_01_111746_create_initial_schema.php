<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateInitialSchema extends Migration
{
    public function up()
    {
        DB::unprepared(file_get_contents(database_path('schema.sql')));
    }

    public function down()
    {
        
    }
}
