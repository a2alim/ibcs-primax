package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.enums.EvaluationFieldType;
import lombok.Data;

@Data
public class ResearcherProposalMarksResponseDto extends UuidIdHolderRequestBodyDTO{

	private Long researcherProposalId;
	private EvaluationFieldType evaluationFieldType;
	private Integer markOne;
	private Integer markTwo;
	private Integer markThree;
	private Integer markFour;
	private Integer markFive;
	private Integer markSix;
	private Integer markSeven;
	private Integer markEight;
	private Integer markNine;
	private Integer markTen;
	private String comments;
	private Integer totalMarks;
	private ResearcherProposalResponseDto researcherProposalDto;
	private Boolean isDraft;

}
