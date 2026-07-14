<?php

declare(strict_types=1);

namespace App\Controllers\Auth;

use Core\Http\Request;
use Core\Http\Response;
use Core\Validation\Validator;
use Core\Exceptions\ValidationException;
use Core\Exceptions\AuthException;
use Core\Session\Session;
use App\Services\AuthService;
use App\Services\EmailVerificationService;

class RegisterController
{
    private readonly AuthService              $authService;
    private readonly EmailVerificationService $verificationService;

    public function __construct()
    {
        $this->authService         = new AuthService();
        $this->verificationService = new EmailVerificationService();
    }

    public function showForm(Request $request): Response
    {
        // Controller only dispatches to view — no logic here
        ob_start();
        include APP_PATH . '/Views/auth/register.php';
        return Response::make(ob_get_clean());
    }

    public function register(Request $request): Response
    {
        try {
            $data = (new Validator($request->all(), [
                'first_name' => 'required|max:100',
                'last_name'  => 'required|max:100',
                'email'      => 'required|email|max:180',
                'password'   => 'required|min:8|max:255|password_strength|confirmed',
                'phone'      => 'nullable|max:30',
                'job_title'  => 'nullable|max:150',
                'company'    => 'nullable|max:200',
                'country'    => 'nullable|max:100',
            ]))->validate();

            $user = $this->authService->register($data);

            // TODO: dispatch VerificationEmailJob — mailer wired in a future step
            // MailService::send(new VerificationEmail($user));

            Session::flash('success', 'Account created! Please check your email to verify your account.');
            return Response::redirect('/register/confirm');

        } catch (ValidationException $e) {
            Session::flash('errors', $e->errors());
            Session::flashOld($request->all());
            return Response::redirect('/register');

        } catch (AuthException $e) {
            Session::flash('error', $e->getMessage());
            Session::flashOld($request->all());
            return Response::redirect('/register');
        }
    }
}
