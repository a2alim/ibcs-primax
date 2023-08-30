package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
@Entity
@Table(name = "maf_saf")
@EntityListeners(AuditingEntityListener.class)
public class MafSaf extends BaseEntity {
    @NotNull
    private String type;
    @NotNull
    private Long projectConceptId;
    @NotNull
    private String projectConceptUuid;
    private Boolean isIncludedInAdpRadp;
    private Boolean isMinisterApprovedNewProject;
    private Date approvalDate;
    private Boolean isProjectLandRequired;
    @Column(columnDefinition = "TEXT")
    private String projectLandDescription;
    private Boolean isProjectFeasibilityStudyRequired;
    @Column(columnDefinition = "TEXT")
    private String projectFeasibilityStudyRequiredDescription;
    private Boolean isProjectFeasibilityStudyDone;
    @Column(columnDefinition = "TEXT")
    private String projectFeasibilityStudyDoneDescription;
    @Column(columnDefinition = "TEXT")
    private String projectFeasibilityStudyAttachId;
    private Boolean isEnvironmentalClearance;
    @Column(columnDefinition = "TEXT")
    private String environmentalClearanceDescription;
    @Column(columnDefinition = "TEXT")
    private String environmentalImpactWiseProjectCategory;
    private Boolean isLocatedInECA;
    @Column(columnDefinition = "TEXT")
    private String locatedInEcaDescription;
    private Boolean isEIA;
    @Column(columnDefinition = "TEXT")
    private String eiaDescription;
    private Boolean isPppNeeded;
    @Column(columnDefinition = "TEXT")
    private String pppDescription;
    @Column(columnDefinition = "TEXT")
    private String relevanceWithProgram;
    @Column(columnDefinition = "TEXT")
    private String relevanceOfTheProposal;
    @Column(columnDefinition = "TEXT")
    private String institutionalArrangement;
    @Column(columnDefinition = "TEXT")
    private String relevanceWithOtherDevelopmentProgrammes;
    @Column(columnDefinition = "TEXT")
    private String expectedSocioEconomicBenefits;
    private Boolean isFinancialEconomicAnalysis;
    @Column(columnDefinition = "TEXT")
    private String financialEconomicAnalysisDescription;
    @Column(columnDefinition = "TEXT")
    private String financialEconomicAnalysisAttachId;
    private Boolean isCompensationOrRehabilitationNeeded;
    @Column(columnDefinition = "TEXT")
    private String compensationOrRehabilitationDescription;
    private Boolean isManpowerApproved;
    @Column(columnDefinition = "TEXT")
    private String manpowerApprovedAttachId;
    @Column(columnDefinition = "TEXT")
    private String sustainabilityOfTheProjectBenefit;
}
