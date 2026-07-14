-- ============================================================
-- Email Queue Table
-- Run once: mysql -u root -p pharmawebcast < create_email_queue.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS `email_queue` (
    `id`            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    `to_email`      VARCHAR(255)     NOT NULL,
    `to_name`       VARCHAR(255)     NOT NULL DEFAULT '',
    `subject`       VARCHAR(998)     NOT NULL,
    `html_body`     MEDIUMTEXT       NOT NULL,
    `text_body`     TEXT             NOT NULL DEFAULT '',
    -- Full message payload (JSON) — used by the worker to reconstruct MailMessage
    -- including cc/bcc/reply-to/priority that aren't stored in their own columns
    `payload`       JSON             NOT NULL,
    -- Queue state machine: pending → sending → sent | failed
    `status`        ENUM('pending','sending','sent','failed') NOT NULL DEFAULT 'pending',
    `attempts`      TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `max_attempts`  TINYINT UNSIGNED NOT NULL DEFAULT 3,
    -- Scheduling (future-dated emails, e.g. reminders)
    `scheduled_at`  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `sent_at`       DATETIME             NULL DEFAULT NULL,
    `failed_at`     DATETIME             NULL DEFAULT NULL,
    `error_message` TEXT                 NULL DEFAULT NULL,
    `created_at`    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    DATETIME             NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    INDEX `idx_eq_status_scheduled` (`status`, `scheduled_at`),
    INDEX `idx_eq_to_email`         (`to_email`),
    INDEX `idx_eq_created_at`       (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- Password Reset Tokens Table (needed by PasswordResetMail flow)
-- ============================================================

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email`      VARCHAR(255)    NOT NULL,
    `token`      VARCHAR(128)    NOT NULL,   -- sha256 hash of the raw token
    `expires_at` DATETIME        NOT NULL,
    `used_at`    DATETIME            NULL DEFAULT NULL,
    `created_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_prt_token`     (`token`),
    INDEX `idx_prt_email`         (`email`),
    INDEX `idx_prt_expires`       (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
