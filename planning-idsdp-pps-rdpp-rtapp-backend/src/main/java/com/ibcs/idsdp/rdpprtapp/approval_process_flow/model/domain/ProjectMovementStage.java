package com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Entity;
import java.time.LocalDateTime;

@Data
@Entity
public class ProjectMovementStage extends BaseEntity {

    private Long projectConceptMasterId;

    private Long fsProposalMasterId;

    private MovementStageEnum currentStage;

    private LocalDateTime movementTime;

    private Long dppMasterId;

    private Long tappMasterId;

    private Long rdppMasterId;

    private Long rtappMasterId;

    private Long userId;

}
