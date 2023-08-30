package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.MovementStageEnum;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProjectMovementStageDTO {
    private Long id;
    private String uuid;
    private Long projectConceptMasterId;
    private Long fsProposalMasterId;
    private MovementStageEnum currentStage;
    private MovementStageEnum previousStage;
    private LocalDateTime movementTime;
    private Long dppMasterId;
    private Long tappMasterId;
    private Long rdppMasterId;
    private Long rtappMasterId;
    private Long userId;
}
