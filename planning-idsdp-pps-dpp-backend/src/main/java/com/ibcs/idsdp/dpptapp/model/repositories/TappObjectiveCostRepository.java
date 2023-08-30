package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.TappObjectiveCost;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface TappObjectiveCostRepository extends ServiceRepository<TappObjectiveCost> {
    List<TappObjectiveCost> findAllByStatus(Boolean status);

    TappObjectiveCost findByProjectConceptUuid(String pcUuid);

    Optional<TappObjectiveCost> findByProjectConceptUuidAndIsDeleted(String pcUuid, Boolean isDelete);

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
    List<TappObjectiveCost> findByProjectConceptMasterIdIn(Set<Long> ids);

    Optional<TappObjectiveCost> findByPpsCodeAndIsDeleted(String ppsCode, Boolean isDeleted);

    @Query(value = "select toc.* from tapp_objective_cost toc " +
            "join project_concept_master pcm " +
            "on toc.project_concept_master_id = pcm.id " +
            "where toc.id = :id " +
            "and pcm.agency_id = :agencyId " +
            "and toc.is_deleted = :isDeleted", nativeQuery = true)
    Optional<TappObjectiveCost> findByIdAndAgencyIdAndIsDeleted(Long id, Long agencyId, Boolean isDeleted);
}
