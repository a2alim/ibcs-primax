package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "m1_researcher_profile_professional_exp")
public class ProfessionalExperience extends BaseEntity {

    private long profilePersonalInfoId;

    private String organizationName;

    private String designation;

    private Integer isGovEmployee; // 1=Govt, 2=Private, 0=Other

    private Date fromDate;

    private Date toDate;

    private Boolean isContinue;

    @Column(columnDefinition = "TEXT")
    private String responsibilityDetail;

    private Boolean isEditable;

}
