package com.ibcs.idsdp.rpm.model.domain.notApplicable;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "not_applicable_forms")
public class NotApplicableForms extends BaseEntity {

    private Long m1ResearcherProfilePersonalInfoId;

    @Column(length = 2)
    private String publicationInfo;

    @Column(length = 2)
    private String proExperience;

    @Column(length = 2)
    private String researchExp;

    @Column(length = 2)
    private String trainingInfo;

    @Column(length = 20)
    private String modelName;

    @Column(length = 20)
    private String formName;
}
