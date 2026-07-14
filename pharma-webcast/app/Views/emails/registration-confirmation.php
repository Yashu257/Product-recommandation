<?php
/**
 * Email template: Registration Confirmation / Pending
 * Variables: $recipientName, $registration, $event, $requiresApproval, $loginUrl
 */
$name       = htmlspecialchars($recipientName ?? 'Doctor', ENT_QUOTES, 'UTF-8');
$eventTitle = htmlspecialchars($event['title'] ?? 'PharmaWebcast', ENT_QUOTES, 'UTF-8');
$eventDate  = !empty($event['starts_at'])
    ? date('l, F j, Y \a\t g:i A', strtotime($event['starts_at']))
    : '';
$attendeeId = htmlspecialchars($registration['attendee_id'] ?? '', ENT_QUOTES, 'UTF-8');
$loginUrl   = htmlspecialchars($loginUrl ?? '#', ENT_QUOTES, 'UTF-8');

$heroLabel = $requiresApproval ? 'Registration Received' : 'Registration Confirmed';
$heroTitle = $requiresApproval
    ? 'Your registration is under review'
    : "You're registered, {$name}!";

ob_start(); ?>
<p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:16px;color:#1e293b;line-height:1.7;">
    Dear <?= $name ?>,
</p>

<?php if ($requiresApproval): ?>
<p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:15px;color:#475569;line-height:1.7;">
    Thank you for registering for <strong><?= $eventTitle ?></strong>.
    Your registration has been received and is currently awaiting review by our team.
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
    <tr>
        <td style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:18px 22px;">
            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#92400e;">
                &#9203; Pending Approval
            </p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#78350f;line-height:1.6;">
                Our team will review your credentials and notify you by email once approved.
                This typically takes 1&ndash;2 business days.
            </p>
        </td>
    </tr>
</table>

<?php else: ?>
<p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;color:#475569;line-height:1.7;">
    Your registration for <strong><?= $eventTitle ?></strong> has been confirmed.
</p>

<!-- Attendee ID card -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
    <tr>
        <td style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:10px;padding:24px;">
            <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;
                       letter-spacing:1px;color:#64748b;">Your Attendee ID</p>
            <p style="margin:0 0 16px;font-family:'Courier New',monospace;font-size:24px;
                       font-weight:700;color:#1e3a5f;letter-spacing:3px;"><?= $attendeeId ?></p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="50%" style="padding-right:10px;">
                        <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;text-transform:uppercase;">Event</p>
                        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1e293b;"><?= $eventTitle ?></p>
                    </td>
                    <td width="50%">
                        <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;text-transform:uppercase;">Date &amp; Time</p>
                        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#1e293b;"><?= htmlspecialchars($eventDate, ENT_QUOTES, 'UTF-8') ?></p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:15px;color:#475569;line-height:1.7;">
    On the day of the event, log in with your registered email to join the live webcast:
</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;">
    <tr>
        <td style="border-radius:8px;background:#2563eb;">
            <a href="<?= $loginUrl ?>" target="_blank"
               style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;
                      font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">
                Log In to Webcast &rarr;
            </a>
        </td>
    </tr>
</table>
<?php endif; ?>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
    <tr>
        <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px 24px;">
            <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1e293b;">Event Summary</p>
            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:13px;color:#475569;"><strong>Title:</strong> <?= $eventTitle ?></p>
            <?php if ($eventDate): ?><p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:13px;color:#475569;"><strong>When:</strong> <?= htmlspecialchars($eventDate, ENT_QUOTES, 'UTF-8') ?></p><?php endif; ?>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#475569;"><strong>Format:</strong> Live Virtual Webcast</p>
        </td>
    </tr>
</table>

<p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#94a3b8;">
    Did not register for this event?
    <a href="mailto:support@pharmawebcast.com" style="color:#2563eb;">Contact support</a>.
</p>
<?php
$emailBody = ob_get_clean();
include __DIR__ . '/layouts/base.php';
