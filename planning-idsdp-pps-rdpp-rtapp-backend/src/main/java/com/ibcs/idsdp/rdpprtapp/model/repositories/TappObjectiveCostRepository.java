package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappObjectiveCost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface TappObjectiveCostRepository extends ServiceRepository<TappObjectiveCost> {
    List<TappObjectiveCost> findAllByStatus(Boolean status);

    TappObjectiveCost findByProjectConceptUuid(Long pcUuid);

    Optional<TappObjectiveCost> findByProjectConceptUuidAndIsDeleted(String pcUuid, Boolean isDelete);

    Optional<TappObjectiveCost> findByIdAndIsDeleted(Long id, Boolean isDelete);

    Optional<TappObjectiveCost> findByProjectConceptUuidAndIdAndIsDeleted(String pcUuid, Long id, Boolean isDelete);

    Optional<TappObjectiveCost> findByProjectConceptMasterIdAndProjectConceptUuidAndIsDeleted(Long pcId, String pcUuid, boolean status);

    Optional<TappObjectiveCost> findByUuidAndIsDeleted(String uuid, Boolean isDelete);


    @Modifying
    @Transactional
    @Query(value = "Delete from tapp_currency_rates where tapp_master_id is NULL", nativeQuery = true)
    void deleteTappCurrencyRates();

    @Modifying
    @Transactional
    @Query(value = "Select count(tapp_master_id) total from tapp_currency_rates where tapp_master_id = ?1", nativeQuery = true)
    void countCurrecy(Long tappMsId);

    List<TappObjectiveCost> findByProjectConceptMasterId(Long pcId);

    List<TappObjectiveCost> findByProjectConceptMasterIdIn(List<Long> ids);

    Page<TappObjectiveCost> findAllByStatusAndIsDeletedOrderByIdDesc(Boolean status, Boolean isDelete, Pageable pageable);

    Optional<TappObjectiveCost> findByReferenceIdAndIsDeleted(Long referenceId, Boolean isDeleted);

    @Query(value = "select roc.* from rtapp_objective_cost roc " +
            "join project_concept_master pcm " +
            "on roc.project_concept_master_id = pcm.id " +
            "where roc.reference_id = :referenceId " +
            "and pcm.agency_id = :agencyId " +
            "and roc.is_deleted = :isDeleted", nativeQuery = true)
    Optional<TappObjectiveCost> findByReferenceIdAndAgencyIdAndIsDeleted(Long referenceId, Long agencyId, Boolean isDeleted);

    List<TappObjectiveCost> findAllByProjectConceptMasterIdAndIsDeleted(Long referenceId, Boolean isDeleted);

    Optional<TappObjectiveCost> findByReferenceUuidAndIsDeleted(String referenceUuid, Boolean isDeleted);

    Page<TappObjectiveCost> findAllByImplementingAgencyInAndStatusAndIsDeletedOrderByIdDesc(List implementingAgency, Boolean status, Boolean isDelete, Pageable pageable);
//    Page<TappObjectiveCost> findAllByImplementingAgencyAndStatusAndIsDeletedOrderByIdDesc(String implementingAgency, Boolean status, Boolean isDelete, Pageable pageable);

    Page<TappObjectiveCost> findAllByMinistryDivisionInAndStatusAndIsDeletedOrderByIdDesc(List ministryDivision, Boolean status, Boolean isDelete,Pageable pageable);
//    Page<TappObjectiveCost> findAllByMinistryDivisionAndStatusAndIsDeletedOrderByIdDesc(String ministryDivision, Boolean status, Boolean isDelete,Pageable pageable);

    Page<TappObjectiveCost> findAllByConcernedDivisionIdAndStatusAndIsDeletedOrderByIdDesc(Long ministryDivision, Boolean status, Boolean isDelete,Pageable pageable);

    @Query(value = "select * from rtapp_objective_cost rm " +
            "where rm.id in (" +
            "select rtapp_master_id from project_movement_stage pms " +
            "where pms.rtapp_master_id is not null " +
            "and pms.current_stage in (:currentStage))", nativeQuery = true)
    Page<TappObjectiveCost> getRdppObjectiveCosByCurrentStage(List<Integer> currentStage, Pageable pageable);

    List<TappObjectiveCost> findAllByProjectConceptUuidAndIsDeletedOrderByIdDesc(String pcUuid, Boolean isDeleted);

    List<TappObjectiveCost> findAllByProjectConceptMasterIdAndIsDeletedOrderById(Long pcId, boolean status);

    List<TappObjectiveCost> findAllByProjectConceptUuidAndIsDeletedOrderByIdAsc(String pcUuid, boolean isDelete);

    @Query(value = "select distinct roc.* from rtapp_objective_cost roc \n" +
            "inner join project_movement_stage pms on pms.rtapp_master_id = roc.id\n" +
            "and pms.current_stage in (7, 9, 10)\n" +
            "and roc.pps_code is not null\n" +
            "and roc.is_ecnec_acknowledgement is not true\n" +
            "and roc.is_deleted = false\n" +
            "order by roc.id desc", nativeQuery = true)
    List<TappObjectiveCost> findAllApprovedRtppAndIsDeleted();

    @Query(value = "select distinct roc.* from rtapp_objective_cost roc \n" +
            "inner join project_movement_stage pms on pms.rtapp_master_id = roc.id\n" +
            "and pms.current_stage not in (7, 9, 10)\n" +
            "and roc.pps_code is not null\n" +
            "and roc.is_deleted = false\n" +
            "order by roc.id desc", nativeQuery = true)
    List<TappObjectiveCost> findAllNotApprovedRtppAndIsDeleted();

    TappObjectiveCost findByPpsCodeAndIsDeleted(String ppsCode, Boolean isDeleted);
}
