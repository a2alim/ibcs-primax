package com.ibcs.idsdp.rpm.model.repositories;

import org.springframework.stereotype.Repository;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearcherSupervisorInfo;

@Repository
public interface ResearcherSupervisorInfoRepository extends ServiceRepository<ResearcherSupervisorInfo>{

    ResearcherSupervisorInfo findByResearcherProposalIdAndIsDeleted(Long researcherProposalId, Boolean isDeleted);
}
