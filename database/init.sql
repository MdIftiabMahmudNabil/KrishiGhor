-- Create database
CREATE DATABASE krishighor_db;

-- Create user
CREATE USER krishighor_user WITH PASSWORD 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE krishighor_db TO krishighor_user;

-- Connect to database
\c krishighor_db;

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";