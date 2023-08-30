package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "m1_researcher_profile_relative_info")
public class RelativeInfo extends BaseEntity {

    @Column(nullable = false, length = 20)
   private long profilePersonalInfoId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column( length = 255)
    private  String email;

    @Column(nullable = false, length = 255)
    private String phoneNo;

    @Column( length = 255)
    private String presentAddress;

    @Column(nullable = false, length = 255)
    private String permanentAddress;

    @Column(nullable = false, length = 255)
    private String nid;

    private boolean isEditable;

}
