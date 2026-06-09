BEGIN TRANSACTION;
ALTER TABLE profiles RENAME TO profiles_old;
CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deleted BOOLEAN NOT NULL DEFAULT 0,
  email VARCHAR(100) UNIQUE,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  telephone VARCHAR(50) UNIQUE,
  is_telephone_verified BOOLEAN DEFAULT 0,
  mobile VARCHAR(50) UNIQUE,
  is_mobile_verified BOOLEAN DEFAULT 0,
  address_line_1 VARCHAR(100),
  address_line_2 VARCHAR(100),
  address_line_3 VARCHAR(100),
  city VARCHAR(100),
  country VARCHAR(50),
  postal_code VARCHAR(50),
  profile_image VARCHAR(255),
  registration_number VARCHAR(50),
  passport_number VARCHAR(50),
  position VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT 0,
  last_login VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at VARCHAR(50),
  created_by VARCHAR(50) NOT NULL,
  updated_by VARCHAR(50) NOT NULL,
  deleted_by VARCHAR(50),
  user_role VARCHAR(100) NOT NULL,
  online_ref VARCHAR(100)
);
INSERT INTO profiles (id, deleted, email, first_name, last_name, telephone, is_telephone_verified, mobile, is_mobile_verified, address_line_1, address_line_2, address_line_3, city, country, postal_code, profile_image, registration_number, passport_number, position, is_active, is_verified, last_login, created_at, updated_at, deleted_at, created_by, updated_by, deleted_by, user_role, online_ref)
SELECT id, deleted, email, first_name, last_name, telephone, is_telephone_verified, mobile, is_mobile_verified, address_line_1, address_line_2, address_line_3, city, country, postal_code, profile_image, registration_number, passport_number, position, is_active, is_verified, last_login, created_at, updated_at, deleted_at, created_by, updated_by, deleted_by, user_role, online_ref FROM profiles_old;
DROP TABLE profiles_old;
COMMIT;
