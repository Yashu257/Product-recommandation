<?php
/**
 * Email template: Password Reset
 * Variables: $recipientName, $user, $resetUrl, $expiresInMinutes
 */
$name     = htmlspecialchars($recipientName ?? 'Doctor', ENT_QUOTES, 'UTF-8');
$resetUrl = htmlspecialchars($resetUrl ?? '#', ENT_QUOTES, 'UTF-8');
$expires  = (int)($expiresInMinutes ?? 60);
$expiresLabel = $expires >= 60 ? ($expires / 60) . ' hour' . ($expires > 60 ? 's' : '') : $expires . ' minutes';

$heroLabel = 'Account Security';
$heroTitle = 'Reset your password';

ob_start(); ?>
<p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:16px;color:#1e293b;line-height:1.7;">
    Dear <?= $name ?>,
</p>
<p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;color:#475569;line-height:1.7;">
    We received a request to reset the password for your PharmaWebcast account
    (<strong><?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></strong>).
    Click the button below to choose a new password.
</p>

<!-- CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
        <td style="border-radius:8px;background:#2563eb;">
            <a href="<?= $resetUrl ?>" target="_blank"
               style="display:inline-block;padding:16px 40px;font-family:Arial,sans-serif;
                      font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">
                Reset Password &rarr;
            </a>
        </td>
    </tr>
</table>

<!-- Expiry warning -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
    <tr>
        <td style="background:#fef9c3;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:14px 18px;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#78350f;">
                &#9200; This link expires in <strong><?= htmlspecialchars($expiresLabel, ENT_QUOTES, 'UTF-8') ?></strong>.
                After that, you will need to request a new reset link.
            </p>
        </td>
    </tr>
</table>

<!-- Link fallback -->
<p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:12px;color:#94a3b8;">
    If the button doesn't work, copy this link into your browser:
</p>
<p style="margin:0 0 28px;font-family:'Courier New',monospace;font-size:11px;
           color:#2563eb;word-break:break-all;"><?= $resetUrl ?></p>

<!-- Security notice -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:18px 22px;">
            <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#991b1b;">
                &#128274; Security Notice
            </p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#7f1d1d;line-height:1.6;">
                If you did not request a password reset, please ignore this email — your password
                will not change. If you suspect unauthorised access, contact us immediately at
                <a href="mailto:security@pharmawebcast.com" style="color:#991b1b;">security@pharmawebcast.com</a>.
            </p>
        </td>
    </tr>
</table>
<?php
$emailBody = ob_get_clean();
include __DIR__ . '/layouts/base.php';
