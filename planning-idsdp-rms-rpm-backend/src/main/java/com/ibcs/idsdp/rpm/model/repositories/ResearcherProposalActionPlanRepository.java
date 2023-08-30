package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalActionPlan;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResearcherProposalActionPlanRepository extends ServiceRepository<ResearcherProposalActionPlan>{

    List<ResearcherProposalActionPlan> findAllByResearcherProposalIdAndIsDeletedOrderByCatWiseActPlanIdAsc(Long researcherProposalId, Boolean isDeleted);

}
