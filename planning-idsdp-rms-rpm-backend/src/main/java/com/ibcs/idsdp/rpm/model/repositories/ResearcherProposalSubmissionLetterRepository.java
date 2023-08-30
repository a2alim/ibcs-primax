package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalSubmissionLetter;
import org.springframework.stereotype.Repository;

@Repository
public interface ResearcherProposalSubmissionLetterRepository extends ServiceRepository<ResearcherProposalSubmissionLetter>{

    ResearcherProposalSubmissionLetter findByResearcherProposalIdAndIsDeleted(Long researcherProposalId, Boolean isDeleted);
}
