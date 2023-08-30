package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearcherProposalInfoResponseDto  extends UuidIdHolderRequestBodyDTO {

	private Long researcherProposalId;
	private String introduction;
	private String statementOfProblem;
	private String objectivesOfTheStudy;
	private String formulationResearch;
	private String conceptualFramework;
	private String reviewOfLiterature;
	private String rationaleOfTheStudy;
	private String scopeOfTheStudy;
	private String methodsOfTheStudy;
	private String expectedOutput;
	private String relationWithSocialPolicy;
	private String tentativeChapterization;
	private String actionPlanTentativeBudget;
	private String tentativeBudget;
	private String bibliographyReferences;
	private String additionalInfoTopicProposal;
	private Integer isEditable;
	private ResearcherProposalResponseDto researcherProposalDto;

}
