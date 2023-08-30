package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.EvaluatorNewMemberAttendance;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;

public interface EvaluatorNewMemberAttendanceRepository extends ServiceRepository<EvaluatorNewMemberAttendance>{	
	
	List<EvaluatorNewMemberAttendance> findAllByResearcherProposalAndIsDeleted(ResearcherProposal researcherProposal,Boolean isDeleted);
	List<EvaluatorNewMemberAttendance> findAllByResearcherPresentationIdAndIsDeleted(Long researcherPresentationId,	Boolean isDeleted);		
	

}
