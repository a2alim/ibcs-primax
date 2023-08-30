package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class RmsEvaluatorsGrantAmountLetterRequestDto extends UuidIdHolderRequestBodyDTO{

	@NotNull
	private Long stFiscalYearId;

	@NotBlank
	private String topContent;

	@NotBlank
	private String bottomContent;

	private String uploadSignatureFile;

}
