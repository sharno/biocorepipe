CREATE DATABASE IF NOT EXISTS biocorepipe;
USE biocorepipe;
--
-- Database: `biocorepipe`
--

-- --------------------------------------------------------

--
-- Table structure for table `parameter`
--

CREATE TABLE `parameter` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `channel_name` varchar(256) DEFAULT NULL,
  `file_type` varchar(256) DEFAULT NULL,
  `file_path` varchar(256) DEFAULT NULL,
  `version` varchar(256) DEFAULT NULL,
  `qualifier` varchar(256) DEFAULT NULL,
  `input_text` text,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `parameter`
--

INSERT INTO `parameter` (`id`, `name`, `channel_name`, `file_type`, `file_path`, `version`, `qualifier`, `input_text`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(9, 'genome', 'genome_file', 'fasta', '\"$baseDir/data/ggal/ggal_1_48850000_49020000.Ggal71.500bpflank.fa\"', '1', 'file', '', '2017-04-23 22:07:04', '2017-04-23 22:07:04', 'docker'),
(10, 'genome_index', 'genome_index', 'index', '', '1', 'file', '', '2017-04-23 22:10:53', '2017-04-23 22:10:53', 'docker'),
(11, 'read_pairs', 'read_pairs', 'fq', '\"$baseDir/data/ggal/*_{1,2}.fq\"', '1', 'set', '', '2017-04-23 22:13:42', '2017-04-23 22:13:42', 'docker'),
(13, 'mapped_read_pairs', 'bam_files', 'bam', '', '1', 'set', '', '2017-04-23 22:31:59', '2017-04-23 22:31:59', 'docker'),
(14, 'transcripts', 'transcripts', '', '', '1', 'set', '', '2017-04-23 22:34:26', '2017-04-23 22:34:26', 'docker');

-- --------------------------------------------------------

--
-- Table structure for table `pipeline`
--

CREATE TABLE `pipeline` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `version` varchar(256) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pipeline`
--

INSERT INTO `pipeline` (`id`, `name`, `version`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(11, 'RNA-Seq', '1', '2017-04-23 22:53:15', '2017-04-23 22:53:15', 'docker'),
(12, 'Pipeline 1', '1', '2017-04-24 14:31:41', '2017-04-24 14:31:41', 'docker'),
(14, 'Pipeline 2', '1', '2017-04-24 14:52:46', '2017-04-24 14:52:46', 'docker');

-- --------------------------------------------------------

--
-- Table structure for table `pipeline_process`
--

CREATE TABLE `pipeline_process` (
  `id` int(11) NOT NULL,
  `process_id` int(11) NOT NULL,
  `pipeline_id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pipeline_process`
--

INSERT INTO `pipeline_process` (`id`, `process_id`, `pipeline_id`, `name`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(14, 10, 11, 'buildIndex', '2017-04-23 22:53:47', '2017-04-23 22:53:47', 'docker'),
(15, 11, 11, 'mapping', '2017-04-23 22:54:16', '2017-04-23 22:54:16', 'docker'),
(24, 12, 11, 'makeTranscript', '2017-04-23 23:19:13', '2017-04-23 23:19:13', 'docker');

-- --------------------------------------------------------

--
-- Table structure for table `process`
--

CREATE TABLE `process` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `version` varchar(256) DEFAULT NULL,
  `script` text,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `process`
--

INSERT INTO `process` (`id`, `name`, `version`, `script`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(10, 'Build Index', '1', 'bowtie2-build ${genome} genome.index', '2017-04-23 22:36:16', '2017-04-23 22:36:16', 'docker'),
(11, 'Map', '1', 'tophat2 genome.index ${reads}', '2017-04-23 22:37:23', '2017-04-23 22:37:23', 'docker'),
(12, 'Make Transcript', '1', 'cufflinks ${bam_file}', '2017-04-23 22:38:04', '2017-04-23 22:38:04', 'docker');

-- --------------------------------------------------------

--
-- Table structure for table `process_parameter`
--

CREATE TABLE `process_parameter` (
  `id` int(11) NOT NULL,
  `process_id` int(11) NOT NULL,
  `parameter_id` int(11) NOT NULL,
  `type` varchar(10) NOT NULL,
  `name` varchar(256) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `process_parameter`
--

INSERT INTO `process_parameter` (`id`, `process_id`, `parameter_id`, `type`, `name`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(19, 10, 9, 'input', 'genome', '2017-04-23 22:39:12', '2017-04-23 22:39:12', 'docker'),
(20, 10, 10, 'output', '\'genome.index*\'', '2017-04-23 22:39:53', '2017-04-23 22:39:53', 'docker'),
(21, 11, 9, 'input', 'genome', '2017-04-23 22:40:57', '2017-04-23 22:40:57', 'docker'),
(22, 11, 10, 'input', 'index', '2017-04-23 22:41:37', '2017-04-23 22:41:37', 'docker'),
(23, 11, 11, 'input', 'file(reads)', '2017-04-23 22:42:54', '2017-04-23 22:42:54', 'docker'),
(24, 11, 13, 'output', '\"tophat_out/accepted_hits.bam\"', '2017-04-23 22:47:36', '2017-04-23 22:47:36', 'docker'),
(25, 12, 13, 'input', 'bam_file', '2017-04-23 22:49:05', '2017-04-23 22:49:05', 'docker'),
(26, 12, 14, 'output', '\'transcripts.gtf\'', '2017-04-23 22:49:39', '2017-04-23 22:49:39', 'docker');


CREATE TABLE `process_parameternew` (
  `id` int(11) NOT NULL,
  `process_id` int(11) NOT NULL,
  `parameter_id` int(11) NOT NULL,
  `type` varchar(10) NOT NULL,
  `name` varchar(256) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;






--
-- Indexes for dumped tables
--

--
-- Indexes for table `parameter`
--
ALTER TABLE `parameter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pipeline`
--
ALTER TABLE `pipeline`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pipeline_process`
--
ALTER TABLE `pipeline_process`
  ADD PRIMARY KEY (`id`),
  ADD KEY `process_id` (`process_id`),
  ADD KEY `pipeline_id` (`pipeline_id`);

--
-- Indexes for table `process`
--
ALTER TABLE `process`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `process_parameter`
--
ALTER TABLE `process_parameter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `process_id` (`process_id`),
  ADD KEY `parameter_id` (`parameter_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `parameter`
--
ALTER TABLE `parameter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `pipeline`
--
ALTER TABLE `pipeline`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `pipeline_process`
--
ALTER TABLE `pipeline_process`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `process`
--
ALTER TABLE `process`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `process_parameter`
--
ALTER TABLE `process_parameter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `pipeline_process`
--
ALTER TABLE `pipeline_process`
  ADD CONSTRAINT `pipeline_process_ibfk_1` FOREIGN KEY (`process_id`) REFERENCES `process` (`id`),
  ADD CONSTRAINT `pipeline_process_ibfk_2` FOREIGN KEY (`pipeline_id`) REFERENCES `pipeline` (`id`);

--
-- Constraints for table `process_parameter`
--
ALTER TABLE `process_parameter`
  ADD CONSTRAINT `process_parameter_ibfk_1` FOREIGN KEY (`process_id`) REFERENCES `process` (`id`),
  ADD CONSTRAINT `process_parameter_ibfk_2` FOREIGN KEY (`parameter_id`) REFERENCES `parameter` (`id`);
