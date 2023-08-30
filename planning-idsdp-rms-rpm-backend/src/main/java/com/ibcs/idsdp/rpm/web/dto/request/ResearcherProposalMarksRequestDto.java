package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.enums.EvaluationFieldType;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
public class ResearcherProposalMarksRequestDto extends UuidIdHolderRequestBodyDTO{

	@NotNull
	private Long researcherProposalId;

	@NotNull
	@Min(0)
	@Max(5)
	private EvaluationFieldType evaluationFieldType;

	@NotNull
	@Min(0)
	private Integer markOne;

	@NotNull
	@Min(0)
	@Max(5)
	private Integer markTwo;

	@NotNull
	@Min(0)
	@Max(5)
	private Integer markThree;

	@NotNull
	@Min(0)
	@Max(5)
	private Integer markFour;

	@NotNull
	@Min(0)
	@Max(5)
	private Integer markFive;

	@NotNull
	@Min(0)
	@Max(5)
	private Integer markSix;

	@NotNull
	@Min(0)
	@Max(5)
	private Integer markSeven;

	@NotNull
	@Min(0)
	@Max(5)
	private Integer markEight;

	@NotNull
	@Min(0)
	@Max(5)
	private Integer markNine;

	@NotNull
	@Min(0)
	@Max(5)
	private Integer markTen;

	private String comments;
	private Integer totalMarks;
	private Boolean isDraft;

}
