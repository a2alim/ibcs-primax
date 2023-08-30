package com.ibcs.idsdp.projectconcept.approval_process_flow.web.dto.request;

import lombok.Data;

@Data
public class ProjectMovementStageRequest {
    private String currentStage;
    private Long dppMasterId;
    private Long userId;
    private Long projectConceptMasterId;
}
