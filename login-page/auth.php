<?php
/**
 * Login form handler.
 *
 * Accepts a POST from index.php, validates the credentials, and either starts
 * an authenticated session (-> dashboard.php) or bounces back to the form with
 * an error flag preserved in the session.
 */

declare(strict_types=1);

require __DIR__ . '/config.php';

// Only POST is allowed here.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

$username = isset($_POST['username']) ? trim((string) $_POST['username']) : '';
$password = isset($_POST['password']) ? (string) $_POST['password'] : '';
$remember = !empty($_POST['remember']);

if ($username === '' || $password === '') {
    $_SESSION['login_error'] = 'Please enter both username and password.';
    $_SESSION['old_username'] = $username;
    header('Location: index.php');
    exit;
}

if (authenticate_user($username, $password)) {
    // Prevent session fixation on privilege change.
    session_regenerate_id(true);

    $_SESSION['user'] = $username;
    unset($_SESSION['login_error'], $_SESSION['old_username']);

    // Extend the session cookie lifetime when "Remember me" is checked.
    if ($remember) {
        $params = session_get_cookie_params();
        setcookie(session_name(), session_id(), [
            'expires'  => time() + 60 * 60 * 24 * 30, // 30 days
            'path'     => $params['path'],
            'httponly' => true,
            'samesite' => 'Strict',
        ]);
    }

    header('Location: dashboard.php');
    exit;
}

$_SESSION['login_error'] = 'Invalid username or password.';
$_SESSION['old_username'] = $username;
header('Location: index.php');
exit;
