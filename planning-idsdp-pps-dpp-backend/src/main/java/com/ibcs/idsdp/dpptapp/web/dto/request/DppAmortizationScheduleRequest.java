package com.ibcs.idsdp.dpptapp.web.dto.request;


import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class DppAmortizationScheduleRequest extends UuidIdHolderRequestBodyDTO {


    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private String projectName;
    private Double totalInvestment;
    private Long loanPortion;
    private Long loanPeriod;
    private Long rateOfInterest;
    private Long gracePeriod;
    public List<DppAmortizationScheduleDetailsLoanRequest> loanPeriods;
    public List<DppAmortizationScheduleDetailsGraceRequest> gracePeriods;


}
