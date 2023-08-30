package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="dpp_effect_impacts")
public class EffectImpact extends BaseEntity {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    @Column(columnDefinition = "TEXT")
    private String otherProjectInstallations;
    @Column(columnDefinition = "TEXT")
    private String envSustainabilityLand;
    @Column(columnDefinition = "TEXT")
    private String futureDisasterManagement;
    @Column(columnDefinition = "TEXT")
    private String genderDisabilityGroups;
    @Column(columnDefinition = "TEXT")
    private String employment;
    @Column(columnDefinition = "TEXT")
    private String provertySituation;
    @Column(columnDefinition = "TEXT")
    private String organizationalArrangement;
    @Column(columnDefinition = "TEXT")
    private String institutionalProductivity;
    @Column(columnDefinition = "TEXT")
    private String regionalDisparity;
    @Column(columnDefinition = "TEXT")
    private String population;
    @Column(columnDefinition = "TEXT")
    private String environmentalProjectCategory;
    @Column(columnDefinition = "TEXT")
    private String whetherEnvironmentClearance;
    private Boolean envClearance;

    @OneToOne
    private Attachment envClearenceAttachmentId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_master_id")
    private DppObjectiveCost objectiveCost;
}
