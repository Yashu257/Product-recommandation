<?php
/**
 * Application configuration and shared bootstrap.
 *
 * NOTE: The credentials below are a demo store so the flow works out of the box.
 * Replace `authenticate_user()` with a real database / password_hash() lookup
 * in production.
 */

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Strict',
    ]);
}

/**
 * Demo credential store. Passwords are stored as bcrypt hashes.
 * Default demo login -> username: admin | password: admin123
 *
 * @var array<string, string> $USERS  username => password_hash
 */
$USERS = [
    'admin' => '$2y$10$dkev01i7WZCRsZL5FAz4XOZSPw/5ODqwXPifHk/dJZagrqQ9mXk/q', // admin123
];

/**
 * Verify a username / password pair against the credential store.
 */
function authenticate_user(string $username, string $password): bool
{
    global $USERS;

    $username = trim($username);

    if (!isset($USERS[$username])) {
        return false;
    }

    return password_verify($password, $USERS[$username]);
}

/**
 * Whether the current session belongs to a logged-in user.
 */
function is_logged_in(): bool
{
    return !empty($_SESSION['user']);
}
