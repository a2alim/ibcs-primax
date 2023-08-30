package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rtapp_project_details")
@EntityListeners(AuditingEntityListener.class)
public class TappProjectDetails extends BaseEntity {

    @Column(name = "project_concept_uuid")
    private String pcUuid;

    @Column(name = "project_concept_master_id")
    private Long pcMasterId;

    @Column(columnDefinition = "TEXT")
    private String situationAnalysis;

    @Column(columnDefinition = "TEXT")
    private String objectives;

    @Column(columnDefinition = "TEXT")
    private String specificDetails;

    @Column(columnDefinition = "TEXT")
    private String visionMission;

    @Column(columnDefinition = "TEXT")
    private String projectContribute;

    @Column(columnDefinition = "TEXT")
    private String implementationArrangements;

    @Column(columnDefinition = "TEXT")
    private String expectedOutputOutcome;

    @Column(columnDefinition = "TEXT")
    private String monitoringEvaluationReporting;

    @Column(columnDefinition = "TEXT")
    private String legalContext;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "rtapp_master_id")
    private TappObjectiveCost tappMasterId;
}
