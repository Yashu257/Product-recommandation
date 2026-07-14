<?php

declare(strict_types=1);

namespace App\Controllers\Auth;

use Core\Http\Request;
use Core\Http\Response;
use Core\Exceptions\AuthException;
use Core\Session\Session;
use App\Services\EmailVerificationService;

class VerificationController
{
    private readonly EmailVerificationService $service;

    public function __construct()
    {
        $this->service = new EmailVerificationService();
    }

    public function verify(Request $request): Response
    {
        $token = $request->getAttribute('token') ?? '';

        try {
            $user = $this->service->verify((string) $token);
            Session::flash('success', 'Email verified. Welcome, ' . $user->first_name . '!');
            return Response::redirect('/profile');

        } catch (AuthException $e) {
            Session::flash('error', $e->getMessage());
            return Response::redirect('/login');
        }
    }

    public function resend(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = $request->getAttribute('auth_user');

        try {
            $token = $this->service->resend((int) $user->id);

            // TODO: dispatch VerificationEmail — mailer wired in a future step
            // MailService::send(new VerificationEmail($user, $token));

            if ($request->isAjax()) {
                return Response::success(null, 'Verification email sent.');
            }
            Session::flash('success', 'Verification email re-sent. Please check your inbox.');
            return Response::redirect('/verify-email/notice');

        } catch (AuthException $e) {
            if ($request->isAjax()) {
                return Response::error($e->getMessage(), 400);
            }
            Session::flash('error', $e->getMessage());
            return Response::redirect('/profile');
        }
    }
}
