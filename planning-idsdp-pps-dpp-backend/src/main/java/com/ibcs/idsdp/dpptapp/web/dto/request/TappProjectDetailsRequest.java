package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class TappProjectDetailsRequest extends UuidHolderRequestBodyDTO {

    private Long pcMasterId;
    private String pcUuid;
    private String situationAnalysis;
    private String objectives;
    private String specificDetails;
    private String visionMission;
    private String projectContribute;
    private String implementationArrangements;
    private String expectedOutputOutcome;
    private String monitoringEvaluationReporting;
    private String visionMissionOfAgency;
    private String implementationFramework;
    private String expectedOutputOutcomeDescription;
    private String interimMidtermAssessment;
    private String legalContext;
}
