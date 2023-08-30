package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class FiscalYearWiseBudgetRequestDto extends UuidIdHolderRequestBodyDTO {

    private Long fiscalYearId;
    private Long revisionNo;
    private Double totalAllocatedBudgetAmount;
    private Boolean active;
}
