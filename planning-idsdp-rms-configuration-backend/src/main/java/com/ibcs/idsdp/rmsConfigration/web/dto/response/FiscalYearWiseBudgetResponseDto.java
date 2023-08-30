package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class FiscalYearWiseBudgetResponseDto extends UuidIdHolderRequestBodyDTO {

	private Long fiscalYearId;
	private Long revisionNo;
	private Double totalAllocatedBudgetAmount;
	private Boolean active;
}
