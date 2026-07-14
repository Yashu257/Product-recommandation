<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

// Already authenticated? Skip the form.
if (is_logged_in()) {
    header('Location: dashboard.php');
    exit;
}

$error = $_SESSION['login_error'] ?? '';
$oldUsername = $_SESSION['old_username'] ?? '';
unset($_SESSION['login_error']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0a0a14">
    <title>Sign in · Nova</title>
    <link rel="icon" type="image/svg+xml" href="assets/img/logo.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- Animated gradient backdrop + floating particles -->
    <div class="backdrop" aria-hidden="true">
        <span class="orb orb--1"></span>
        <span class="orb orb--2"></span>
        <span class="orb orb--3"></span>
        <canvas id="particles" class="particles"></canvas>
    </div>

    <main class="stage">
        <section class="card" id="loginCard" aria-labelledby="cardTitle">
            <header class="card__head">
                <span class="card__logo">
                    <img src="assets/img/logo.svg" width="56" height="56" alt="Nova">
                </span>
                <h1 id="cardTitle" class="card__title">Welcome Back</h1>
                <p class="card__subtitle">Sign in to continue to your dashboard</p>
            </header>

            <?php if ($error !== ''): ?>
                <p class="alert" role="alert"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
            <?php endif; ?>

            <form class="form" action="auth.php" method="post" novalidate>
                <div class="field">
                    <label class="field__label" for="username">Username</label>
                    <div class="field__control">
                        <svg class="field__icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                        </svg>
                        <input
                            class="field__input"
                            id="username"
                            name="username"
                            type="text"
                            autocomplete="username"
                            placeholder="Enter your username"
                            value="<?= htmlspecialchars($oldUsername, ENT_QUOTES, 'UTF-8') ?>"
                            required
                            autofocus>
                    </div>
                </div>

                <div class="field">
                    <label class="field__label" for="password">Password</label>
                    <div class="field__control">
                        <svg class="field__icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M7 10V7a5 5 0 0110 0v3M6 10h12v9a1 1 0 01-1 1H7a1 1 0 01-1-1v-9z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input
                            class="field__input"
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            placeholder="Enter your password"
                            required>
                        <button type="button" class="field__toggle" id="togglePassword" aria-label="Show password" aria-pressed="false">
                            <svg class="icon-eye" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                                <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/>
                            </svg>
                            <svg class="icon-eye-off" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.2A9.5 9.5 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3.6 4.2M6.1 6.1A17 17 0 002 12s3.5 7 10 7a9.5 9.5 0 003.4-.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="form__row">
                    <label class="checkbox">
                        <input type="checkbox" name="remember" value="1">
                        <span class="checkbox__box" aria-hidden="true"></span>
                        <span class="checkbox__label">Remember me</span>
                    </label>
                    <a class="link" href="#">Forgot password?</a>
                </div>

                <button type="submit" class="btn">
                    <span class="btn__label">Log In</span>
                    <span class="btn__glow" aria-hidden="true"></span>
                </button>
            </form>

            <p class="card__foot">
                Don&rsquo;t have an account? <a class="link" href="#">Create one</a>
            </p>
        </section>
    </main>

    <script src="assets/js/main.js" defer></script>
</body>
</html>
