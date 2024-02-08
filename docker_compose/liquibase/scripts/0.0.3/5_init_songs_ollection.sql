-- liquibase formatted sql
-- changeset tai:0.0.3
-- SongsCollection table
CREATE TABLE IF NOT EXISTS SongsCollection
(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    type        ENUM ('SONG', 'ALBUM', 'PLAYLIST'),
    access      ENUM ('PUBLIC', 'PRIVATE', 'SHARED'),
    creatorId   BIGINT,
    FOREIGN KEY (creatorId) REFERENCES User (id)
);