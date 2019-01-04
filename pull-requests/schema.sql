SET FOREIGN_KEY_CHECKS  = 0;

DROP schema if exists git_stats_pull_requests;
create schema git_stats_pull_requests;
use git_stats_pull_requests;

CREATE TABLE repository (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  name varchar(255) DEFAULT NULL,
  task_id varchar(255) DEFAULT NULL,
  user_name varchar(255) DEFAULT NULL,
  complete boolean,
  PRIMARY KEY (id)
);

CREATE TABLE pull_requests
(
    id bigint PRIMARY KEY NOT NULL AUTO_INCREMENT,
    created_at timestamp,
    closed_at timestamp,
    title varchar(255),
    author varchar(255),
    merged boolean,
    additions int,
    deletions int,
    commits int
);

SET FOREIGN_KEY_CHECKS  = 1;