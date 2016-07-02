<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class SessionController extends Controller
{
  public function login(Request $request){
    return response()->json(['status' => 'ok','customer' => ['email' => 'customer@hogar.com']], 201);
  }

  public function logout(){
    return response()->json(['status' => 'ok'], 200);
  }
}
