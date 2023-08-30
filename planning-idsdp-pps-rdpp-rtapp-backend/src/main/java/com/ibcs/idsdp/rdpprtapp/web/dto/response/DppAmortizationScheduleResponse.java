package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

@Data
public class DppAmortizationScheduleResponse extends UuidHolderRequestBodyDTO {

    private Long rdppMasterId;
    private String code;
    private String projectName;
    private Double totalInvestment;
    private int loanPortion;
    private int loanPeriod;
    private int rateOfInterest;
    private int gracePeriod;

}
