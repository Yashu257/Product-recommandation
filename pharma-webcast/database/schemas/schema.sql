-- =============================================================================
-- PHARMA WEBCAST PLATFORM — COMPLETE MySQL 8.0 SCHEMA
-- =============================================================================
-- Encoding  : UTF-8 (utf8mb4)
-- Engine    : InnoDB (FK support + ACID)
-- Collation : utf8mb4_unicode_ci
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- =============================================================================
-- MODULE 1 — USERS & ADMINS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- roles
-- Defines permission levels: super_admin, admin, moderator, speaker, attendee
-- -----------------------------------------------------------------------------
CREATE TABLE roles (
    id            TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name          VARCHAR(50)      NOT NULL,
    slug          VARCHAR(50)      NOT NULL,
    description   VARCHAR(255)         NULL,
    created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_roles_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- users
-- All human actors in the system (attendees, speakers, moderators).
-- Admins are a separate table to enforce strict privilege separation.
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id                  BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    role_id             TINYINT UNSIGNED NOT NULL,
    first_name          VARCHAR(100)     NOT NULL,
    last_name           VARCHAR(100)     NOT NULL,
    email               VARCHAR(180)     NOT NULL,
    phone               VARCHAR(30)          NULL,
    password_hash       VARCHAR(255)         NULL,           -- NULL for SSO-only users
    job_title           VARCHAR(150)         NULL,
    company             VARCHAR(200)         NULL,
    country             VARCHAR(100)         NULL,
    avatar_path         VARCHAR(500)         NULL,
    email_verified_at   DATETIME             NULL,
    verification_token  VARCHAR(100)         NULL,
    reset_token         VARCHAR(100)         NULL,
    reset_token_expires DATETIME             NULL,
    status              ENUM('active','inactive','banned','pending') NOT NULL DEFAULT 'pending',
    last_login_at       DATETIME             NULL,
    created_at          DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME             NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    INDEX idx_users_role_id   (role_id),
    INDEX idx_users_status    (status),
    INDEX idx_users_deleted   (deleted_at),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- admins
-- Completely separate table for back-office administrators.
-- Never share a session namespace with users.
-- -----------------------------------------------------------------------------
CREATE TABLE admins (
    id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    role_id       TINYINT UNSIGNED NOT NULL,
    first_name    VARCHAR(100)     NOT NULL,
    last_name     VARCHAR(100)     NOT NULL,
    email         VARCHAR(180)     NOT NULL,
    password_hash VARCHAR(255)     NOT NULL,
    avatar_path   VARCHAR(500)         NULL,
    two_fa_secret VARCHAR(100)         NULL,
    two_fa_enabled TINYINT(1)      NOT NULL DEFAULT 0,
    status        ENUM('active','inactive') NOT NULL DEFAULT 'active',
    last_login_at DATETIME             NULL,
    last_login_ip VARCHAR(45)          NULL,
    created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    DATETIME             NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_admins_email (email),
    INDEX idx_admins_role_id (role_id),
    INDEX idx_admins_status  (status),
    CONSTRAINT fk_admins_role FOREIGN KEY (role_id) REFERENCES roles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 2 — SESSIONS (AUTH)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- user_sessions
-- Server-side session store. One row per active session token.
-- Allows forced logout and concurrent session detection.
-- -----------------------------------------------------------------------------
CREATE TABLE user_sessions (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id     BIGINT UNSIGNED NOT NULL,
    token       VARCHAR(128)    NOT NULL,
    ip_address  VARCHAR(45)         NULL,
    user_agent  VARCHAR(500)        NULL,
    payload     TEXT                NULL,      -- serialised session data if needed
    expires_at  DATETIME        NOT NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_user_sessions_token   (token),
    INDEX idx_user_sessions_user_id     (user_id),
    INDEX idx_user_sessions_expires_at  (expires_at),
    CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- admin_sessions  — mirrors user_sessions for admin panel
-- -----------------------------------------------------------------------------
CREATE TABLE admin_sessions (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    admin_id    BIGINT UNSIGNED NOT NULL,
    token       VARCHAR(128)    NOT NULL,
    ip_address  VARCHAR(45)         NULL,
    user_agent  VARCHAR(500)        NULL,
    expires_at  DATETIME        NOT NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_admin_sessions_token  (token),
    INDEX idx_admin_sessions_admin_id   (admin_id),
    CONSTRAINT fk_admin_sessions_admin  FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 3 — BRANDING
-- =============================================================================

-- -----------------------------------------------------------------------------
-- brands
-- Per-event white-label branding. One brand can be reused across events.
-- -----------------------------------------------------------------------------
CREATE TABLE brands (
    id                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    name                VARCHAR(150)  NOT NULL,
    logo_path           VARCHAR(500)      NULL,
    favicon_path        VARCHAR(500)      NULL,
    primary_color       VARCHAR(10)       NULL DEFAULT '#0d6efd',
    secondary_color     VARCHAR(10)       NULL DEFAULT '#6c757d',
    accent_color        VARCHAR(10)       NULL DEFAULT '#ffffff',
    font_family         VARCHAR(100)      NULL DEFAULT 'Inter, sans-serif',
    custom_css          MEDIUMTEXT        NULL,
    header_html         TEXT              NULL,
    footer_html         TEXT              NULL,
    status              ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 4 — EVENTS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- events
-- Central entity. Everything else belongs to an event.
-- -----------------------------------------------------------------------------
CREATE TABLE events (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    brand_id            INT UNSIGNED        NULL,
    created_by          BIGINT UNSIGNED NOT NULL,   -- admin who created it
    title               VARCHAR(300)    NOT NULL,
    slug                VARCHAR(320)    NOT NULL,
    description         TEXT                NULL,
    short_description   VARCHAR(500)        NULL,
    event_type          ENUM('live','on_demand','hybrid') NOT NULL DEFAULT 'live',
    timezone            VARCHAR(80)     NOT NULL DEFAULT 'UTC',
    starts_at           DATETIME        NOT NULL,
    ends_at             DATETIME        NOT NULL,
    registration_opens  DATETIME            NULL,
    registration_closes DATETIME            NULL,
    max_attendees       INT UNSIGNED        NULL,
    thumbnail_path      VARCHAR(500)        NULL,
    banner_path         VARCHAR(500)        NULL,
    is_private          TINYINT(1)      NOT NULL DEFAULT 0,
    access_password     VARCHAR(255)        NULL,   -- hashed; for gated events
    status              ENUM('draft','published','live','ended','cancelled','archived') NOT NULL DEFAULT 'draft',
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME            NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_events_slug      (slug),
    INDEX idx_events_brand_id      (brand_id),
    INDEX idx_events_created_by    (created_by),
    INDEX idx_events_status        (status),
    INDEX idx_events_starts_at     (starts_at),
    INDEX idx_events_deleted       (deleted_at),
    CONSTRAINT fk_events_brand     FOREIGN KEY (brand_id)   REFERENCES brands (id) ON DELETE SET NULL,
    CONSTRAINT fk_events_admin     FOREIGN KEY (created_by) REFERENCES admins (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 5 — LANDING PAGE
-- =============================================================================

-- -----------------------------------------------------------------------------
-- landing_pages
-- One landing page per event. Stores structured content blocks.
-- -----------------------------------------------------------------------------
CREATE TABLE landing_pages (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    event_id        BIGINT UNSIGNED NOT NULL,
    hero_headline   VARCHAR(400)        NULL,
    hero_subheadline VARCHAR(600)       NULL,
    hero_image_path VARCHAR(500)        NULL,
    body_content    LONGTEXT            NULL,   -- rich HTML/Markdown blocks
    agenda_visible  TINYINT(1)      NOT NULL DEFAULT 1,
    speakers_visible TINYINT(1)     NOT NULL DEFAULT 1,
    sponsors_visible TINYINT(1)     NOT NULL DEFAULT 0,
    meta_title      VARCHAR(160)        NULL,
    meta_description VARCHAR(320)       NULL,
    og_image_path   VARCHAR(500)        NULL,
    status          ENUM('draft','published') NOT NULL DEFAULT 'draft',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_landing_pages_event (event_id),
    CONSTRAINT fk_landing_pages_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- speakers
-- Speakers linked to events via a pivot (event_speakers).
-- -----------------------------------------------------------------------------
CREATE TABLE speakers (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name      VARCHAR(100)    NOT NULL,
    last_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(180)        NULL,
    bio             TEXT                NULL,
    job_title       VARCHAR(150)        NULL,
    company         VARCHAR(200)        NULL,
    photo_path      VARCHAR(500)        NULL,
    linkedin_url    VARCHAR(500)        NULL,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME            NULL,
    PRIMARY KEY (id),
    INDEX idx_speakers_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- event_speakers  (pivot)
-- Many speakers ↔ Many events, with per-event role and sort order
-- -----------------------------------------------------------------------------
CREATE TABLE event_speakers (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    event_id    BIGINT UNSIGNED NOT NULL,
    speaker_id  BIGINT UNSIGNED NOT NULL,
    role        VARCHAR(100)        NULL,   -- e.g. "Keynote", "Panellist"
    sort_order  SMALLINT        NOT NULL DEFAULT 0,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_event_speakers (event_id, speaker_id),
    INDEX idx_event_speakers_speaker (speaker_id),
    CONSTRAINT fk_event_speakers_event   FOREIGN KEY (event_id)   REFERENCES events   (id) ON DELETE CASCADE,
    CONSTRAINT fk_event_speakers_speaker FOREIGN KEY (speaker_id) REFERENCES speakers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- sponsors
-- Optional sponsors per event (pharma co-branding use case)
-- -----------------------------------------------------------------------------
CREATE TABLE sponsors (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    event_id    BIGINT UNSIGNED NOT NULL,
    name        VARCHAR(200)    NOT NULL,
    logo_path   VARCHAR(500)        NULL,
    website_url VARCHAR(500)        NULL,
    tier        ENUM('platinum','gold','silver','bronze','exhibitor') NOT NULL DEFAULT 'silver',
    sort_order  SMALLINT        NOT NULL DEFAULT 0,
    status      ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_sponsors_event_id (event_id),
    CONSTRAINT fk_sponsors_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 6 — REGISTRATION
-- =============================================================================

-- -----------------------------------------------------------------------------
-- registration_forms
-- Dynamic form builder: each event can customise its registration fields.
-- -----------------------------------------------------------------------------
CREATE TABLE registration_forms (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    event_id    BIGINT UNSIGNED NOT NULL,
    title       VARCHAR(200)    NOT NULL DEFAULT 'Register',
    description TEXT                NULL,
    success_message TEXT            NULL,
    require_approval TINYINT(1)  NOT NULL DEFAULT 0,
    status      ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_registration_forms_event (event_id),
    CONSTRAINT fk_reg_forms_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- registration_form_fields
-- Custom fields per form (text, dropdown, checkbox, etc.)
-- -----------------------------------------------------------------------------
CREATE TABLE registration_form_fields (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    form_id         BIGINT UNSIGNED NOT NULL,
    field_name      VARCHAR(100)    NOT NULL,   -- internal key
    field_label     VARCHAR(200)    NOT NULL,
    field_type      ENUM('text','email','phone','number','date','select','checkbox','radio','textarea') NOT NULL,
    options         JSON                NULL,   -- for select/radio/checkbox choices
    placeholder     VARCHAR(255)        NULL,
    is_required     TINYINT(1)      NOT NULL DEFAULT 0,
    sort_order      SMALLINT        NOT NULL DEFAULT 0,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_reg_form_fields_form (form_id),
    CONSTRAINT fk_reg_form_fields_form FOREIGN KEY (form_id) REFERENCES registration_forms (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- registrations
-- Each row = one user registering for one event.
-- -----------------------------------------------------------------------------
CREATE TABLE registrations (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    event_id        BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED     NULL,   -- NULL until account created
    form_id         BIGINT UNSIGNED NOT NULL,
    registration_code VARCHAR(32)   NOT NULL,   -- unique public reference
    first_name      VARCHAR(100)    NOT NULL,
    last_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(180)    NOT NULL,
    phone           VARCHAR(30)         NULL,
    company         VARCHAR(200)        NULL,
    job_title       VARCHAR(150)        NULL,
    ip_address      VARCHAR(45)         NULL,
    approval_status ENUM('pending','approved','rejected','waitlisted') NOT NULL DEFAULT 'pending',
    approved_at     DATETIME            NULL,
    approved_by     BIGINT UNSIGNED     NULL,
    status          ENUM('active','cancelled') NOT NULL DEFAULT 'active',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME            NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_registrations_code    (registration_code),
    UNIQUE KEY uq_registrations_event_email (event_id, email),
    INDEX idx_registrations_user_id     (user_id),
    INDEX idx_registrations_form_id     (form_id),
    INDEX idx_registrations_approval    (approval_status),
    INDEX idx_registrations_deleted     (deleted_at),
    CONSTRAINT fk_registrations_event   FOREIGN KEY (event_id)    REFERENCES events              (id),
    CONSTRAINT fk_registrations_user    FOREIGN KEY (user_id)     REFERENCES users               (id) ON DELETE SET NULL,
    CONSTRAINT fk_registrations_form    FOREIGN KEY (form_id)     REFERENCES registration_forms  (id),
    CONSTRAINT fk_registrations_approver FOREIGN KEY (approved_by) REFERENCES admins             (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- registration_field_values
-- EAV: stores per-registrant answers for custom form fields
-- -----------------------------------------------------------------------------
CREATE TABLE registration_field_values (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    registration_id BIGINT UNSIGNED NOT NULL,
    field_id        BIGINT UNSIGNED NOT NULL,
    value           TEXT                NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_reg_field_values (registration_id, field_id),
    INDEX idx_reg_field_values_field (field_id),
    CONSTRAINT fk_reg_field_values_reg   FOREIGN KEY (registration_id) REFERENCES registrations           (id) ON DELETE CASCADE,
    CONSTRAINT fk_reg_field_values_field FOREIGN KEY (field_id)        REFERENCES registration_form_fields(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 7 — WEBCAST
-- =============================================================================

-- -----------------------------------------------------------------------------
-- webcasts
-- One event can have one primary webcast stream.
-- Keeps stream config separate from event metadata.
-- -----------------------------------------------------------------------------
CREATE TABLE webcasts (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    event_id            BIGINT UNSIGNED NOT NULL,
    title               VARCHAR(300)    NOT NULL,
    stream_url          VARCHAR(1000)       NULL,   -- RTMP / HLS / embed URL
    stream_provider     VARCHAR(100)        NULL,   -- e.g. Zoom, Vimeo, Wowza
    stream_key          VARCHAR(255)        NULL,
    backup_stream_url   VARCHAR(1000)       NULL,
    recording_url       VARCHAR(1000)       NULL,
    chat_enabled        TINYINT(1)      NOT NULL DEFAULT 1,
    qa_enabled          TINYINT(1)      NOT NULL DEFAULT 1,
    polls_enabled       TINYINT(1)      NOT NULL DEFAULT 1,
    started_at          DATETIME            NULL,
    ended_at            DATETIME            NULL,
    status              ENUM('scheduled','live','paused','ended','cancelled') NOT NULL DEFAULT 'scheduled',
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_webcasts_event (event_id),
    INDEX idx_webcasts_status (status),
    CONSTRAINT fk_webcasts_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- webcast_agenda_items
-- Ordered agenda / schedule blocks within a webcast
-- -----------------------------------------------------------------------------
CREATE TABLE webcast_agenda_items (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    webcast_id  BIGINT UNSIGNED NOT NULL,
    speaker_id  BIGINT UNSIGNED     NULL,
    title       VARCHAR(300)    NOT NULL,
    description TEXT                NULL,
    starts_at   DATETIME            NULL,
    ends_at     DATETIME            NULL,
    sort_order  SMALLINT        NOT NULL DEFAULT 0,
    status      ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_agenda_webcast  (webcast_id),
    INDEX idx_agenda_speaker  (speaker_id),
    CONSTRAINT fk_agenda_webcast  FOREIGN KEY (webcast_id) REFERENCES webcasts (id) ON DELETE CASCADE,
    CONSTRAINT fk_agenda_speaker  FOREIGN KEY (speaker_id) REFERENCES speakers (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 8 — ATTENDANCE
-- =============================================================================

-- -----------------------------------------------------------------------------
-- attendance
-- One row per user join per webcast. Updated on leave/rejoin.
-- Enables dwell-time analytics.
-- -----------------------------------------------------------------------------
CREATE TABLE attendance (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    webcast_id      BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED     NULL,
    registration_id BIGINT UNSIGNED     NULL,
    ip_address      VARCHAR(45)         NULL,
    user_agent      VARCHAR(500)        NULL,
    joined_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left_at         DATETIME            NULL,
    dwell_seconds   INT UNSIGNED        NULL,
    status          ENUM('joined','left','ejected') NOT NULL DEFAULT 'joined',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_attendance_webcast      (webcast_id),
    INDEX idx_attendance_user         (user_id),
    INDEX idx_attendance_registration (registration_id),
    INDEX idx_attendance_joined_at    (joined_at),
    CONSTRAINT fk_attendance_webcast      FOREIGN KEY (webcast_id)      REFERENCES webcasts       (id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_user         FOREIGN KEY (user_id)         REFERENCES users          (id) ON DELETE SET NULL,
    CONSTRAINT fk_attendance_registration FOREIGN KEY (registration_id) REFERENCES registrations  (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 9 — QUESTIONS (Q&A)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- questions
-- Attendees submit questions during a live webcast.
-- Moderators approve/dismiss. Speakers answer.
-- -----------------------------------------------------------------------------
CREATE TABLE questions (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    webcast_id      BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED     NULL,
    registration_id BIGINT UNSIGNED     NULL,
    body            TEXT            NOT NULL,
    is_anonymous    TINYINT(1)      NOT NULL DEFAULT 0,
    upvote_count    INT UNSIGNED    NOT NULL DEFAULT 0,
    answered_at     DATETIME            NULL,
    answered_by     BIGINT UNSIGNED     NULL,   -- speaker_id
    answer_body     TEXT                NULL,
    moderation_status ENUM('pending','approved','dismissed','answered') NOT NULL DEFAULT 'pending',
    status          ENUM('active','deleted') NOT NULL DEFAULT 'active',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_questions_webcast       (webcast_id),
    INDEX idx_questions_user          (user_id),
    INDEX idx_questions_mod_status    (moderation_status),
    CONSTRAINT fk_questions_webcast   FOREIGN KEY (webcast_id) REFERENCES webcasts (id) ON DELETE CASCADE,
    CONSTRAINT fk_questions_user      FOREIGN KEY (user_id)    REFERENCES users    (id) ON DELETE SET NULL,
    CONSTRAINT fk_questions_speaker   FOREIGN KEY (answered_by) REFERENCES speakers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- question_upvotes
-- Prevents duplicate upvotes per user per question
-- -----------------------------------------------------------------------------
CREATE TABLE question_upvotes (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    question_id BIGINT UNSIGNED NOT NULL,
    user_id     BIGINT UNSIGNED NOT NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_question_upvotes (question_id, user_id),
    INDEX idx_question_upvotes_user (user_id),
    CONSTRAINT fk_q_upvotes_question FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
    CONSTRAINT fk_q_upvotes_user     FOREIGN KEY (user_id)     REFERENCES users     (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 10 — POLLS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- polls
-- Live polls pushed by the host during a webcast
-- -----------------------------------------------------------------------------
CREATE TABLE polls (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    webcast_id      BIGINT UNSIGNED NOT NULL,
    created_by      BIGINT UNSIGNED NOT NULL,   -- admin_id
    question        VARCHAR(500)    NOT NULL,
    allow_multiple  TINYINT(1)      NOT NULL DEFAULT 0,
    show_results    TINYINT(1)      NOT NULL DEFAULT 1,
    launched_at     DATETIME            NULL,
    closed_at       DATETIME            NULL,
    status          ENUM('draft','live','closed') NOT NULL DEFAULT 'draft',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_polls_webcast    (webcast_id),
    INDEX idx_polls_status     (status),
    CONSTRAINT fk_polls_webcast    FOREIGN KEY (webcast_id) REFERENCES webcasts (id) ON DELETE CASCADE,
    CONSTRAINT fk_polls_admin      FOREIGN KEY (created_by) REFERENCES admins   (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- poll_options  — answer choices for each poll
-- -----------------------------------------------------------------------------
CREATE TABLE poll_options (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    poll_id     BIGINT UNSIGNED NOT NULL,
    option_text VARCHAR(300)    NOT NULL,
    sort_order  SMALLINT        NOT NULL DEFAULT 0,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_poll_options_poll (poll_id),
    CONSTRAINT fk_poll_options_poll FOREIGN KEY (poll_id) REFERENCES polls (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- poll_votes  — one row per user per option (multi-select aware)
-- -----------------------------------------------------------------------------
CREATE TABLE poll_votes (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    poll_id         BIGINT UNSIGNED NOT NULL,
    option_id       BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED     NULL,
    registration_id BIGINT UNSIGNED     NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_poll_votes (poll_id, option_id, user_id),
    INDEX idx_poll_votes_option       (option_id),
    INDEX idx_poll_votes_user         (user_id),
    CONSTRAINT fk_poll_votes_poll     FOREIGN KEY (poll_id)   REFERENCES polls        (id) ON DELETE CASCADE,
    CONSTRAINT fk_poll_votes_option   FOREIGN KEY (option_id) REFERENCES poll_options (id) ON DELETE CASCADE,
    CONSTRAINT fk_poll_votes_user     FOREIGN KEY (user_id)   REFERENCES users        (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 11 — QUIZ
-- =============================================================================

-- -----------------------------------------------------------------------------
-- quizzes — knowledge assessment tied to a webcast or standalone
-- -----------------------------------------------------------------------------
CREATE TABLE quizzes (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    webcast_id      BIGINT UNSIGNED     NULL,
    event_id        BIGINT UNSIGNED NOT NULL,
    created_by      BIGINT UNSIGNED NOT NULL,
    title           VARCHAR(300)    NOT NULL,
    description     TEXT                NULL,
    passing_score   TINYINT UNSIGNED    NULL DEFAULT 70,   -- percentage
    time_limit_mins SMALLINT            NULL,
    max_attempts    TINYINT UNSIGNED    NULL DEFAULT 1,
    show_answers    TINYINT(1)      NOT NULL DEFAULT 0,
    status          ENUM('draft','published','closed') NOT NULL DEFAULT 'draft',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME            NULL,
    PRIMARY KEY (id),
    INDEX idx_quizzes_webcast   (webcast_id),
    INDEX idx_quizzes_event     (event_id),
    INDEX idx_quizzes_status    (status),
    CONSTRAINT fk_quizzes_webcast FOREIGN KEY (webcast_id) REFERENCES webcasts (id) ON DELETE SET NULL,
    CONSTRAINT fk_quizzes_event   FOREIGN KEY (event_id)   REFERENCES events   (id) ON DELETE CASCADE,
    CONSTRAINT fk_quizzes_admin   FOREIGN KEY (created_by) REFERENCES admins   (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- quiz_questions
-- -----------------------------------------------------------------------------
CREATE TABLE quiz_questions (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    quiz_id         BIGINT UNSIGNED NOT NULL,
    question_text   TEXT            NOT NULL,
    question_type   ENUM('single','multiple','true_false','short_answer') NOT NULL DEFAULT 'single',
    points          TINYINT UNSIGNED NOT NULL DEFAULT 1,
    explanation     TEXT                NULL,   -- shown after answer
    sort_order      SMALLINT        NOT NULL DEFAULT 0,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_quiz_questions_quiz (quiz_id),
    CONSTRAINT fk_quiz_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- quiz_options  — answer choices per question
-- -----------------------------------------------------------------------------
CREATE TABLE quiz_options (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    question_id     BIGINT UNSIGNED NOT NULL,
    option_text     TEXT            NOT NULL,
    is_correct      TINYINT(1)      NOT NULL DEFAULT 0,
    sort_order      SMALLINT        NOT NULL DEFAULT 0,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_quiz_options_question (question_id),
    CONSTRAINT fk_quiz_options_question FOREIGN KEY (question_id) REFERENCES quiz_questions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- quiz_attempts  — one attempt record per user per quiz
-- -----------------------------------------------------------------------------
CREATE TABLE quiz_attempts (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    quiz_id         BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED     NULL,
    registration_id BIGINT UNSIGNED     NULL,
    attempt_number  TINYINT UNSIGNED NOT NULL DEFAULT 1,
    score           DECIMAL(5,2)        NULL,
    passed          TINYINT(1)          NULL,
    started_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at    DATETIME            NULL,
    status          ENUM('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_quiz_attempts_quiz (quiz_id),
    INDEX idx_quiz_attempts_user (user_id),
    CONSTRAINT fk_quiz_attempts_quiz FOREIGN KEY (quiz_id)  REFERENCES quizzes        (id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_attempts_user FOREIGN KEY (user_id)  REFERENCES users          (id) ON DELETE SET NULL,
    CONSTRAINT fk_quiz_attempts_reg  FOREIGN KEY (registration_id) REFERENCES registrations (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- quiz_answers  — per-question answers within an attempt
-- -----------------------------------------------------------------------------
CREATE TABLE quiz_answers (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    attempt_id      BIGINT UNSIGNED NOT NULL,
    question_id     BIGINT UNSIGNED NOT NULL,
    selected_option_id BIGINT UNSIGNED NULL,
    text_answer     TEXT                NULL,   -- for short_answer type
    is_correct      TINYINT(1)          NULL,
    points_awarded  DECIMAL(4,2)    NOT NULL DEFAULT 0,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_quiz_answers_attempt  (attempt_id),
    INDEX idx_quiz_answers_question (question_id),
    CONSTRAINT fk_quiz_answers_attempt  FOREIGN KEY (attempt_id)  REFERENCES quiz_attempts  (id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_answers_question FOREIGN KEY (question_id) REFERENCES quiz_questions (id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_answers_option   FOREIGN KEY (selected_option_id) REFERENCES quiz_options (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 12 — SURVEYS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- surveys  — post-event or mid-event structured surveys
-- -----------------------------------------------------------------------------
CREATE TABLE surveys (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    event_id        BIGINT UNSIGNED NOT NULL,
    webcast_id      BIGINT UNSIGNED     NULL,
    created_by      BIGINT UNSIGNED NOT NULL,
    title           VARCHAR(300)    NOT NULL,
    description     TEXT                NULL,
    thank_you_message TEXT            NULL,
    is_anonymous    TINYINT(1)      NOT NULL DEFAULT 0,
    trigger_on      ENUM('manual','on_join','on_leave','on_end') NOT NULL DEFAULT 'manual',
    status          ENUM('draft','active','closed') NOT NULL DEFAULT 'draft',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME            NULL,
    PRIMARY KEY (id),
    INDEX idx_surveys_event   (event_id),
    INDEX idx_surveys_status  (status),
    CONSTRAINT fk_surveys_event   FOREIGN KEY (event_id)   REFERENCES events   (id) ON DELETE CASCADE,
    CONSTRAINT fk_surveys_webcast FOREIGN KEY (webcast_id) REFERENCES webcasts (id) ON DELETE SET NULL,
    CONSTRAINT fk_surveys_admin   FOREIGN KEY (created_by) REFERENCES admins   (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- survey_questions
-- -----------------------------------------------------------------------------
CREATE TABLE survey_questions (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    survey_id       BIGINT UNSIGNED NOT NULL,
    question_text   TEXT            NOT NULL,
    question_type   ENUM('text','textarea','rating','single','multiple','nps') NOT NULL DEFAULT 'text',
    options         JSON                NULL,
    is_required     TINYINT(1)      NOT NULL DEFAULT 0,
    sort_order      SMALLINT        NOT NULL DEFAULT 0,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_survey_questions_survey (survey_id),
    CONSTRAINT fk_survey_questions_survey FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- survey_responses  — one response set per user per survey
-- -----------------------------------------------------------------------------
CREATE TABLE survey_responses (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    survey_id       BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED     NULL,
    registration_id BIGINT UNSIGNED     NULL,
    submitted_at    DATETIME            NULL,
    status          ENUM('in_progress','submitted') NOT NULL DEFAULT 'in_progress',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_survey_responses_survey (survey_id),
    INDEX idx_survey_responses_user   (user_id),
    CONSTRAINT fk_survey_responses_survey FOREIGN KEY (survey_id)       REFERENCES surveys        (id) ON DELETE CASCADE,
    CONSTRAINT fk_survey_responses_user   FOREIGN KEY (user_id)         REFERENCES users          (id) ON DELETE SET NULL,
    CONSTRAINT fk_survey_responses_reg    FOREIGN KEY (registration_id) REFERENCES registrations  (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- survey_answers
-- -----------------------------------------------------------------------------
CREATE TABLE survey_answers (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    response_id     BIGINT UNSIGNED NOT NULL,
    question_id     BIGINT UNSIGNED NOT NULL,
    answer_value    TEXT                NULL,   -- free text or JSON array for multi-select
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_survey_answers_response (response_id),
    INDEX idx_survey_answers_question (question_id),
    CONSTRAINT fk_survey_answers_response FOREIGN KEY (response_id)  REFERENCES survey_responses (id) ON DELETE CASCADE,
    CONSTRAINT fk_survey_answers_question FOREIGN KEY (question_id)  REFERENCES survey_questions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 13 — FEEDBACK
-- =============================================================================

-- -----------------------------------------------------------------------------
-- feedback
-- Quick star rating + comment after webcast. Separate from surveys.
-- -----------------------------------------------------------------------------
CREATE TABLE feedback (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    event_id        BIGINT UNSIGNED NOT NULL,
    webcast_id      BIGINT UNSIGNED     NULL,
    user_id         BIGINT UNSIGNED     NULL,
    registration_id BIGINT UNSIGNED     NULL,
    overall_rating  TINYINT UNSIGNED    NULL,   -- 1–5
    content_rating  TINYINT UNSIGNED    NULL,
    speaker_rating  TINYINT UNSIGNED    NULL,
    platform_rating TINYINT UNSIGNED    NULL,
    comment         TEXT                NULL,
    is_anonymous    TINYINT(1)      NOT NULL DEFAULT 0,
    status          ENUM('active','flagged','hidden') NOT NULL DEFAULT 'active',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_feedback_event   (event_id),
    INDEX idx_feedback_webcast (webcast_id),
    INDEX idx_feedback_user    (user_id),
    CONSTRAINT fk_feedback_event    FOREIGN KEY (event_id)        REFERENCES events        (id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_webcast  FOREIGN KEY (webcast_id)      REFERENCES webcasts      (id) ON DELETE SET NULL,
    CONSTRAINT fk_feedback_user     FOREIGN KEY (user_id)         REFERENCES users         (id) ON DELETE SET NULL,
    CONSTRAINT fk_feedback_reg      FOREIGN KEY (registration_id) REFERENCES registrations (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 14 — EMAIL INVITATIONS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- email_templates
-- Reusable HTML templates for system + manual emails
-- -----------------------------------------------------------------------------
CREATE TABLE email_templates (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    event_id    BIGINT UNSIGNED     NULL,   -- NULL = global template
    name        VARCHAR(200)    NOT NULL,
    slug        VARCHAR(200)    NOT NULL,
    subject     VARCHAR(300)    NOT NULL,
    body_html   LONGTEXT        NOT NULL,
    body_text   LONGTEXT            NULL,
    variables   JSON                NULL,   -- list of merge tags
    status      ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_email_templates_slug_event (slug, event_id),
    INDEX idx_email_templates_event (event_id),
    CONSTRAINT fk_email_templates_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- email_campaigns
-- A batch of invitations sent for an event
-- -----------------------------------------------------------------------------
CREATE TABLE email_campaigns (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    event_id        BIGINT UNSIGNED NOT NULL,
    template_id     INT UNSIGNED    NOT NULL,
    created_by      BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(300)    NOT NULL,
    send_at         DATETIME            NULL,   -- NULL = immediate
    sent_at         DATETIME            NULL,
    total_recipients INT UNSIGNED   NOT NULL DEFAULT 0,
    status          ENUM('draft','scheduled','sending','sent','cancelled') NOT NULL DEFAULT 'draft',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_email_campaigns_event    (event_id),
    INDEX idx_email_campaigns_template (template_id),
    CONSTRAINT fk_email_campaigns_event    FOREIGN KEY (event_id)    REFERENCES events          (id),
    CONSTRAINT fk_email_campaigns_template FOREIGN KEY (template_id) REFERENCES email_templates (id),
    CONSTRAINT fk_email_campaigns_admin    FOREIGN KEY (created_by)  REFERENCES admins          (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- email_logs
-- Per-recipient delivery record with bounce/open/click tracking
-- -----------------------------------------------------------------------------
CREATE TABLE email_logs (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    campaign_id     INT UNSIGNED        NULL,
    event_id        BIGINT UNSIGNED     NULL,
    user_id         BIGINT UNSIGNED     NULL,
    registration_id BIGINT UNSIGNED     NULL,
    to_email        VARCHAR(180)    NOT NULL,
    subject         VARCHAR(300)    NOT NULL,
    template_slug   VARCHAR(200)        NULL,
    message_id      VARCHAR(255)        NULL,   -- SMTP / provider message ID
    opened_at       DATETIME            NULL,
    clicked_at      DATETIME            NULL,
    bounced_at      DATETIME            NULL,
    bounce_reason   VARCHAR(500)        NULL,
    status          ENUM('queued','sent','delivered','opened','clicked','bounced','failed','spam') NOT NULL DEFAULT 'queued',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_email_logs_campaign (campaign_id),
    INDEX idx_email_logs_email    (to_email),
    INDEX idx_email_logs_status   (status),
    INDEX idx_email_logs_user     (user_id),
    CONSTRAINT fk_email_logs_campaign FOREIGN KEY (campaign_id)     REFERENCES email_campaigns (id) ON DELETE SET NULL,
    CONSTRAINT fk_email_logs_user     FOREIGN KEY (user_id)         REFERENCES users           (id) ON DELETE SET NULL,
    CONSTRAINT fk_email_logs_reg      FOREIGN KEY (registration_id) REFERENCES registrations   (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 15 — ACTIVITY LOGS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- activity_logs
-- Immutable audit trail. Never update or delete rows.
-- Covers both admin actions and attendee actions.
-- -----------------------------------------------------------------------------
CREATE TABLE activity_logs (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    actor_type      ENUM('admin','user','system') NOT NULL DEFAULT 'system',
    actor_id        BIGINT UNSIGNED     NULL,
    event_id        BIGINT UNSIGNED     NULL,
    action          VARCHAR(100)    NOT NULL,   -- e.g. 'user.registered', 'webcast.started'
    subject_type    VARCHAR(100)        NULL,   -- e.g. 'Registration', 'Webcast'
    subject_id      BIGINT UNSIGNED     NULL,
    description     TEXT                NULL,
    meta            JSON                NULL,   -- extra context (old/new values, etc.)
    ip_address      VARCHAR(45)         NULL,
    user_agent      VARCHAR(500)        NULL,
    status          ENUM('success','failure') NOT NULL DEFAULT 'success',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_activity_logs_actor    (actor_type, actor_id),
    INDEX idx_activity_logs_event    (event_id),
    INDEX idx_activity_logs_action   (action),
    INDEX idx_activity_logs_subject  (subject_type, subject_id),
    INDEX idx_activity_logs_created  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 16 — REPORTS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- reports
-- Stores generated/scheduled report metadata.
-- Actual data lives in storage; this table tracks the manifest.
-- -----------------------------------------------------------------------------
CREATE TABLE reports (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    event_id        BIGINT UNSIGNED     NULL,
    created_by      BIGINT UNSIGNED NOT NULL,
    report_type     VARCHAR(100)    NOT NULL,   -- 'attendance','quiz_scores','feedback', etc.
    report_name     VARCHAR(300)    NOT NULL,
    parameters      JSON                NULL,   -- filters applied (date range, event, etc.)
    file_path       VARCHAR(500)        NULL,
    file_format     ENUM('csv','xlsx','pdf') NOT NULL DEFAULT 'csv',
    row_count       INT UNSIGNED        NULL,
    generated_at    DATETIME            NULL,
    expires_at      DATETIME            NULL,
    status          ENUM('pending','processing','ready','failed','expired') NOT NULL DEFAULT 'pending',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_reports_event      (event_id),
    INDEX idx_reports_created_by (created_by),
    INDEX idx_reports_status     (status),
    CONSTRAINT fk_reports_event FOREIGN KEY (event_id)   REFERENCES events (id) ON DELETE SET NULL,
    CONSTRAINT fk_reports_admin FOREIGN KEY (created_by) REFERENCES admins (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MODULE 17 — SETTINGS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- settings
-- Key-value store for both global and event-scoped settings.
-- NULL event_id = global / platform-wide setting.
-- -----------------------------------------------------------------------------
CREATE TABLE settings (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    event_id    BIGINT UNSIGNED     NULL,
    `group`     VARCHAR(100)    NOT NULL DEFAULT 'general',
    `key`       VARCHAR(150)    NOT NULL,
    value       TEXT                NULL,
    value_type  ENUM('string','integer','boolean','json') NOT NULL DEFAULT 'string',
    is_public   TINYINT(1)      NOT NULL DEFAULT 0,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_settings_key_event (event_id, `group`, `key`),
    INDEX idx_settings_event (event_id),
    CONSTRAINT fk_settings_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- RE-ENABLE FK CHECKS
-- =============================================================================
SET FOREIGN_KEY_CHECKS = 1;
