package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.EnothiApprovalFiles;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import javax.persistence.QueryHint;
import java.util.Optional;

@Repository
public interface EnothiApprovalFilesRepository extends ServiceRepository<EnothiApprovalFiles> {
    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
    long countByStFiscalYearIdAndStResearchCategoryTypeIdAndDataForAndIsDeleted(Long stFiscalYearid, Long stResearchCategoryTypeId, String dataFor, Boolean isDeleted);

    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
    long countByStFiscalYearIdAndM1ResearcherProposalUuidAndDataForAndIsDeleted(Long stFiscalYearid, String m1ResearcherProposalUuid, String dataFor, Boolean isDeleted);

    Optional<EnothiApprovalFiles> findByStFiscalYearIdAndIsDeleted(Long stFiscalYearId, Boolean isDeleted);
    //Optional<EnothiApprovalFiles> findByUuidAndIsDeleted(String uuid, Boolean isDelete);

    Page<EnothiApprovalFiles> findAllByDataForAndIsDeletedOrderByIdDesc(String dataFor, Boolean isDeleted, Pageable pageable);
    Page<EnothiApprovalFiles> findAllByStFiscalYearIdAndDataForAndIsDeletedOrderByIdDesc(Long stFiscalYearId, String dataFor, Boolean isDeleted, Pageable pageable);
    Page<EnothiApprovalFiles> findAllByStResearchCategoryTypeIdAndDataForAndIsDeletedOrderByIdDesc(Long stResearchCategoryTypeId, String dataFor, Boolean isDeleted, Pageable pageable);
    Page<EnothiApprovalFiles> findAllByStFiscalYearIdAndStResearchCategoryTypeIdAndDataForAndIsDeletedOrderByIdDesc(Long stFiscalYearId, Long stResearchCategoryTypeId, String dataFor, Boolean isDeleted, Pageable pageable );
}
