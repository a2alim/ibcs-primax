package com.ibcs.idsdp.projectconcept.client.dto;

import com.ibcs.idsdp.projectconcept.approval_process_flow.model.domain.MovementStageEnum;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProjectMovementStageDTO {

    private Long projectConceptMasterId;

    private MovementStageEnum currentStage;

    private LocalDateTime movementTime;

    private Long dppMasterId;

    private Long tappMasterId;

    private Long userId;
}
