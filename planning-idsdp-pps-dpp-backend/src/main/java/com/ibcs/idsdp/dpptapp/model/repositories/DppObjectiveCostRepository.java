package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.domain.TappObjectiveCost;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface DppObjectiveCostRepository extends ServiceRepository<DppObjectiveCost> {
    List<DppObjectiveCost> findAllByStatus(Boolean status);

    Optional<DppObjectiveCost> findByProjectConceptUuidAndIsDeleted(String pcuuid, boolean status);

    DppObjectiveCost findByProjectConceptUuid(String pcUuid);

    Optional<DppObjectiveCost> findByProjectConceptMasterIdAndProjectConceptUuidAndIsDeleted(Long pcId, String pcuuid, boolean status);

    Optional<DppObjectiveCost> findByProjectConceptMasterIdAndIsDeleted(Long pcId, boolean status);

//    @Query(value = "select dm.date_commencement from dpp_master dm " +
//            "where dm.is_deleted = false " +
//            "and dm.project_concept_uuid = :pcuuid", nativeQuery = true)
//    LocalDate getDateCommencementByProjectConceptUuid(String pcuuid);
//
//    @Query(value = "select dm.date_completion from dpp_master dm " +
//            "where dm.is_deleted = false " +
//            "and dm.project_concept_uuid = :pcuuid", nativeQuery = true)
//    LocalDate getDateCompletionByProjectConceptUuid(String pcuuid);

    List<DppObjectiveCost> findByProjectConceptMasterId(Long pcId);

    List<DppObjectiveCost> findByProjectConceptMasterIdIn(Set<Long> ids);

    Optional<DppObjectiveCost> findByPpsCodeAndIsDeleted(String ppsCode, Boolean isDeleted);

    @Query(value = "select dm.* from dpp_master dm " +
            "join project_concept_master pcm " +
            "on dm.project_concept_master_id = pcm.id " +
            "where dm.id = :id " +
            "and pcm.agency_id = :agencyId " +
            "and dm.is_deleted = :isDeleted", nativeQuery = true)
    Optional<DppObjectiveCost> findByIdAndAgencyIdAndIsDeleted(Long id, Long agencyId, Boolean isDeleted);
}
