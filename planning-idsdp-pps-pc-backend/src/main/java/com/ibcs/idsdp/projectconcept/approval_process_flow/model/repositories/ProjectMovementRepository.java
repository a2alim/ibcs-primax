package com.ibcs.idsdp.projectconcept.approval_process_flow.model.repositories;

import com.ibcs.idsdp.projectconcept.approval_process_flow.model.domain.ProjectMovementStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectMovementRepository extends JpaRepository<ProjectMovementStage, Long> {
    List<ProjectMovementStage> findByDppMasterIdOrderByMovementTimeDesc(Long dppMasterId);

    List<ProjectMovementStage> findByTappMasterIdOrderByMovementTimeDesc(Long dppMasterId);

    List<ProjectMovementStage> findByProjectConceptMasterIdOrderByMovementTimeDesc(Long projectConceptMasterId);

    List<ProjectMovementStage> findByFsProposalMasterIdOrderByMovementTimeDesc(Long fsProposalMasterId);
}
