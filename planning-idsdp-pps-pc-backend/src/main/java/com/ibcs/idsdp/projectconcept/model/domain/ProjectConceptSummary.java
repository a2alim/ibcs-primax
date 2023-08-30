package com.ibcs.idsdp.projectconcept.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "project_concept_summary")
@EntityListeners(AuditingEntityListener.class)
public class ProjectConceptSummary extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "project_concept_master_id", unique = true)
    private ProjectConceptMaster projectConceptMaster;

    private long catEnvRulesId;

    private Boolean isEcaRequired;

    @Column(length = 1000)
    private String descriptionEca;

    private Long ecaAttachmentId;

    private Boolean isEiaRequired;

    @Column(length = 1000)
    private String descriptionEia;

    private Long eiaAttachmentId;

    private Boolean isLandRequired;

    @Column(length = 1000)
    private String descriptionLand;

    private Long landAttachmentId;

    private Boolean isFeasibilityRequired;

    @Column(length = 1000)
    private String descriptionFs;

    private Long fsAttachmentId;

    private Boolean isPppRequired;

    @Column(length = 1000)
    private String descriptionPpp;

    private Long pppAttachmentId;

    @Column(columnDefinition = "TEXT")
    private String relevanceWithShortProgram;

    private Long relevanceWithShortProgramAttachmentId;

    @Column(columnDefinition = "TEXT")
    private String relevanceWithProposal;

    private Long relevanceWithProposalAttachmentId;

    @Column(columnDefinition = "TEXT")
    private String institutionalArrangement;

    private Long institutionalArrangementAttachmentId;

    @Column(columnDefinition = "TEXT")
    private String relevanceWithOtherDevelopment;

    private Long relevanceWithOtherDevelopmentAttachmentId;

    @Column(columnDefinition = "TEXT")
    private String expectedBenefits;

    private Long expectedBenefitsAttachmentId;
}
