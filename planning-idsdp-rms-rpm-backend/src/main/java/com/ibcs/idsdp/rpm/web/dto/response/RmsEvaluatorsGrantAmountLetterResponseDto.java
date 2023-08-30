package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import lombok.Data;

import java.util.List;

@Data
public class RmsEvaluatorsGrantAmountLetterResponseDto extends UuidIdHolderRequestBodyDTO{

	private Long stFiscalYearId;

	private String topContent;

	private String bottomContent;

	private String uploadSignatureFile;

	private FiscalResponseDto fiscalYear;

	private List<RmsEvaluatorsGrantAmountResponseDto> details;
}
