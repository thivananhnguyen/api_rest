-- Active: 1719263174498@@127.0.0.1@5432@api@public
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users
ADD COLUMN role VARCHAR(20) DEFAULT 'user' NOT NULL;

UPDATE users
SET role = 'admin'
WHERE id = '36e76488-12e5-4ab8-8ee9-ec5348eacd78';

-- full table login-attempts
CREATE TABLE login_attempts (
    email VARCHAR(100) NOT NULL,
    attempts INT DEFAULT 0,
    last_attempt TIMESTAMP NOT NULL,
    locked_until TIMESTAMP NULL,
    PRIMARY KEY (email),
    FOREIGN KEY (email) REFERENCES users(email)
);

--deux etape creer table login-attempts
/* CREATE TABLE login_attempts (
    email VARCHAR(100) NOT NULL,
    attempts INT DEFAULT 0,
    last_attempt TIMESTAMP NOT NULL,
    PRIMARY KEY (email),
    FOREIGN KEY (email) REFERENCES users(email)
);
ALTER TABLE login_attempts
ADD COLUMN locked_until TIMESTAMP NULL; */


ALTER TABLE users
ADD COLUMN is_locked BOOLEAN DEFAULT FALSE,
ADD COLUMN lock_until TIMESTAMP;

