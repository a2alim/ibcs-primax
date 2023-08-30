package com.ibcs.idsdp.rpm.model.repositories;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalInstituteInfo;

@Repository
public interface ResearcherProposalInstituteInfoRepository extends ServiceRepository<ResearcherProposalInstituteInfo>{	
	
	ResearcherProposalInstituteInfo findByResearcherProposalId(Long researcherProposalId);

}
