package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.FywSectorSubSectorSection;
import org.springframework.data.jpa.repository.QueryHints;

import javax.persistence.QueryHint;
import java.util.List;

public interface FywSectorSubSectorSectionRepository extends ServiceRepository<FywSectorSubSectorSection> {

    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))

    List<FywSectorSubSectorSection> findAllByIsDeleted(Boolean isDelete);

    List<FywSectorSubSectorSection> findByStFiscalYearIdAndIsDeleted(Long fiscalYearId, Boolean isDelete);

    long countByStFiscalYearIdAndStSectorTypeIdAndIsDeleted(Long fiscalYearId, Long sectorTypeId, Boolean isDelete);

//    @Modifying
//    @Transactional
//    //@Query(value = "Delete from tapp_currency_rates where tapp_master_id is NULL", nativeQuery = true)
//    @Query(value = "SELECT sbs.id, sbs.sub_field_name as subFieldName from st_sub_sectors", nativeQuery = true)
//    List<SubSectorResponse> getSubSectorsList();
//
//    Query q = em.createNativeQuery("SELECT a.firstname, a.lastname FROM Author a");
//    List<Object[]> authors = q.getResultList();
}
