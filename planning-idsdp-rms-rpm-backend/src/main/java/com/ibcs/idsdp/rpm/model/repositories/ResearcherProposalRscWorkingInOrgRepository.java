package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalRscWorkingInOrg;

@Repository
public interface ResearcherProposalRscWorkingInOrgRepository extends ServiceRepository<ResearcherProposalRscWorkingInOrg>{

	List<ResearcherProposalRscWorkingInOrg> findAllByResearcherProposalIdAndIsDeleted(Long researcherProposalId,Boolean isDeleted);
}
