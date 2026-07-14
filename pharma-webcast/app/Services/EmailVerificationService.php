<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use App\Helpers\TokenHelper;
use Core\Exceptions\AuthException;
use Core\Logger\Logger;

class EmailVerificationService
{
    private readonly UserRepository $users;

    public function __construct()
    {
        $this->users = new UserRepository();
    }

    /**
     * Confirm a verification token and activate the user account.
     *
     * @throws AuthException on invalid / already-used token
     */
    public function verify(string $token): User
    {
        $user = $this->users->findByVerificationToken($token);
        if ($user === null) {
            throw new AuthException('Invalid or expired verification link.', 400);
        }

        if ($user->isVerified()) {
            throw new AuthException('This email address has already been verified.', 400);
        }

        $this->users->markEmailVerified((int) $user->id);
        Logger::getInstance()->info('Email verified.', ['user_id' => $user->id]);

        // Reload to get updated record
        return $this->users->findById((int) $user->id);
    }

    /**
     * Re-issue a verification token for a user who hasn't verified yet.
     * Returns the new token so the controller can trigger the mailer.
     */
    public function resend(int $userId): string
    {
        $user = $this->users->findById($userId);
        if ($user === null) {
            throw new \RuntimeException('User not found.');
        }

        if ($user->isVerified()) {
            throw new AuthException('Email is already verified.', 400);
        }

        $token = TokenHelper::generateVerificationToken();

        // Re-use the reset token column — just update the field
        \Core\Database\Database::execute(
            "UPDATE users SET verification_token = ?, updated_at = NOW() WHERE id = ?",
            [$token, $userId]
        );

        Logger::getInstance()->info('Verification email re-sent.', ['user_id' => $userId]);

        return $token;
    }
}
