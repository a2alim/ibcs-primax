package com.ibcs.idsdp.rpm.web.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class ResearcherProposalDetailsResponseDto {
	
	private ResearcherProposalResponseDto researcherProposal;
	private ResearcherProposalInfoResponseDto researcherProposalInfo;
	private ResearcherProposalInstituteInfoResponseDto researcherProposalInstituteInfo;
	private List<ResearcherProposalRscWorkingInOrgResponseDto> researcherProposalRscWorkingInOrg;
	private List<ResearcherProposalUploadDocResponseDto> researcherProposalUploadDoc;
	private ResearcherSupervisorInfoResponseDto researcherSupervisorInfo;
	private List<ResearcherProposalActionPlanResponseDto> researcherProposalActionPlan;
	private List<ResearcherProposalBudgetDetailsResponseDto> researcherProposalBudgetDetails;

	//added by Rakib for report
	private String stSdgsGoals;


}
