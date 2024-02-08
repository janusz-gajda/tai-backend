-- liquibase formatted sql
-- changeset tai:0.0.3
-- _songToSongsCollection table
CREATE TABLE IF NOT EXISTS _SongToSongsCollection
(
    A BIGINT,
    B BIGINT,
    FOREIGN KEY (A) REFERENCES Song (id),
    FOREIGN KEY (B) REFERENCES SongsCollection (id)
);

CREATE UNIQUE INDEX _SongToSongsCollection_AB_unique ON _SongToSongsCollection (A, B);