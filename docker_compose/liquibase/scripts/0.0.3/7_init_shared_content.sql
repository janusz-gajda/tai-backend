-- liquibase formatted sql
-- changeset tai:0.0.3
-- SharedContent table
CREATE TABLE IF NOT EXISTS SharedContent
(
    recipientId BIGINT,
    contentId   BIGINT,
    contentType ENUM ('SONG', 'ALBUM', 'PLAYLIST'),
    sharedAt    DATETIME DEFAULT now(),
    FOREIGN KEY (recipientId) REFERENCES User (id),
    PRIMARY KEY (recipientId, contentId)
);