-- liquibase formatted sql
-- changeset tai:0.0.3
-- user table
CREATE TABLE IF NOT EXISTS User
(
    id       BIGINT PRIMARY KEY AUTO_INCREMENT,
    name     VARCHAR(32) UNIQUE  NOT NULL,
    password VARCHAR(255)        NOT NULL,
    email    VARCHAR(255) UNIQUE NOT NULL,
    googleId VARCHAR(32)
);

-- admin password: Admin123 hashed (10 salt rounds)
INSERT INTO User (name, password, email)
VALUES ('admin', '$2a$10$n3ZhktchFCYxhVPrN38rVOyfPtVzrAmSqSKdweLDBKmZWnV31FQvS', 'admin@admin.com');