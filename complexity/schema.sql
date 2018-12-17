USE git_stats;
-- MySQL dump 10.13  Distrib 8.0.13, for Linux (x86_64)
--
-- Host: localhost    Database: git_stats
-- ------------------------------------------------------
-- Server version	8.0.13

--
-- Table structure for table `file`
--
CREATE TABLE `repository` (

  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `task_id` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `files` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(1000) DEFAULT NULL,
  `nloc` int(11) DEFAULT NULL,
  `repository_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `repository_id` (`repository_id`),
  FOREIGN KEY (`repository_id`) REFERENCES `repository` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `function_details` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `nloc` int(11) DEFAULT NULL,
  `cyclomatic_complexity` int(11) DEFAULT NULL,
  `file_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `file_id` (`file_id`),
  FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;


create table complexity_by_file (
repository_id BIGINT(20),
file_name varchar(1000),
cyclomatic_complexity int,
KEY `repository_id` (`repository_id`),
FOREIGN KEY (`repository_id`) REFERENCES `repository` (`id`) ON DELETE CASCADE
);

create table nloc_by_file (
repository_id BIGINT(20),
file_name varchar(1000),
nloc int,
KEY `repository_id` (`repository_id`),
FOREIGN KEY (`repository_id`) REFERENCES `repository` (`id`) ON DELETE CASCADE
);

create table complexity_by_repository (
repository_id BIGINT(20),
cyclomatic_complexity int,
KEY `repository_id` (`repository_id`),
FOREIGN KEY (`repository_id`) REFERENCES `repository` (`id`) ON DELETE CASCADE
);

create table nloc_by_repository (
repository_id BIGINT(20),
nloc int,
KEY `repository_id` (`repository_id`),
FOREIGN KEY (`repository_id`) REFERENCES `repository` (`id`) ON DELETE CASCADE
);
