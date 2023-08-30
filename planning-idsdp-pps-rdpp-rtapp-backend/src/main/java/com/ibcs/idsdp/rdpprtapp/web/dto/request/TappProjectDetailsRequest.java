package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

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
    private String legalContext;
}
