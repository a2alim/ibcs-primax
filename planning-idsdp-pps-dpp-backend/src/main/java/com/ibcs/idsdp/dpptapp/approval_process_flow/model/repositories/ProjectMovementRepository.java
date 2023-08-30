package com.ibcs.idsdp.dpptapp.approval_process_flow.model.repositories;

import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementStage;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ProjectMovementRepository extends JpaRepository<ProjectMovementStage, Long> {
    List<ProjectMovementStage> findByDppMasterIdOrderByMovementTimeDesc(Long dppMasterId);

    List<ProjectMovementStage> findByTappMasterIdOrderByMovementTimeDesc(Long dppMasterId);

    List<ProjectMovementStage> findByProjectConceptMasterIdOrderByMovementTimeDesc(Long projectConceptMasterId);

    List<ProjectMovementStage> findByFsProposalMasterIdOrderByMovementTimeDesc(Long projectConceptMasterId);

    List<ProjectMovementStage> findByRdppMasterIdOrderByMovementTimeDesc(Long rdppMasterId);

    List<ProjectMovementStage> findByRtappMasterIdOrderByMovementTimeDesc(Long rtappMasterId);

    List<ProjectMovementStage> findByUserId(Long userId);

    List<ProjectMovementStage> findByCurrentStageAndProjectConceptMasterIdIsNotNull(MovementStageEnum stage);

    List<ProjectMovementStage> findAllByCurrentStageInAndIsDeleted(List<MovementStageEnum> stages, Boolean isDeleted);

    @Query(value = "select count(distinct(pms.current_stage, pms.dpp_master_id)) from project_movement_stage pms where pms.current_stage = :stage and pms.dpp_master_id in (:ids)", nativeQuery = true)
    int findDistinctByCurrentStageAndDppMasterIdIn(int stage, Set<Long> ids);
    List<ProjectMovementStage> findByDppMasterId(Long id);

    boolean existsByDppMasterIdAndCurrentStageNotIn(Long id, List<MovementStageEnum> stages);

    @Query(value = "select count(distinct(pms.current_stage, pms.tapp_master_id)) from project_movement_stage pms where pms.current_stage = :stage and pms.tapp_master_id in (:ids)", nativeQuery = true)
    int findDistinctByCurrentStageAndTappMasterIdIn(int stage, Set<Long> ids);

    boolean existsByTappMasterIdAndCurrentStageNotIn(Long id, List<MovementStageEnum> stages);

    List<ProjectMovementStage> findByProjectConceptMasterIdAndCurrentStageOrderByMovementTimeDesc(Long projectConceptMasterId, MovementStageEnum movementStage);
    List<ProjectMovementStage> findByFsProposalMasterIdAndCurrentStageOrderByMovementTimeDesc(Long fsProposalMasterId, MovementStageEnum movementStage);
    List<ProjectMovementStage> findByDppMasterIdAndCurrentStageOrderByMovementTimeDesc(Long dppMasterId, MovementStageEnum movementStage);
    List<ProjectMovementStage> findByTappMasterIdAndCurrentStageOrderByMovementTimeDesc(Long tappMasterId, MovementStageEnum movementStage);
    List<ProjectMovementStage> findByRdppMasterIdAndCurrentStageOrderByMovementTimeDesc(Long rdppMasterId, MovementStageEnum movementStage);
    List<ProjectMovementStage> findByRtappMasterIdAndCurrentStageOrderByMovementTimeDesc(Long rtappMasterId, MovementStageEnum movementStage);

    List<ProjectMovementStage> findAllByDppMasterIdAndCurrentStage(Long dppMasterId, MovementStageEnum movementStage);

}
