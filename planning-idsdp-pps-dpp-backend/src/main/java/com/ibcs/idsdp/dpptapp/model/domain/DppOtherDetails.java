package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "dpp_others_details")
public class DppOtherDetails extends BaseEntity {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    @Column(columnDefinition = "TEXT")
    private String specificationLinkagePerspective;
    @Column(columnDefinition = "TEXT")
    private String contributionProjectAchieving;
    @Column(columnDefinition = "TEXT")
    private String relationProjectAllocation;
    @Column(columnDefinition = "TEXT")
    private String whetherPrivateSector;
    @Column(columnDefinition = "TEXT")
    private String majorConditionalityForeignAid;
    @Column(columnDefinition = "TEXT")
    private String involvementCompensation;
    @Column(columnDefinition = "TEXT")
    private String riskAnalysisMitigation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_master_id")
    private DppObjectiveCost objectiveCost;

    private Boolean isPrivateSector;
}
