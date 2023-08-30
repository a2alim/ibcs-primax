package com.ibcs.idsdp.feasibilitystudy.approval_process_flow.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Entity;
import java.time.LocalDateTime;

@Data
@Entity
public class ProjectMovementStage extends BaseEntity {

    private Long projectConceptMasterId;

    private MovementStageEnum currentStage;

    private LocalDateTime movementTime;

    private Long dppMasterId;

    private Long tappMasterId;

    private Long fsProposalMasterId;

    private Long userId;

}
