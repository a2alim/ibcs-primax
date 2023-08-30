package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfileRscWorkingInOrg;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalRscWorkingInOrg;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 */
@Repository
public interface ResearcherProfileRscWorkingInOrgRepository extends ServiceRepository<ResearcherProfileRscWorkingInOrg>{

	List<ResearcherProfileRscWorkingInOrg> findAllByResearcherProfileIdAndIsDeleted(ResearcherProfilePersonalInfoMaster researcherProposalId, Boolean isDeleted);
}
