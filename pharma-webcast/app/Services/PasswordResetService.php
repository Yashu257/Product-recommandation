<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\UserRepository;
use App\Helpers\TokenHelper;
use Core\Security\PasswordHasher;
use Core\Exceptions\AuthException;
use Core\Logger\Logger;

class PasswordResetService
{
    private readonly UserRepository $users;
    private readonly PasswordHasher $hasher;
    private readonly array          $authConfig;

    public function __construct()
    {
        $this->authConfig = require BASE_PATH . '/config/auth.php';
        $this->hasher     = new PasswordHasher($this->authConfig['password']);
        $this->users      = new UserRepository();
    }

    /**
     * Issue a password-reset token for the given email.
     * Returns the token so the calling controller can pass it to the mailer.
     * Returns null silently if email not found (prevents user enumeration).
     */
    public function requestReset(string $email): ?array
    {
        $user = $this->users->findByEmail($email);
        if ($user === null) {
            // Silent — do not reveal whether the email exists
            Logger::getInstance()->info('Password reset requested for unknown email.', ['email' => $email]);
            return null;
        }

        $token     = TokenHelper::generateResetToken();
        $expiresAt = date('Y-m-d H:i:s', time() + ($this->authConfig['password']['reset_token_expires'] * 60));

        $this->users->setResetToken((int) $user->id, $token, $expiresAt);

        Logger::getInstance()->info('Password reset token issued.', ['user_id' => $user->id]);

        return [
            'user'       => $user,
            'token'      => $token,
            'expires_at' => $expiresAt,
        ];
    }

    /**
     * Validate reset token and update the password.
     *
     * @throws AuthException if token is invalid, expired, or user not found
     */
    public function resetPassword(string $token, string $newPassword): void
    {
        $user = $this->users->findByResetToken($token);
        if ($user === null) {
            throw new AuthException('This password reset link is invalid or has expired.', 400);
        }

        $this->users->updatePassword((int) $user->id, $this->hasher->hash($newPassword));

        Logger::getInstance()->info('Password reset completed.', ['user_id' => $user->id]);
    }

    /** Verify the token is valid without resetting (used by the reset form GET). */
    public function validateToken(string $token): bool
    {
        return $this->users->findByResetToken($token) !== null;
    }
}
