-- liquibase formatted sql
-- changeset tai:0.0.3
-- permission table
CREATE TABLE IF NOT EXISTS Permission
(
    name        VARCHAR(32) PRIMARY KEY,
    description VARCHAR(200) DEFAULT NULL
);

INSERT INTO Permission (name, description)
VALUES ('VIEW', 'Permission which allows to access the basic functionalities of app'),
       ('MANAGE_SONGS', 'Permission which allows to manage songs by user'),
       ('ADMIN', 'Permission which allows to manage other permissions and users');