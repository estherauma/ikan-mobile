CREATE TABLE IF NOT EXISTS user_banks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  online_ref VARCHAR(255),
  app_ref VARCHAR(255) NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(255) NOT NULL,
  routing_number VARCHAR(255),
  swift_code VARCHAR(255),
  bank_name VARCHAR(255),
  bank_branch VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT 1,
)

CREATE TABLE IF NOT EXISTS user_beneficiaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  online_ref VARCHAR(255),
  app_ref VARCHAR(255) NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  f_name VARCHAR(255) NOT NULL,
  l_name VARCHAR(255) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(255) NOT NULL,
  routing_number VARCHAR(255),
  swift_code VARCHAR(255),
  bank_name VARCHAR(255),
  bank_branch VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT 1,
)

ALTER TABLE profiles ADD online_ref VARCHAR(255);
