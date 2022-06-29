<?php

namespace App\Http\Controllers;

use App\Models\FoodData;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\DB;

class FoodDataController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //DB::enableQueryLog();
        $user = auth()->user();
        $data = FoodData::where('user_id', $user->id)->get();
        $metaData = FoodData::selectRaw('count(*) as count, SUM(calorie_value) as calories_today')
                            ->whereRaw('date(taken_at) = date(now())')
                            ->where('user_id', $user->id)
                            ->get();
        //dd(DB::getQueryLog());
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
            'taken_at' => 'required'
        ]);

        FoodData::where('id', $id)->update([
            'name' => $validated['name'],
            'calorie_value' => $validated['calorie_value'],
            'taken_at' => $validated['taken_at']
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

    public function foodAll()
    {
        
        $user = auth()->user();
        $data = FoodData::all();
    
        return response(json_encode(["data" => $data]));
        
    }
    public function foodLastSeven()
    {
        
        $user = auth()->user();
        $data = FoodData::selectRaw('count(*) as count')
        ->whereRaw('date(taken_at) > DATE(NOW() - INTERVAL 7 DAY)')
        ->get();
    
        return response(json_encode(["data" => $data]));
        
    }
    public function foodLastSevenPrev()
    {
        
        $user = auth()->user();
        $data = FoodData::selectRaw('count(*) as count')
        ->whereRaw('date(taken_at) > DATE(NOW() - INTERVAL 14 DAY)')
        ->get();
    
        return response(json_encode(["data" => $data]));
        
    }
    public function avgCalorieLastSeven()
    {
        
        $user = auth()->user();
        $data = FoodData::selectRaw('avg(calorie_value) as avg')
        ->whereRaw('date(taken_at) > DATE(NOW() - INTERVAL 7 DAY)')
        ->get();
    
        return response(json_encode(["data" => $data]));
        
    }
    public function filterFoodEntries(Request $request)
    {
        $start = $request->start;
        $end = $request->end;

        $user = auth()->user();
        
        $data = FoodData::whereRaw("date(taken_at) >= '$start'")
        ->whereRaw("date(taken_at) <= '$end'")
        ->where('user_id', $user->id)
        ->get();
        return response(json_encode(["data" => $data]));
        
    }
}
