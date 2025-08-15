<?php

namespace App\Observers;

use App\Models\Deal;
use App\Models\Post;

class DealObserver
{
    /**
     * Handle the Deal "created" event.
     */
    public function created(Deal $deal): void
    {
        //
    }

    /**
     * Handle the Deal "updated" event.
     */
    public function updated(Deal $deal): void
    {
        if ($deal->wasChanged('status') && $deal->status === 'completed') {
            $deal->post->update(['status' => 'sold']);
        }
    }

    /**
     * Handle the Deal "deleted" event.
     */
    public function deleted(Deal $deal): void
    {
        //
    }

    /**
     * Handle the Deal "restored" event.
     */
    public function restored(Deal $deal): void
    {
        //
    }

    /**
     * Handle the Deal "force deleted" event.
     */
    public function forceDeleted(Deal $deal): void
    {
        //
    }
}
