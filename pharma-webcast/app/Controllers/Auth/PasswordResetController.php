<?php

declare(strict_types=1);

namespace App\Controllers\Auth;

use Core\Http\Request;
use Core\Http\Response;
use Core\Validation\Validator;
use Core\Exceptions\ValidationException;
use Core\Exceptions\AuthException;
use Core\Session\Session;
use App\Services\PasswordResetService;

class PasswordResetController
{
    private readonly PasswordResetService $service;

    public function __construct()
    {
        $this->service = new PasswordResetService();
    }

    // --- Step 1: show request form -------------------------------------------

    public function showRequest(Request $request): Response
    {
        ob_start();
        include APP_PATH . '/Views/auth/forgot-password.php';
        return Response::make(ob_get_clean());
    }

    // --- Step 2: send reset link ---------------------------------------------

    public function sendLink(Request $request): Response
    {
        try {
            $data = (new Validator($request->all(), [
                'email' => 'required|email|max:180',
            ]))->validate();

            $result = $this->service->requestReset($data['email']);

            // TODO: dispatch PasswordResetEmail — mailer wired in a future step
            // if ($result !== null) { MailService::send(new PasswordResetEmail($result)); }

            // Always show the same success message (prevents email enumeration)
            Session::flash('success', 'If that email is registered, a reset link has been sent.');
            return Response::redirect('/forgot-password');

        } catch (ValidationException $e) {
            Session::flash('errors', $e->errors());
            Session::flashOld($request->only('email'));
            return Response::redirect('/forgot-password');
        }
    }

    // --- Step 3: show reset form (validate token) ----------------------------

    public function showReset(Request $request): Response
    {
        $token = $request->getAttribute('token') ?? $request->query('token', '');

        if (!$this->service->validateToken((string) $token)) {
            Session::flash('error', 'This password reset link is invalid or has expired.');
            return Response::redirect('/forgot-password');
        }

        ob_start();
        include APP_PATH . '/Views/auth/reset-password.php';
        return Response::make(ob_get_clean());
    }

    // --- Step 4: update password ---------------------------------------------

    public function reset(Request $request): Response
    {
        try {
            $data = (new Validator($request->all(), [
                'token'                 => 'required',
                'password'              => 'required|min:8|max:255|password_strength|confirmed',
                'password_confirmation' => 'required',
            ]))->validate();

            $this->service->resetPassword($data['token'], $data['password']);

            Session::flash('success', 'Password updated. You can now log in.');
            return Response::redirect('/login');

        } catch (ValidationException $e) {
            Session::flash('errors', $e->errors());
            Session::flashOld($request->only('token'));
            return Response::redirect('/reset-password?token=' . urlencode($request->input('token', '')));

        } catch (AuthException $e) {
            Session::flash('error', $e->getMessage());
            return Response::redirect('/forgot-password');
        }
    }
}
