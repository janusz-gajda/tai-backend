-- liquibase formatted sql
-- changeset tai:0.0.5
ALTER TABLE Song
    ADD COLUMN trackNo int;