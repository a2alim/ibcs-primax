package com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.repositories;

import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.ProjectMovementStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectMovementRepository extends JpaRepository<ProjectMovementStage, Long> {

    List<ProjectMovementStage> findByRdppMasterIdOrderByMovementTimeDesc(Long rdppMasterId);

    List<ProjectMovementStage> findByRtappMasterIdOrderByMovementTimeDesc(Long rdppMasterId);

    List<ProjectMovementStage> findByProjectConceptMasterIdOrderByMovementTimeDesc(Long projectConceptMasterId);

    List<ProjectMovementStage> findByFsProposalMasterIdOrderByMovementTimeDesc(Long projectConceptMasterId);

    List<ProjectMovementStage> findByUserId(Long userId);

    List<ProjectMovementStage> findByCurrentStageAndProjectConceptMasterIdIsNotNull(MovementStageEnum stage);
}
