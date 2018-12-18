SET FOREIGN_KEY_CHECKS  = 0;
drop table if exists repository;
drop table if exists files;
drop table if exists function_details;
drop table if exists complexity_by_file;
drop table if exists complexity_by_repository;
drop table if exists complexity_by_function;


CREATE TABLE repository (

  id bigint(20) NOT NULL AUTO_INCREMENT,
  name varchar(255) DEFAULT NULL,
  task_id varchar(255) DEFAULT NULL,
  user_name varchar(255) DEFAULT NULL,
  status varchar(50) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE files (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  file_name varchar(1000) DEFAULT NULL,
  nloc int(11) DEFAULT NULL,
  repository_id bigint(20) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY repository_id (repository_id),
  FOREIGN KEY (repository_id) REFERENCES repository (id) ON DELETE CASCADE
);

CREATE TABLE function_details (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  name varchar(255) DEFAULT NULL,
  nloc int(11) DEFAULT NULL,
  cyclomatic_complexity int(11) DEFAULT NULL,
  file_id bigint(20) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY file_id (file_id),
  FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE
);

create table complexity_by_file (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  repository_id BIGINT(20),
  name varchar(1000),
  complexity int,
  nloc int,
  PRIMARY KEY (id),
  KEY repository_id (repository_id),
  FOREIGN KEY (repository_id) REFERENCES repository (id) ON DELETE CASCADE
);

create table complexity_by_function (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  repository_id BIGINT(20),
  name VARCHAR(255),
  complexity int,
  nloc int,
  PRIMARY KEY (id),
  KEY repository_id (repository_id),
  FOREIGN KEY (repository_id) REFERENCES repository (id) ON DELETE CASCADE
);


create table complexity_by_repository (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  repository_id BIGINT(20),
  complexity int,
  nloc int,
  PRIMARY KEY (id),
  KEY repository_id (repository_id),
  FOREIGN KEY (repository_id) REFERENCES repository (id) ON DELETE CASCADE
);


SET FOREIGN_KEY_CHECKS  = 1;