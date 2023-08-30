package com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.response;

import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.MovementStageEnum;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ProjectMovementStageResponse {
    private MovementStageEnum currentStage;
    private LocalDate movementDate;
    private LocalTime movementTime;
}
