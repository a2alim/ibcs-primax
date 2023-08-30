package com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.response;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.MovementStageEnum;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class RemainingTimeConditionResponse {
    private MovementStageEnum currentStage;
    private LocalDateTime movementTime;
    private boolean isEnableWarningTimer;
    private LocalDateTime currentTime;

}
