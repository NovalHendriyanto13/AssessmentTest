<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

use App\Models\User;
use App\Mail\CreateUserMail;
use App\Mail\AlertNewUserMail;

class CreateUserMailJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public User $user
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $adminEmails = User::query()
                ->select([
                    'email'
                ])
                ->where('active', true)
                ->where('role', 'administrator')
                ->pluck('email')
                ->toArray();

            // send to administrator
            Mail::to($adminEmails)->send(new AlertNewUserMail($this->user));
            
            // send to user
            Mail::to($this->user->email)->send(new CreateUserMail($this->user));

        } catch (\Exception $e) {
            Log::debug($e->getMessage());
        }

    }
}
