package com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.request;

import lombok.Data;

@Data
public class ProjectMovementStageRequest {
    private String currentStage;
    private Long dppMasterId;
    private Long tappMasterId;
    private Long rdppMasterId;
    private Long rtappMasterId;
    private Long projectConceptMasterId;
    private Long fsProposalMasterId;
    private Long userId;
}
