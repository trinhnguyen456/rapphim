CREATE TABLE IF NOT EXISTS request_rate_limits (
  scope_key VARCHAR(16) NOT NULL,
  window_started DATETIME(3) NOT NULL,
  attempts INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (scope_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
