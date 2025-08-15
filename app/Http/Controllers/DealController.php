<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DealController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $deals = Deal::with(['buyer', 'seller', 'post'])
            ->latest()
            ->paginate(10);

        return $this->sendResponse($deals, 'Deals retrieved successfully.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'buyer_id' => 'required|exists:users,id',
            'seller_id' => 'required|exists:users,id',
            'post_id' => 'required|exists:posts,id',
            'price' => 'required|numeric|min:1',
            'notes' => 'nullable|string'
        ]);

        $deal = Deal::create($validated);

        return $this->sendResponse($deal, 'Deal created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Deal $deal)
    {
        return $this->sendResponse($deal->load(['buyer', 'seller', 'post']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Deal $deal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Deal $deal)
    {
        try {
            DB::beginTransaction();
            $validated = $request->validate([
                'status' => 'sometimes|in:pending,completed,cancelled',
                'notes' => 'nullable|string'
            ]);
            if ($request->status === 'completed') {
                $validated['completed_at'] = now();
            }
            $deal->update($validated);

            DB::commit();
            return $this->sendResponse($deal, 'Deal updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Deal $deal)
    {
        try {
            $deal->delete();
            return $this->sendResponse([], 'Deal deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode());
        }

    }
}
