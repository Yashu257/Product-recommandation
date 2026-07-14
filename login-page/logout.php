<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

// Clear session data and the session cookie, then return to the login form.
$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires'  => time() - 42000,
        'path'     => $params['path'],
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
}

session_destroy();

header('Location: index.php');
exit;
