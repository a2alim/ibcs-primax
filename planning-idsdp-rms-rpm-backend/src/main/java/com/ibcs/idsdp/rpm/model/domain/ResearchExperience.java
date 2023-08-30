package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "m1_researcher_profile_research_exp")
public class ResearchExperience extends BaseEntity {
    @Column(nullable = false, length = 20)
    private  long profilePersonalInfoId;

    @Column(nullable = true, length = 255)
    private  String researchType;

    @Column(nullable = false, length = 255)
    private String researchTopic;

    @Column(nullable = false, length = 255)
    private String researchYear;

    @Column(length = 255)
    private String fundingOrganization;

    @Column(columnDefinition = "TEXT")
    private String supervisorDetail;

    @Column(nullable = false, length = 20)
    private String researchStatus;

    @Column(nullable = false)
    private String researchValueInBDT;

    @Column(columnDefinition = "TEXT")
    private String researchFindingAndImportance;

    @Column(nullable = false, length = 2)
    private Integer totalResearchExp;

    private Boolean isEditable;
    @Column(name="is_foreign")
    private Boolean isForeign;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private MinioAttachment fileUploadModel;

}
