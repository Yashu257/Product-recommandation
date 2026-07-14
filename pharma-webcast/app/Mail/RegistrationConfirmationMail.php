<?php

declare(strict_types=1);

namespace App\Mail;

/**
 * Sent immediately after a successful registration.
 *
 * If the event requires approval, subject/body reflects pending state.
 * Otherwise it's a confirmed confirmation with the attendee ID.
 *
 * Usage:
 *   (new RegistrationConfirmationMail($registration, $event))->queue();
 */
final class RegistrationConfirmationMail extends BaseMail
{
    /**
     * @param array $registration  Registration DB row (attendee_id, first_name, …, approval_status)
     * @param array $event         Event DB row (id, title, starts_at, ends_at, …)
     */
    public function __construct(
        private readonly array $registration,
        private readonly array $event
    ) {
        parent::__construct();
    }

    protected function build(): void
    {
        $name            = trim(($this->registration['first_name'] ?? '') . ' ' . ($this->registration['last_name'] ?? ''));
        $requiresApproval = ($this->registration['approval_status'] ?? 'approved') === 'pending';

        $subject = $requiresApproval
            ? 'Your registration is pending approval — ' . ($this->event['title'] ?? 'PharmaWebcast')
            : 'Registration confirmed — ' . ($this->event['title'] ?? 'PharmaWebcast');

        $html = $this->renderTemplate('emails/registration-confirmation', [
            'recipientName'   => $name,
            'registration'    => $this->registration,
            'event'           => $this->event,
            'requiresApproval'=> $requiresApproval,
            'loginUrl'        => rtrim(env('APP_URL', 'https://pharmawebcast.com'), '/') . '/login',
        ]);

        $this->message
            ->to($this->registration['email'] ?? '', $name)
            ->subject($subject)
            ->html($html);
    }
}
