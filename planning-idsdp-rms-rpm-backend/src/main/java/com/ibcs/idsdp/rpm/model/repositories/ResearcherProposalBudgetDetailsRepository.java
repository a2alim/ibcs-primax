package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalBudgetDetails;

import java.util.List;

public interface ResearcherProposalBudgetDetailsRepository extends ServiceRepository<ResearcherProposalBudgetDetails>{

    List<ResearcherProposalBudgetDetails> findAllByResearcherProposalIdAndIsDeleted(Long researcherProposalId, Boolean isDeleted);

}
