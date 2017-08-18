<?php

class BaseEntity {
    
    private $id;
    private $dateCreated;
    private $dateModified;
    private $lastModifiedUser;
    
    public function getId() {
        return $this->id;
    }

    public function getDateCreated() {
        return $this->dateCreated;
    }

    public function getDateModified() {
        return $this->dateModified;
    }

    public function getLastModifiedUser() {
        return $this->lastModifiedUser;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function setDateCreated($dateCreated) {
        $this->dateCreated = $dateCreated;
    }

    public function setDateModified($dateModified) {
        $this->dateModified = $dateModified;
    }

    public function setLastModifiedUser($lastModifiedUser) {
        $this->lastModifiedUser = $lastModifiedUser;
    }
}
