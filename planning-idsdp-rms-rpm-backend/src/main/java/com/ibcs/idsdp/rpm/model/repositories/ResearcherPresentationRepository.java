package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.ResearcherPresentation;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;

@Repository
public interface ResearcherPresentationRepository extends ServiceRepository<ResearcherPresentation>{	
	
	Optional<ResearcherPresentation> findByResearcherProposalIdAndIsDeleted(ResearcherProposal m1ResearcherProposalId , Boolean isDeleted);
	
	List<ResearcherPresentation> findAllByResearcherProposalIdAndIsDeleted(Long researcherProposal , Boolean isDeleted);

	Optional<ResearcherPresentation> findByCreateSeminarIdAndIsDeleted(Long createSeminarId , Boolean isDeleted);	
	
	List<ResearcherPresentation>findAllByCreateSeminarAndIsDeleted(CreateSeminar createSeminar,Boolean isDeleted);

}
