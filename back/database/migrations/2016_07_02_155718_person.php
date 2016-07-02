<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Person extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('person', function (Blueprint $table) {
          $table->increments('id');
          $table->enum('gender', ['male', 'female']);
          $table->enum('age-range',['baby','child', 'adult', 'elder']);
          $table->integer('')
          $table->timestamps('report_id');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('person');
    }
}
