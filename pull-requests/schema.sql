SET FOREIGN_KEY_CHECKS  = 0;

use git_stats;

CREATE TABLE pull_requests_repository (
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
    commits int,
    repository_id bigint,
    KEY repository_id (repository_id),
  FOREIGN KEY (repository_id) REFERENCES pull_requests_repository (id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS  = 1;