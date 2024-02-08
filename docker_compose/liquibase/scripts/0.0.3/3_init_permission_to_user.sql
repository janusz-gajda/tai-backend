-- liquibase formatted sql
-- changeset tai:0.0.3
-- _PermissionToUser table
CREATE TABLE IF NOT EXISTS _PermissionToUser
(
    A VARCHAR(32),
    B BIGINT,
    FOREIGN KEY (A) REFERENCES Permission (name),
    FOREIGN KEY (B) REFERENCES User (id)
);

CREATE UNIQUE INDEX _PermissionToUser_AB_unique ON _PermissionToUser (A, B);

-- add admin user all permissions
INSERT INTO _PermissionToUser (A, B)
VALUES ('VIEW', 1),
       ('MANAGE_SONGS', 1),
       ('ADMIN', 1);