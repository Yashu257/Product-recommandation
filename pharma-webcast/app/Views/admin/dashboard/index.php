<?php
/**
 * Admin Dashboard — KPI cards + 4 charts + recent registrations
 * Variables: $kpis, $recentRegistrations, $pageTitle, $activePage, $inlineScript (set by controller)
 */
?>
<div class="adm-page-header">
    <div>
        <h1 class="adm-page-title">Dashboard</h1>
        <p class="adm-page-subtitle">Platform overview at a glance</p>
    </div>
    <div class="adm-page-actions">
        <a href="/admin/reports" class="adm-btn adm-btn-outline">
            <i class="bi bi-download me-1"></i> Export Report
        </a>
        <a href="/admin/events/create" class="adm-btn adm-btn-primary">
            <i class="bi bi-plus-lg me-1"></i> New Event
        </a>
    </div>
</div>

<!-- KPI Cards -->
<div class="row g-3 mb-4">
    <div class="col-6 col-xl-3">
        <div class="adm-stat-card">
            <div class="adm-stat-icon adm-stat-icon--blue">
                <i class="bi bi-people-fill"></i>
            </div>
            <div class="adm-stat-body">
                <div class="adm-stat-value"><?= number_format((int)($kpis['total_registrations'] ?? 0)) ?></div>
                <div class="adm-stat-label">Total Registrations</div>
            </div>
        </div>
    </div>
    <div class="col-6 col-xl-3">
        <div class="adm-stat-card">
            <div class="adm-stat-icon adm-stat-icon--green">
                <i class="bi bi-person-check-fill"></i>
            </div>
            <div class="adm-stat-body">
                <div class="adm-stat-value"><?= number_format((int)($kpis['approved'] ?? 0)) ?></div>
                <div class="adm-stat-label">Approved</div>
            </div>
        </div>
    </div>
    <div class="col-6 col-xl-3">
        <div class="adm-stat-card">
            <div class="adm-stat-icon adm-stat-icon--amber">
                <i class="bi bi-clock-fill"></i>
            </div>
            <div class="adm-stat-body">
                <div class="adm-stat-value"><?= number_format((int)($kpis['pending'] ?? 0)) ?></div>
                <div class="adm-stat-label">Pending Approval</div>
            </div>
        </div>
    </div>
    <div class="col-6 col-xl-3">
        <div class="adm-stat-card">
            <div class="adm-stat-icon adm-stat-icon--red">
                <i class="bi bi-eye-fill"></i>
            </div>
            <div class="adm-stat-body">
                <div class="adm-stat-value"><?= number_format((int)($kpis['live_viewers'] ?? 0)) ?></div>
                <div class="adm-stat-label">Live Viewers</div>
            </div>
        </div>
    </div>
    <div class="col-6 col-xl-3">
        <div class="adm-stat-card">
            <div class="adm-stat-icon adm-stat-icon--purple">
                <i class="bi bi-chat-square-dots-fill"></i>
            </div>
            <div class="adm-stat-body">
                <div class="adm-stat-value"><?= number_format((int)($kpis['total_questions'] ?? 0)) ?></div>
                <div class="adm-stat-label">Q&amp;A Submitted</div>
            </div>
        </div>
    </div>
    <div class="col-6 col-xl-3">
        <div class="adm-stat-card">
            <div class="adm-stat-icon adm-stat-icon--teal">
                <i class="bi bi-star-fill"></i>
            </div>
            <div class="adm-stat-body">
                <div class="adm-stat-value">
                    <?= number_format((float)($kpis['avg_rating'] ?? 0), 1) ?>/5
                </div>
                <div class="adm-stat-label">Avg Feedback Rating</div>
            </div>
        </div>
    </div>
    <div class="col-6 col-xl-3">
        <div class="adm-stat-card">
            <div class="adm-stat-icon adm-stat-icon--indigo">
                <i class="bi bi-calendar-event-fill"></i>
            </div>
            <div class="adm-stat-body">
                <div class="adm-stat-value"><?= number_format((int)($kpis['total_events'] ?? 0)) ?></div>
                <div class="adm-stat-label">Total Events</div>
            </div>
        </div>
    </div>
    <div class="col-6 col-xl-3">
        <div class="adm-stat-card">
            <div class="adm-stat-icon adm-stat-icon--green">
                <i class="bi bi-broadcast-pin"></i>
            </div>
            <div class="adm-stat-body">
                <div class="adm-stat-value"><?= number_format((int)($kpis['active_events'] ?? 0)) ?></div>
                <div class="adm-stat-label">Active Events</div>
            </div>
        </div>
    </div>
</div>

<!-- Charts Row 1 -->
<div class="row g-3 mb-3">
    <!-- Registrations trend (line) -->
    <div class="col-12 col-xl-8">
        <div class="adm-card">
            <div class="adm-card-header">
                <h2 class="adm-card-title">Registrations — Last 14 Days</h2>
            </div>
            <div class="adm-card-body">
                <canvas id="chart-registrations" height="90"></canvas>
            </div>
        </div>
    </div>
    <!-- Status breakdown (doughnut) -->
    <div class="col-12 col-xl-4">
        <div class="adm-card">
            <div class="adm-card-header">
                <h2 class="adm-card-title">Status Breakdown</h2>
            </div>
            <div class="adm-card-body d-flex align-items-center justify-content-center">
                <canvas id="chart-status" style="max-height:240px;"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Charts Row 2 -->
<div class="row g-3 mb-4">
    <!-- Attendance by event (bar) -->
    <div class="col-12 col-xl-8">
        <div class="adm-card">
            <div class="adm-card-header">
                <h2 class="adm-card-title">Attendance by Event (Top 8)</h2>
            </div>
            <div class="adm-card-body">
                <canvas id="chart-attendance" height="90"></canvas>
            </div>
        </div>
    </div>
    <!-- Feedback distribution (bar) -->
    <div class="col-12 col-xl-4">
        <div class="adm-card">
            <div class="adm-card-header">
                <h2 class="adm-card-title">Feedback Distribution</h2>
            </div>
            <div class="adm-card-body">
                <canvas id="chart-feedback" height="200"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Recent Registrations -->
<div class="adm-card mb-4">
    <div class="adm-card-header">
        <h2 class="adm-card-title">Recent Registrations</h2>
        <a href="/admin/reports" class="adm-card-action">View all <i class="bi bi-arrow-right"></i></a>
    </div>
    <div class="adm-card-body p-0">
        <div class="table-responsive">
            <table class="adm-table">
                <thead>
                    <tr>
                        <th>Attendee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Specialty</th>
                        <th>Event</th>
                        <th>Status</th>
                        <th>Registered</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($recentRegistrations)): ?>
                    <tr>
                        <td colspan="7" class="text-center text-muted py-4">
                            No registrations yet.
                        </td>
                    </tr>
                    <?php else: ?>
                    <?php foreach ($recentRegistrations as $r): ?>
                    <tr>
                        <td><code class="text-info"><?= \Core\Security\Sanitizer::e($r['attendee_id'] ?? '—') ?></code></td>
                        <td><?= \Core\Security\Sanitizer::e($r['first_name'] . ' ' . $r['last_name']) ?></td>
                        <td><?= \Core\Security\Sanitizer::e($r['email']) ?></td>
                        <td><?= \Core\Security\Sanitizer::e($r['specialty'] ?? '—') ?></td>
                        <td><?= \Core\Security\Sanitizer::e($r['event_title'] ?? '—') ?></td>
                        <td>
                            <span class="adm-badge adm-badge--<?= \Core\Security\Sanitizer::e($r['approval_status'] ?? 'pending') ?>">
                                <?= \Core\Security\Sanitizer::e(ucfirst($r['approval_status'] ?? 'pending')) ?>
                            </span>
                        </td>
                        <td class="text-muted" style="font-size:.8125rem;">
                            <?= \Core\Security\Sanitizer::e(date('d M Y', strtotime($r['created_at'] ?? 'now'))) ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
