-- liquibase formatted sql
-- changeset tai:0.0.3
-- Song table
CREATE TABLE IF NOT EXISTS Song
(
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    title        VARCHAR(255) NOT NULL,
    author       VARCHAR(255) NOT NULL,
    access       ENUM ('PUBLIC', 'PRIVATE', 'SHARED'),
    addingUserId BIGINT       NOT NULL,
    FOREIGN KEY (addingUserId) REFERENCES User (id)
);