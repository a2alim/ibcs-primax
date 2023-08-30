package com.ibcs.idsdp.rpm.model.repositories;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalKeyWord;

@Repository
public interface ResearcherProposalKeyWordRepository extends ServiceRepository<ResearcherProposalKeyWord> {	
	
	@Transactional
	@Modifying
	@Query(value="delete from researcher_proposal_key_word where researcher_proposal_id = :researcherProposalId",nativeQuery = true)
	void deleteByResearcherProposalId(Long researcherProposalId);
	
	
}
