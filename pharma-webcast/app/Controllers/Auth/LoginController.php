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
use App\Helpers\TokenHelper;

class LoginController
{
    private readonly AuthService $authService;
    private readonly array       $authConfig;

    public function __construct()
    {
        $this->authService = new AuthService();
        $this->authConfig  = require BASE_PATH . '/config/auth.php';
    }

    public function showForm(Request $request): Response
    {
        ob_start();
        include APP_PATH . '/Views/auth/login.php';
        return Response::make(ob_get_clean());
    }

    public function login(Request $request): Response
    {
        try {
            $data = (new Validator($request->all(), [
                'email'    => 'required|email|max:180',
                'password' => 'required|min:1|max:255',
            ]))->validate();

            $remember = (bool) $request->input('remember_me');

            $result = $this->authService->login(
                email:     $data['email'],
                password:  $data['password'],
                remember:  $remember,
                ip:        $request->ip(),
                userAgent: $request->userAgent(),
            );

            // Set remember-me cookie if requested
            if ($remember) {
                $cookieName = $this->authConfig['user']['cookie_name'];
                $lifetime   = $this->authConfig['user']['remember_lifetime'] * 60;
                setcookie(
                    $cookieName,
                    $result['token'],
                    [
                        'expires'  => time() + $lifetime,
                        'path'     => '/',
                        'secure'   => (bool) ($_ENV['SESSION_SECURE'] ?? false),
                        'httponly' => true,
                        'samesite' => 'Lax',
                    ]
                );
            }

            // Redirect to originally intended URL if saved
            $intended = Session::getFlash('intended', '/profile');
            return Response::redirect($intended);

        } catch (ValidationException $e) {
            Session::flash('errors', $e->errors());
            Session::flashOld($request->only('email'));   // never flash password
            return Response::redirect('/login');

        } catch (AuthException $e) {
            Session::flash('error', $e->getMessage());
            Session::flashOld($request->only('email'));
            return Response::redirect('/login');
        }
    }

    public function logout(Request $request): Response
    {
        $authConfig = $this->authConfig;
        $identity   = Session::get($authConfig['user']['session_key']);

        if ($identity && !empty($identity['token'])) {
            $this->authService->logout($identity['token']);
        }

        // Delete remember-me cookie
        $cookieName = $authConfig['user']['cookie_name'];
        setcookie($cookieName, '', time() - 3600, '/', '', (bool) ($_ENV['SESSION_SECURE'] ?? false), true);

        Session::destroy();
        return Response::redirect('/login');
    }
}
