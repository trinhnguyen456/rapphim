CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id VARCHAR(32) NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(32) NOT NULL DEFAULT '',
  dob DATE NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  status ENUM('active','disabled') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_public_id (public_id),
  UNIQUE KEY uq_users_email (email),
  KEY ix_users_role_status (role, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sessions_token_hash (token_hash),
  KEY ix_sessions_expiry (expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS movies (
  code VARCHAR(32) NOT NULL,
  title VARCHAR(180) NOT NULL,
  genre VARCHAR(180) NOT NULL DEFAULT '',
  duration VARCHAR(40) NOT NULL DEFAULT '',
  rating ENUM('T13','T16','T18','P','K') NOT NULL DEFAULT 'P',
  release_text VARCHAR(40) NOT NULL DEFAULT '',
  director VARCHAR(180) NOT NULL DEFAULT '',
  actors VARCHAR(500) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  poster_url VARCHAR(600) NOT NULL,
  status ENUM('now_showing','coming_soon') NOT NULL DEFAULT 'now_showing',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (code),
  KEY ix_movies_status_title (status, title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cinemas (
  id VARCHAR(32) NOT NULL,
  name VARCHAR(180) NOT NULL,
  address VARCHAR(255) NOT NULL DEFAULT '',
  city VARCHAR(120) NOT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cinemas_name (name),
  KEY ix_cinemas_city_status (city, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(32) NOT NULL,
  cinema_id VARCHAR(32) NOT NULL,
  name VARCHAR(100) NOT NULL,
  seat_count SMALLINT UNSIGNED NOT NULL DEFAULT 78,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_rooms_cinema_name (cinema_id, name),
  CONSTRAINT fk_rooms_cinema FOREIGN KEY (cinema_id) REFERENCES cinemas(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS showtimes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  movie_code VARCHAR(32) NOT NULL,
  cinema_id VARCHAR(32) NOT NULL,
  room_id VARCHAR(32) NOT NULL,
  show_date DATE NOT NULL,
  start_time TIME NOT NULL,
  format VARCHAR(40) NOT NULL DEFAULT '2D phụ đề',
  base_price INT UNSIGNED NOT NULL DEFAULT 95000,
  status ENUM('on_sale','closed') NOT NULL DEFAULT 'on_sale',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_showtime_room_date_time (room_id, show_date, start_time),
  KEY ix_showtime_movie_date_status (movie_code, show_date, status),
  KEY ix_showtime_cinema_date (cinema_id, show_date),
  CONSTRAINT fk_showtimes_movie FOREIGN KEY (movie_code) REFERENCES movies(code) ON DELETE RESTRICT,
  CONSTRAINT fk_showtimes_cinema FOREIGN KEY (cinema_id) REFERENCES cinemas(id) ON DELETE RESTRICT,
  CONSTRAINT fk_showtimes_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS concessions (
  item_key VARCHAR(32) NOT NULL,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(255) NOT NULL DEFAULT '',
  category ENUM('combo','popcorn','drink') NOT NULL,
  unit_price INT UNSIGNED NOT NULL,
  options_json JSON NOT NULL,
  image_url VARCHAR(600) NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (item_key),
  KEY ix_concessions_category_active (category, active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS staff_directory (
  id VARCHAR(32) NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(32) NOT NULL DEFAULT '',
  role_label ENUM('admin','employee') NOT NULL DEFAULT 'employee',
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_staff_directory_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(40) NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  showtime_id BIGINT UNSIGNED NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(254) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  pay_method VARCHAR(40) NOT NULL,
  status ENUM('demo_confirmed') NOT NULL DEFAULT 'demo_confirmed',
  ticket_count SMALLINT UNSIGNED NOT NULL,
  total_amount INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bookings_code (code),
  KEY ix_bookings_user_created (user_id, created_at),
  KEY ix_bookings_showtime (showtime_id),
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_bookings_showtime FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS booking_seats (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  showtime_id BIGINT UNSIGNED NOT NULL,
  seat_code VARCHAR(4) NOT NULL,
  seat_type ENUM('Ghế thường','Ghế VIP','Ghế đôi') NOT NULL,
  unit_price INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_booking_seat_showtime (showtime_id, seat_code),
  KEY ix_booking_seats_booking (booking_id),
  CONSTRAINT fk_booking_seats_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_booking_seats_showtime FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS booking_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  item_key VARCHAR(32) NOT NULL,
  item_name VARCHAR(120) NOT NULL,
  quantity SMALLINT UNSIGNED NOT NULL,
  choice VARCHAR(80) NOT NULL DEFAULT '',
  unit_price INT UNSIGNED NOT NULL,
  line_total INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY ix_booking_items_booking (booking_id),
  CONSTRAINT fk_booking_items_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
