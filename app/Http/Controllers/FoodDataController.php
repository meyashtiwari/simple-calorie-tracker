<?php

namespace App\Http\Controllers;

use App\Models\FoodData;
use Illuminate\Http\Request;
use Illuminate\Log\Logger;

class FoodDataController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth()->user();
        $data = FoodData::where('user_id', $user->id)->whereRaw('date(taken_at) = date(now())')->get();
        $metaData = FoodData::selectRaw('count(*) as count, SUM(calorie_value) as calories_today')
                            ->whereRaw('date(taken_at) = date(now())')
                            ->get();
        return response(json_encode(["data" => $data, "metaData" => $metaData]));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'calorie_value' => 'required',
            'taken_at' => 'required'
        ]);

        FoodData::create([
            'user_id' => auth()->user()->id,
            'name' => $validated['name'],
            'calorie_value' => $validated['calorie_value'],
            'taken_at' => date("Y-m-d H:i:s", strtotime($validated['taken_at']))
        ]);

        return response(json_encode(["error" => false]), 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = FoodData::where('id', $id)->get();

        return response(json_encode($data), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required',
            'calorie_value' => 'required',
        ]);

        FoodData::where('id', $id)->update([
            'name' => $validated['name'],
            'calorie_value' => $validated['calorie_value'],
        ]);

        return response(json_encode(["error" => false]), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        FoodData::where('id', $id)->delete();
    }
}
