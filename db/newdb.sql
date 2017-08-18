USE biocorepipe;

--
-- Table structure for table `pipeline_process`
--

CREATE TABLE `pipeline_process_parameter` (
  `id` int(11) NOT NULL,
  `process_id` int(11) NOT NULL,
  `pipeline_id` int(11) NOT NULL,
  `parameter_id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `process_name` varchar(256) NOT NULL,
  `type` varchar(10) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `pipeline_process_parameter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `process_id` (`process_id`),
  ADD KEY `pipeline_id` (`pipeline_id`),
  ADD KEY `parameter_id` (`parameter_id`);
  

  
ALTER TABLE `pipeline_process_parameter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
  
  
ALTER TABLE `pipeline_process_parameter`
  ADD CONSTRAINT `pipeline_process_parameter_ibfk_1` FOREIGN KEY (`process_id`) REFERENCES `process` (`id`),
  ADD CONSTRAINT `pipeline_process_parameter_ibfk_2` FOREIGN KEY (`pipeline_id`) REFERENCES `pipeline` (`id`),
  ADD CONSTRAINT `pipeline_process_parameter_ibfk_3` FOREIGN KEY (`parameter_id`) REFERENCES `parameter` (`id`);