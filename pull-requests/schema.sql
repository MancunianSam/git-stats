CREATE TABLE pull_requests
(
    id bigint PRIMARY KEY NOT NULL AUTO_INCREMENT,
    created_at timestamp,
    closedAt timestamp,
    title varchar(255),
    author varchar(255),
    merged boolean,
    additions int,
    deletions int,
    commits int
);