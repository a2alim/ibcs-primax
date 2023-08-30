package com.ibcs.idsdp.model.domain;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@Entity
public class NothiUsers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nothiId;
    private String name;
    private String designation;
    private String section;
    private String mobileNumber;
    private String email;
    private Boolean isActive;
    private Boolean isDelete;
    private String ministry;
}
