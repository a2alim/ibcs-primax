package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalMarks;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResearcherProposalMarksRepository extends ServiceRepository<ResearcherProposalMarks>{

    List<ResearcherProposalMarks> findAllByResearcherProposalIdAndIsDeleted(Long researcherProposalId, Boolean isDeleted);
    boolean existsByResearcherProposalIdAndIsDeleted(Long researcherProposalId, Boolean isDeleted);
    ResearcherProposalMarks findByResearcherProposalIdAndIsDeleted(Long researcherProposalId, Boolean isDeleted);

}
