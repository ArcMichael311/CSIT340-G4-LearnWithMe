-- SQL Script to Update Existing User Passwords in Database
-- Run this script in MySQL Workbench AFTER starting your Spring Boot application
-- This will update the password column length and clear existing plain-text passwords

-- Step 1: First, make sure the column is large enough (Spring Boot should do this automatically)
ALTER TABLE users MODIFY COLUMN password VARCHAR(60) NOT NULL;

-- Step 2: You have two options for existing users:

-- OPTION A: Clear all existing passwords (users will need to re-register or reset password)
-- UPDATE users SET password = '';

-- OPTION B: Set a temporary hashed password for all users
-- The password below is the BCrypt hash for "TempPassword123!"
-- All existing users can login with this temporary password, then change it
-- UPDATE users SET password = '$2a$10$XVTSN3h8eDR0YHvhOJH3Q.wLm3GiJqFnLJQWuLJBkJrN2YvKL7QOq';

-- OPTION C: Keep the database as-is and manually re-register all users
-- Just leave the old passwords - they won't work anymore, users need to re-register

-- After running this script, restart your Spring Boot application
-- New registrations will automatically use BCrypt password hashing
