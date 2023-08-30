package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class InstallmentPayRuleRequestDto extends UuidIdHolderRequestBodyDTO {


    private Integer stFiscalYearId;
    private Integer stInstallmentTypeId;
    private Double payInstPercentageAmount;
    private Boolean active;
}
