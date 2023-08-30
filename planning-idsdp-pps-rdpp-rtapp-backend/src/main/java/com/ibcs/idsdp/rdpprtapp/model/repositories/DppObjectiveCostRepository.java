package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppObjectiveCost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DppObjectiveCostRepository extends ServiceRepository<DppObjectiveCost> {
    List<DppObjectiveCost> findAllByStatus(Boolean status);

    Page<DppObjectiveCost> findAllByImplementingAgencyInAndStatusAndIsDeletedOrderByIdDesc(List implementingAgency, Boolean status, Boolean isDelete,Pageable pageable);

    Page<DppObjectiveCost> findAllByImplementingAgencyAndStatusAndIsDeletedOrderByIdDesc(String implementingAgency, Boolean status, Boolean isDelete,Pageable pageable);

    Page<DppObjectiveCost> findAllByMinistryDivisionInAndStatusAndIsDeletedOrderByIdDesc(List ministryDivision, Boolean status, Boolean isDelete,Pageable pageable);

    Page<DppObjectiveCost> findAllByMinistryDivisionAndStatusAndIsDeletedOrderByIdDesc(String ministryDivision, Boolean status, Boolean isDelete,Pageable pageable);

    Page<DppObjectiveCost> findAllByConcernedDivisionIdAndStatusAndIsDeletedOrderByIdDesc(Long concernedDivisionId, Boolean status, Boolean isDelete,Pageable pageable);

    @Query(value = "select * from rdpp_master rm " +
            "where rm.id in (" +
            "select rdpp_master_id from project_movement_stage pms " +
            "where pms.rdpp_master_id is not null " +
            "and pms.current_stage in (:currentStage))", nativeQuery = true)
    Page<DppObjectiveCost> getRdppObjectiveCosByCurrentStage(List<Integer> currentStage, Pageable pageable);

    Page<DppObjectiveCost> findAllByStatusAndIsDeletedOrderByIdDesc(Boolean status, Boolean isDelete,Pageable pageable);

    Page<DppObjectiveCost> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    Optional<DppObjectiveCost> findByProjectConceptUuidAndIsDeleted(String pcuuid, boolean status);

    Optional<DppObjectiveCost> findByIdAndIsDeleted(Long id, Boolean isDeleted);

    Optional<DppObjectiveCost> findByProjectConceptUuidAndIdAndIsDeleted(String pcuuid, Long id, boolean status);

    DppObjectiveCost findByProjectConceptUuid(String pcUuid);

    List<DppObjectiveCost> findAllByProjectConceptMasterIdAndIsDeletedOrderById(Long pcId, boolean status);

    Optional<DppObjectiveCost> findByProjectConceptMasterIdAndProjectConceptUuidAndIsDeleted(Long pcId, String pcuuid, boolean status);

    Optional<DppObjectiveCost> findByProjectConceptMasterIdAndIsDeleted(Long pcId, boolean status);

    List<DppObjectiveCost> findByProjectConceptMasterId(Long pcId);

    List<DppObjectiveCost> findByProjectConceptMasterIdIn(List<Long> ids);


    List<DppObjectiveCost> findAllByProjectConceptMasterIdAndIsDeleted(Long pcId, boolean isDelete);
    List<DppObjectiveCost> findAllByProjectConceptUuidAndIsDeleted(String pcUuid, boolean isDelete);
    List<DppObjectiveCost> findAllByProjectConceptUuidAndIsDeletedOrderByIdAsc(String pcUuid, boolean isDelete);

    List<DppObjectiveCost> findAllByProjectConceptUuidAndIsDeletedOrderByIdDesc(String pcUuid, boolean isDelete);

    Optional<DppObjectiveCost> findByReferenceIdAndIsDeleted(Long referenceId, Boolean isDelete);

    @Query(value = "select rm.* from rdpp_master rm " +
            "join project_concept_master pcm " +
            "on rm.project_concept_master_id = pcm.id " +
            "where rm.reference_id = :referenceId " +
            "and pcm.agency_id = :agencyId " +
            "and rm.is_deleted = :isDeleted", nativeQuery = true)
    Optional<DppObjectiveCost> findByReferenceIdAndAgencyIdAndIsDeleted(Long referenceId, Long agencyId, Boolean isDeleted);

    Optional<DppObjectiveCost> findByReferenceUuidAndIsDeleted(String referenceUuid, Boolean isDelete);

    @Query(value = "select distinct rm.* from rdpp_master rm \n" +
            "inner join project_movement_stage pms on pms.rdpp_master_id = rm.id\n" +
            "and pms.current_stage in (7, 9, 10)\n" +
            "and rm.pps_code is not null\n" +
            "and rm.is_ecnec_acknowledgement is not true\n" +
            "and rm.is_deleted = false\n" +
            "order by rm.id desc", nativeQuery = true)
    List<DppObjectiveCost> findAllApprovedRdppAndIsDeleted();

    @Query(value = "select distinct rm.* from rdpp_master rm \n" +
            "inner join project_movement_stage pms on pms.rdpp_master_id = rm.id\n" +
            "and pms.current_stage not in (7, 9, 10)\n" +
            "and rm.pps_code is not null\n" +
            "and rm.is_deleted = false\n" +
            "order by rm.id desc", nativeQuery = true)
    List<DppObjectiveCost> findAllNotApprovedRdppAndIsDeleted();

    DppObjectiveCost findByPpsCodeAndIsDeleted(String ppsCode, Boolean isDeleted);
}
