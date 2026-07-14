<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

// Guard: only authenticated users past this point.
if (!is_logged_in()) {
    header('Location: index.php');
    exit;
}

$user = htmlspecialchars((string) $_SESSION['user'], ENT_QUOTES, 'UTF-8');

/**
 * The four floating panels. Order matters: the first entry starts at the
 * Front position, then Right, Back, Left (each +90° around the circle).
 *
 * @var array<int, array<string, string>> $cards
 */
$cards = [
    [
        'tag'    => 'Online',
        'title'  => 'Neural Core',
        'sub'    => 'System intelligence layer',
        'metric' => '98.6%',
        'unit'   => 'Cognition load',
        'icon'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M19.1 4.9l-2.8 2.8M7.7 16.3l-2.8 2.8"/></svg>',
    ],
    [
        'tag'    => 'Flowing',
        'title'  => 'Data Streams',
        'sub'    => 'Realtime ingestion pipeline',
        'metric' => '12.4K/s',
        'unit'   => 'Events / second',
        'icon'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18M3 12h18M3 17h18"/><circle cx="7" cy="7" r="1.4" fill="currentColor"/><circle cx="14" cy="12" r="1.4" fill="currentColor"/><circle cx="10" cy="17" r="1.4" fill="currentColor"/></svg>',
    ],
    [
        'tag'    => 'Active',
        'title'  => 'Agents',
        'sub'    => 'Autonomous task fleet',
        'metric' => '27',
        'unit'   => 'Running now',
        'icon'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 8V4M9 4h6"/><circle cx="9.5" cy="13" r="1.2" fill="currentColor"/><circle cx="14.5" cy="13" r="1.2" fill="currentColor"/></svg>',
    ],
    [
        'tag'    => 'Stable',
        'title'  => 'Systems',
        'sub'    => 'Environment control grid',
        'metric' => 'Nominal',
        'unit'   => 'All nodes healthy',
        'icon'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    ],
];

/** Render one 3D card. */
function render_card(array $c): string
{
    $tag    = htmlspecialchars($c['tag'], ENT_QUOTES, 'UTF-8');
    $title  = htmlspecialchars($c['title'], ENT_QUOTES, 'UTF-8');
    $sub    = htmlspecialchars($c['sub'], ENT_QUOTES, 'UTF-8');
    $metric = htmlspecialchars($c['metric'], ENT_QUOTES, 'UTF-8');
    $unit   = htmlspecialchars($c['unit'], ENT_QUOTES, 'UTF-8');
    $icon   = $c['icon']; // trusted static markup

    return <<<HTML
        <article class="card3d" data-title="{$title}" data-sub="{$sub}">
            <div class="card3d__float">
                <div class="card3d__surface">
                    <span class="card3d__accent" aria-hidden="true"></span>
                    <span class="card3d__glow" aria-hidden="true"></span>
                    <div class="card3d__content">
                        <span class="card3d__icon">{$icon}</span>
                        <span class="card3d__tag">{$tag}</span>
                        <h2 class="card3d__title">{$title}</h2>
                        <p class="card3d__sub">{$sub}</p>
                        <div class="card3d__metric">{$metric}<span>{$unit}</span></div>
                    </div>
                </div>
                <span class="card3d__reflection" aria-hidden="true"></span>
            </div>
        </article>
    HTML;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0a0a14">
    <title>Console · Nova</title>
    <link rel="icon" type="image/svg+xml" href="assets/img/logo.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/dashboard.css">
</head>
<body class="dash">
    <!-- Background environment -->
    <div class="backdrop" aria-hidden="true">
        <span class="orb orb--1"></span>
        <span class="orb orb--2"></span>
        <span class="orb orb--3"></span>
        <canvas id="dashParticles" class="particles"></canvas>
    </div>
    <div class="rays" aria-hidden="true">
        <span class="ray ray--1"></span>
        <span class="ray ray--2"></span>
        <span class="ray ray--3"></span>
    </div>

    <!-- Top bar -->
    <header class="topbar">
        <div class="topbar__brand">
            <img src="assets/img/logo.svg" alt="">
            <span>Nova&nbsp;Console</span>
        </div>
        <div class="topbar__actions">
            <span class="topbar__user"><?= $user ?></span>
            <a class="topbar__logout" href="logout.php">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
                Log out
            </a>
        </div>
    </header>

    <!-- 3D scene -->
    <main class="scene" id="scene" aria-label="Card navigation">
        <span class="floor-glow" aria-hidden="true"></span>
        <div class="carousel" id="carousel">
            <?php foreach ($cards as $card) {
                echo render_card($card);
            } ?>
        </div>
    </main>

    <!-- Interaction hint -->
    <div class="hint" aria-hidden="true">
        <span>Drag</span>
        <span class="hint__sep"></span>
        <span><kbd>&larr;</kbd> <kbd>&rarr;</kbd></span>
        <span class="hint__sep"></span>
        <span>Scroll to rotate · Click to open</span>
    </div>

    <!-- Placeholder content page -->
    <section class="detail" id="detail" aria-hidden="true" aria-modal="true" role="dialog">
        <div class="detail__panel">
            <button class="detail__close" id="detailClose">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
            </button>

            <div class="detail__head">
                <span class="detail__badge" data-slot="badge"></span>
                <div>
                    <h1 class="detail__title" data-slot="title">Module</h1>
                    <p class="detail__sub" data-slot="sub"></p>
                </div>
            </div>

            <div class="detail__grid">
                <div class="detail__stat"><b>1.2M</b><span>Total requests</span></div>
                <div class="detail__stat"><b>42ms</b><span>Avg latency</span></div>
                <div class="detail__stat"><b>99.98%</b><span>Uptime</span></div>
            </div>

            <div class="detail__bars" aria-hidden="true"></div>
        </div>
    </section>

    <script src="assets/js/dashboard.js" defer></script>
</body>
</html>
