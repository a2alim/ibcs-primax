package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.LinkupProposalWithEvaluators;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;

@Repository
public interface LinkupProposalWithEvaluatorsRepository extends ServiceRepository<LinkupProposalWithEvaluators>{
	
	
	List<LinkupProposalWithEvaluators> findAllByResearcherProposalInAndIsDeleted(Set<ResearcherProposal> researcherProposals, boolean isDeleted);
	Optional<LinkupProposalWithEvaluators> findByResearcherProposalAndIsDeleted(ResearcherProposal researcherProposals, boolean isDeleted);

}
