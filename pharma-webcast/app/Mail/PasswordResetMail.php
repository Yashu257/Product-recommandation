<?php

declare(strict_types=1);

namespace App\Mail;

/**
 * Password-reset link email.
 *
 * Usage:
 *   (new PasswordResetMail($user, $token))->send();
 */
final class PasswordResetMail extends BaseMail
{
    /**
     * @param array  $user   ['first_name', 'last_name', 'email']
     * @param string $token  Cryptographically secure reset token
     * @param int    $expiresInMinutes  Token validity window shown in email
     */
    public function __construct(
        private readonly array  $user,
        private readonly string $token,
        private readonly int    $expiresInMinutes = 60
    ) {
        parent::__construct();
    }

    protected function build(): void
    {
        $name     = trim(($this->user['first_name'] ?? '') . ' ' . ($this->user['last_name'] ?? ''));
        $baseUrl  = rtrim(env('APP_URL', 'https://pharmawebcast.com'), '/');
        $resetUrl = $baseUrl . '/password/reset?token=' . urlencode($this->token)
            . '&email=' . urlencode($this->user['email'] ?? '');

        $html = $this->renderTemplate('emails/password-reset', [
            'recipientName'    => $name,
            'user'             => $this->user,
            'resetUrl'         => $resetUrl,
            'expiresInMinutes' => $this->expiresInMinutes,
        ]);

        $this->message
            ->to($this->user['email'] ?? '', $name)
            ->subject('Reset your PharmaWebcast password')
            ->html($html)
            ->priority('high');
    }
}
