package com.ibcs.idsdp.feasibilitystudy.approval_process_flow.model.repositories;

import com.ibcs.idsdp.feasibilitystudy.approval_process_flow.model.domain.ProjectMovementStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectMovementRepository extends JpaRepository<ProjectMovementStage, Long> {
    List<ProjectMovementStage> findByDppMasterIdOrderByMovementTimeDesc(Long dppMasterId);

    List<ProjectMovementStage> findByTappMasterIdOrderByMovementTimeDesc(Long dppMasterId);

    List<ProjectMovementStage> findByFsProposalMasterIdOrderByMovementTimeDesc(Long fsMasterId);
}
