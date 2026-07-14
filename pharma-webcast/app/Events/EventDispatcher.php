<?php

declare(strict_types=1);

namespace App\Events;

use Core\Logger\Logger;

/**
 * EventDispatcher — lightweight synchronous event bus.
 *
 * Usage:
 *   EventDispatcher::listen(RegistrationCompleted::class, SendRegistrationConfirmationEmail::class);
 *   EventDispatcher::dispatch(new RegistrationCompleted(...));
 *
 * Listeners are plain classes with a handle(EventClass $event): void method.
 * Each listener class is instantiated fresh per dispatch.
 */
final class EventDispatcher
{
    /** @var array<string, list<string>> Map of event class → listener class names */
    private static array $listeners = [];

    private function __construct() {}

    /**
     * Register a listener class for a given event class.
     *
     * @param string $eventClass    Fully-qualified event class name
     * @param string $listenerClass Fully-qualified listener class name
     */
    public static function listen(string $eventClass, string $listenerClass): void
    {
        self::$listeners[$eventClass][] = $listenerClass;
    }

    /**
     * Dispatch an event to all registered listeners.
     * Exceptions in listeners are caught and logged — they never break the request.
     */
    public static function dispatch(object $event): void
    {
        $eventClass = get_class($event);
        $classes    = self::$listeners[$eventClass] ?? [];

        foreach ($classes as $listenerClass) {
            try {
                if (!class_exists($listenerClass)) {
                    Logger::getInstance()->warning("Listener class not found: $listenerClass");
                    continue;
                }

                $listener = new $listenerClass();

                if (!method_exists($listener, 'handle')) {
                    Logger::getInstance()->warning("Listener $listenerClass has no handle() method.");
                    continue;
                }

                $listener->handle($event);

            } catch (\Throwable $e) {
                // Log but do not re-throw — a failed email must not roll back the registration
                Logger::getInstance()->error(
                    "Listener $listenerClass failed for event $eventClass: " . $e->getMessage(),
                    ['file' => $e->getFile(), 'line' => $e->getLine()]
                );
            }
        }
    }

    /** Remove all listeners (useful in tests). */
    public static function flush(): void
    {
        self::$listeners = [];
    }
}
