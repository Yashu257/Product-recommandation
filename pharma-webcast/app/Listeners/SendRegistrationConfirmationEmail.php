<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\RegistrationCompleted;
use Core\Mailer\Mailer;

/**
 * SendRegistrationConfirmationEmail
 *
 * Handles the RegistrationCompleted event.
 * Builds the email subject/body and hands off to the Mailer.
 *
 * This listener has one job: send one email.
 * It never writes to the database. It never modifies the registration.
 */
class SendRegistrationConfirmationEmail
{
    public function handle(RegistrationCompleted $event): void
    {
        $mailer = new Mailer();

        $subject = $event->requiresApproval
            ? 'Your registration is pending approval — ' . $event->event->title
            : 'Registration confirmed — ' . $event->event->title;

        $html = $mailer->render('registration-confirmation', [
            'registration'     => $event->registration,
            'event'            => $event->event,
            'attendeeId'       => $event->attendeeId,
            'requiresApproval' => $event->requiresApproval,
            'subject'          => $subject,
        ]);

        $mailer->send(
            to:      $event->registration->email,
            subject: $subject,
            html:    $html,
        );
    }
}
