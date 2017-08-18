<?php

class Parameter extends BaseEntity {
    
    private $name;
    private $channelName;
    private $fileType;
    private $filePath;
    private $version;
    private $qualifier;
    private $inputText;
    
    public function getName() {
        return $this->name;
    }

    public function getChannelName() {
        return $this->channelName;
    }

    public function getFileType() {
        return $this->fileType;
    }

    public function getFilePath() {
        return $this->filePath;
    }

    public function getVersion() {
        return $this->version;
    }

    public function getQualifier() {
        return $this->qualifier;
    }

    public function getInputText() {
        return $this->inputText;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function setChannelName($channelName) {
        $this->channelName = $channelName;
    }

    public function setFileType($fileType) {
        $this->fileType = $fileType;
    }

    public function setFilePath($filePath) {
        $this->filePath = $filePath;
    }

    public function setVersion($version) {
        $this->version = $version;
    }

    public function setQualifier($qualifier) {
        $this->qualifier = $qualifier;
    }

    public function setInputText($inputText) {
        $this->inputText = $inputText;
    }


}