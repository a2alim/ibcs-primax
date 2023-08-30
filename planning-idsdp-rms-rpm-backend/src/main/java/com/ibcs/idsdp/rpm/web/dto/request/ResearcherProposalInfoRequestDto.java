package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ResearcherProposalInfoRequestDto extends UuidIdHolderRequestBodyDTO{

	@NotNull
	private Long researcherProposalId;

	@NotBlank
	private String introduction;

	@NotBlank
	private String statementOfProblem;

	@NotBlank
	private String objectivesOfTheStudy;

	@NotBlank
	private String formulationResearch;

	@NotBlank
	private String conceptualFramework;

	@NotBlank
	private String reviewOfLiterature;

	@NotBlank
	private String rationaleOfTheStudy;

	@NotBlank
	private String scopeOfTheStudy;

	@NotBlank
	private String methodsOfTheStudy;

	@NotBlank
	private String expectedOutput;

	@NotBlank
	private String relationWithSocialPolicy;

	@NotBlank
	private String tentativeChapterization;

	@NotBlank
	private String actionPlanTentativeBudget;

	@NotBlank
	private String tentativeBudget;

	@NotBlank
	private String bibliographyReferences;

	@NotBlank
	private String additionalInfoTopicProposal;

	private Integer isEditable;

}
