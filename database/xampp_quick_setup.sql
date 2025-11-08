-- Quick Database Setup Script for XAMPP
-- Run this in phpMyAdmin to set up the database quickly

-- Create database
CREATE DATABASE IF NOT EXISTS placement_portal;
USE placement_portal;

-- Import the main schema (if this doesn't work, manually import the schema.sql file)
-- Source: database/schema.sql

-- Verify the setup
SHOW TABLES;

-- Show database info
SELECT 'Database setup completed successfully!' as status;