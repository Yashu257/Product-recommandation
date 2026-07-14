<?php
/**
 * Login form view.
 * Included by LoginController::showForm() via ob_start() / include.
 *
 * Flash data read directly from Session because the controller does not
 * inject variables — we read them inside the view and then let the layout consume $content.
 *
 * Flash keys used by LoginController:
 *   errors  → array  ['field' => ['msg', ...]]  (from Validator)
 *   error   → string  single auth error message  (from AuthException)
 *   _old_input → ['email' => '...']             (via Session::flashOld)
 */

use Core\Security\Sanitizer;
use Core\Security\CsrfGuard;
use Core\Session\Session;

// Consume flash data
$errors     = Session::getFlash('errors', []);
$authError  = Session::getFlash('error', '');
$oldEmail   = Session::old('email');

// Page meta
$pageTitle  = 'Sign In — PharmaWebcast';
$metaTitle  = $pageTitle;
$bodyClass  = 'auth-page';
$pageStyles  = ['/assets/css/auth.css'];
$pageScripts = ['/assets/js/auth.js'];

// ── Helpers ──────────────────────────────────────────────────────────────────

$firstError = static fn(string $field): string =>
    isset($errors[$field][0]) ? $errors[$field][0] : '';

$isInvalid = static fn(string $field): string =>
    isset($errors[$field]) ? 'is-invalid' : '';

// ── View ─────────────────────────────────────────────────────────────────────
ob_start();
?>

<div class="auth-wrap d-flex align-items-center justify-content-center">
    <div class="auth-card-outer">

        <!-- Branding strip -->
        <div class="auth-brand text-center mb-4">
            <a href="/" class="auth-logo-link">
                <span class="fw-bold text-primary fs-4">Pharma<span class="text-dark">Webcast</span></span>
            </a>
        </div>

        <div class="card auth-card shadow-sm border-0">
            <div class="card-body p-4 p-sm-5">

                <!-- Heading -->
                <h1 class="h4 fw-bold mb-1">Welcome back</h1>
                <p class="text-muted small mb-4">Sign in to access your events.</p>

                <!-- ── Auth error banner ── -->
                <?php if ($authError !== ''): ?>
                    <div class="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                        <i class="bi bi-shield-exclamation flex-shrink-0"></i>
                        <span><?= Sanitizer::e($authError) ?></span>
                    </div>
                <?php endif; ?>

                <!-- ── Validation error banner ── -->
                <?php if (!empty($errors)): ?>
                    <div class="alert alert-warning d-flex align-items-center gap-2 py-2" role="alert">
                        <i class="bi bi-exclamation-triangle flex-shrink-0"></i>
                        <span>Please correct the errors below.</span>
                    </div>
                <?php endif; ?>

                <!-- ── Login form ── -->
                <form method="POST" action="/login" novalidate autocomplete="on">
                    <input type="hidden" name="_csrf_token" value="<?= Sanitizer::e(CsrfGuard::token()) ?>">

                    <!-- Email -->
                    <div class="mb-3">
                        <label for="email" class="form-label fw-medium">Email address</label>
                        <div class="input-group">
                            <span class="input-group-text auth-input-icon">
                                <i class="bi bi-envelope"></i>
                            </span>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                class="form-control <?= $isInvalid('email') ?>"
                                value="<?= Sanitizer::e($oldEmail ?? '') ?>"
                                placeholder="you@example.com"
                                required
                                autocomplete="email"
                                autofocus
                            >
                        </div>
                        <?php if ($firstError('email') !== ''): ?>
                            <div class="invalid-feedback d-block">
                                <?= Sanitizer::e($firstError('email')) ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- Password -->
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-baseline mb-1">
                            <label for="password" class="form-label fw-medium mb-0">Password</label>
                            <a href="/forgot-password" class="small text-muted auth-forgot-link">
                                Forgot password?
                            </a>
                        </div>
                        <div class="input-group">
                            <span class="input-group-text auth-input-icon">
                                <i class="bi bi-lock"></i>
                            </span>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                class="form-control <?= $isInvalid('password') ?>"
                                placeholder="••••••••"
                                required
                                autocomplete="current-password"
                            >
                            <button
                                type="button"
                                class="btn btn-outline-secondary auth-password-toggle"
                                aria-label="Toggle password visibility"
                                data-target="password"
                            >
                                <i class="bi bi-eye" aria-hidden="true"></i>
                            </button>
                        </div>
                        <?php if ($firstError('password') !== ''): ?>
                            <div class="invalid-feedback d-block">
                                <?= Sanitizer::e($firstError('password')) ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- Remember me -->
                    <div class="mb-4 d-flex align-items-center">
                        <div class="form-check mb-0">
                            <input
                                type="checkbox"
                                id="remember_me"
                                name="remember_me"
                                value="1"
                                class="form-check-input"
                            >
                            <label for="remember_me" class="form-check-label small text-muted">
                                Remember me for 30 days
                            </label>
                        </div>
                    </div>

                    <!-- Submit -->
                    <div class="d-grid mb-3">
                        <button type="submit" class="btn btn-primary btn-lg fw-semibold">
                            <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                        </button>
                    </div>

                </form>

                <!-- Divider -->
                <div class="auth-divider text-center my-3">
                    <span class="text-muted small">or</span>
                </div>

                <!-- Register CTA -->
                <p class="text-center text-muted small mb-0">
                    Not registered yet?
                    <a href="/register" class="fw-medium">Create an account</a>
                </p>

            </div><!-- /card-body -->
        </div><!-- /card -->

        <!-- Footer note -->
        <p class="text-center text-muted mt-4 mb-0" style="font-size:.75rem;">
            By signing in you agree to our
            <a href="/terms" class="text-muted text-decoration-underline">Terms of Use</a>
            and
            <a href="/privacy-policy" class="text-muted text-decoration-underline">Privacy Policy</a>.
        </p>

    </div><!-- /auth-card-outer -->
</div><!-- /auth-wrap -->

<?php
$content = ob_get_clean();
include BASE_PATH . '/app/Views/frontend/layouts/main.php';
