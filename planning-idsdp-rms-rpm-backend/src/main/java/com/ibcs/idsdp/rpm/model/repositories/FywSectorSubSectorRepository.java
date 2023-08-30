package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.FywSectorSubSector;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import javax.persistence.QueryHint;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FywSectorSubSectorRepository extends ServiceRepository<FywSectorSubSector> {

    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
    long countByStFiscalYearIdAndLetterForAndIsDeleted(Long fiscalYearId, String letterFor, Boolean isDelete);

    //Optional<FywSectorSubSector> findByTypeNameAndForTypeAndIsDeleted(String typeName, String forType, Boolean isDelete);

    List<FywSectorSubSector> findAllByIsDeleted(Boolean isDelete);

    Optional<FywSectorSubSector> findByUuidAndIsDeleted(String uuid, Boolean isDelete);

    List<FywSectorSubSector> findAllByStFiscalYearIdAndIsDeleted(Long fiscalYearId, Boolean isDelete);


    @Transactional
    @Modifying
    @Query(value = "update fs_fiscal_year_wise_sector_sub_sectors  set is_active=? where letter_for='Final Copy' and  id<>?", nativeQuery = true)
    void inactiveAllPrevious(Boolean isActive, Long id);

    @Query(value = "select * from fs_fiscal_year_wise_sector_sub_sectors \n" +
            "where advertisement_start_date <=?\n" +
            "and advertisement_end_date >=?\n" +
            "and is_active =true \n" +
            "and letter_for ='Final Copy'\n" +
            "and is_deleted =false  ", nativeQuery = true)
    FywSectorSubSector isValid(LocalDate Date, LocalDate Date1);


    @Query(value = "select * from fs_fiscal_year_wise_sector_sub_sectors \n" +
            "where is_active =true \n" +
            "and letter_for ='Final Copy'\n" +
            "and is_deleted =false", nativeQuery = true)
    FywSectorSubSector getFiscalYearData();

    List<FywSectorSubSector> findAllByLetterForAndIsActiveAndIsDeleted(String letterFor, boolean isActive, boolean isDeleted);
}
