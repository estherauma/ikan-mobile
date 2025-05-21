ALTER TABLE profiles ADD is_mobile_verified BOOLEAN DEFAULT 0;
ALTER TABLE profiles ADD is_telephone_verified BOOLEAN DEFAULT 0;
CREATE UNIQUE INDEX unique_mobile_index ON profiles(mobile);
CREATE UNIQUE INDEX unique_telephone_index ON profiles(telephone);
