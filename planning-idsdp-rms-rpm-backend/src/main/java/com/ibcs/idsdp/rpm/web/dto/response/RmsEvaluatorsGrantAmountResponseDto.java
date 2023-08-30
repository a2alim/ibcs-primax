package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import lombok.Data;

@Data
public class RmsEvaluatorsGrantAmountResponseDto extends UuidIdHolderRequestBodyDTO{

	private Long rmsEvaluatorsGrantAmountLetterId;

	private Long researcherProposalId;

	private Long stProfileOfExpertEvaluatorsId;

	private Double grantAmount;

	private ResearcherProposalResponseDto researcherProposalDto;

	private ExpertEvaluatorResponseDto evaluator;

	private Integer deleted;
}
