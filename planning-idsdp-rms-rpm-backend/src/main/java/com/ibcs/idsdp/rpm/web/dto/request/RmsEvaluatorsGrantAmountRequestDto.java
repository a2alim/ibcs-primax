package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class RmsEvaluatorsGrantAmountRequestDto extends UuidIdHolderRequestBodyDTO{

	@NotNull
	private Long rmsEvaluatorsGrantAmountLetterId;

	@NotNull
	private Long researcherProposalId;

	@NotNull
	private Long stProfileOfExpertEvaluatorsId;

	@NotNull
	private Double grantAmount;

	private Integer deleted;

}
