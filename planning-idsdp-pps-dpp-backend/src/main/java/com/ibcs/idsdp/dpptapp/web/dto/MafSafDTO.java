package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
public class MafSafDTO extends UuidIdHolderRequestBodyDTO {
    @NotNull
    private String type;
    @NotNull
    private Long projectConceptId;
    @NotNull
    private String projectConceptUuid;
    @NotNull
    private Boolean isIncludedInAdpRadp;
    private Boolean isMinisterApprovedNewProject;
    private Date approvalDate;
    @NotNull
    private Boolean isProjectLandRequired;
    private String projectLandDescription;
    @NotNull
    private Boolean isProjectFeasibilityStudyRequired;
    private String projectFeasibilityStudyRequiredDescription;
    @NotNull
    private Boolean isProjectFeasibilityStudyDone;
    private String projectFeasibilityStudyDoneDescription;
    private String projectFeasibilityStudyAttachId;
    @NotNull
    private Boolean isEnvironmentalClearance;
    private String environmentalClearanceDescription;
    private String environmentalImpactWiseProjectCategory;
    @NotNull
    private Boolean isLocatedInECA;
    private String locatedInEcaDescription;
    @NotNull
    private Boolean isEIA;
    private String eiaDescription;
    @NotNull
    private Boolean isPppNeeded;
    private String pppDescription;
    private String relevanceWithProgram;
    private String relevanceOfTheProposal;
    private String institutionalArrangement;
    private String relevanceWithOtherDevelopmentProgrammes;
    private String expectedSocioEconomicBenefits;
    @NotNull
    private Boolean isFinancialEconomicAnalysis;
    private String financialEconomicAnalysisDescription;
    private String financialEconomicAnalysisAttachId;
    @NotNull
    private Boolean isCompensationOrRehabilitationNeeded;
    private String compensationOrRehabilitationDescription;
    @NotNull
    private Boolean isManpowerApproved;
    private String manpowerApprovedAttachId;
    private String sustainabilityOfTheProjectBenefit;
}
