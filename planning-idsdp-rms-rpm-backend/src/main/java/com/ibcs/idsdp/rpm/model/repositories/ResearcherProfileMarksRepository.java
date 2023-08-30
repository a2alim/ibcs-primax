package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.enums.ResearcherProfileMarksCategory;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfileMarks;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ResearcherProfileMarksRepository extends ServiceRepository<ResearcherProfileMarks> {

    ResearcherProfileMarks findByResearcherProposalIdAndStResearchCatTypeIdAndIsDeleted(Long researcherProposalId, Long category, Boolean isDeleted);
    boolean existsByResearcherProposalIdAndIsDeleted(Long researcherProposalId, Boolean isDeleted);
    ResearcherProfileMarks findByResearcherProposalIdAndIsDeleted(Long researcherProposalId, Boolean isDeleted);

}
