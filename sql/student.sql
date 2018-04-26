CREATE TABLE   IF NOT EXISTS  `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `age` int(2) DEFAULT NULL,
  `detail_info` json DEFAULT NULL,
  `create_time` varchar(20) DEFAULT NULL,
  `modified_time` varchar(20) DEFAULT NULL,
  `teacher_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `student` (teacher_email,name,age,phone) values ('123@qq.com','luoming',25,'18317943550');
INSERT INTO `student` (teacher_email,name,age,phone) values ('123@qq.com','luoying',28,'18317943551');
INSERT INTO `student` (teacher_email,name,age,phone) values ('123@qq.com','luoqing',31,'18317943552');