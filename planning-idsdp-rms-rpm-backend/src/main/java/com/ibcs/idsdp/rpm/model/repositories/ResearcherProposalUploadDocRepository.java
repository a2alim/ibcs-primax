package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalActionPlan;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalUploadDoc;

@Repository
public interface ResearcherProposalUploadDocRepository extends ServiceRepository<ResearcherProposalUploadDoc> {

	List<ResearcherProposalUploadDoc> findAllByResearcherProposalIdAndIsDeleted(Long researcherProposalId,Boolean isDeleted);

}
