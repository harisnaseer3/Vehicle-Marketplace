<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\BaseController;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\ProfileUpdateRequest;

class ProfileController extends BaseController
{
    /**
     * Display the user's profile form.
     */
    public function show()
    {
        try {
            $profile = Auth::user();
            return $this->sendResponse($profile, 'User profile fetched successfully.');
        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to fetch user profile: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }

    public function update(ProfileUpdateRequest $request)
    {
        try {
            $user = Auth::user();

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
                // You might want to trigger email verification here
            }
            $user->save();

            return $this->sendResponse($user, 'Profile updated successfully.');

        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to update profile: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request)
    {
        try {
            $request->validate([
                'password' => ['required', 'current_password'],
            ]);

            $user = $request->user();
            Auth::logout();
            $user->delete();

            return $this->sendResponse([], 'Account deleted successfully.');

        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to delete account: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }

    public function userVehicles()
    {
        try {
            $user = Auth::user();
            $vehicles = Post::where('user_id', $user->id)->get();
            return $this->sendResponse($vehicles, 'User vehicles fetched successfully.');
        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to fetch vehicles: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }
}
