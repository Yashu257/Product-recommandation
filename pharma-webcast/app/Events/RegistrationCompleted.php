<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Registration;
use App\Models\Event;

/**
 * RegistrationCompleted — domain event fired after a registration is persisted.
 *
 * Carries all data listeners need so they never query the DB themselves.
 * Immutable: all properties are readonly.
 */
final class RegistrationCompleted
{
    public function __construct(
        public readonly Registration $registration,
        public readonly Event        $event,
        public readonly string       $attendeeId,
        public readonly bool         $requiresApproval,
    ) {}
}
