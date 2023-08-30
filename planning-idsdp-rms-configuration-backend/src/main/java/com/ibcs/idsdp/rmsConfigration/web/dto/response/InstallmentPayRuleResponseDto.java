package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class InstallmentPayRuleResponseDto extends UuidIdHolderRequestBodyDTO {
    private Integer stFiscalYearId;
    private Integer stInstallmentTypeId;
    private Double payInstPercentageAmount;
    private Boolean active;
}
