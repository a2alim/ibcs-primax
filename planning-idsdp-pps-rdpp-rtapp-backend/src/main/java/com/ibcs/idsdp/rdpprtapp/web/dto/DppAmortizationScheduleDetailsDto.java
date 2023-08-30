package com.ibcs.idsdp.rdpprtapp.web.dto;

import com.ibcs.idsdp.rdpprtapp.web.dto.response.DppAmortizationScheduleResponse;
import lombok.Data;

import java.util.List;

@Data
public class DppAmortizationScheduleDetailsDto {


    private String uuid;
    private Long loanPeriod;
    private Long rateOfInterest;
    private Long gracePeriod;
    private Long rdppMasterId;
    private String code;
    private String projectName;
    private Double totalInvestment;
    private int loanPortion;
    private List<DppAmortizationScheduleDetailsListDto> amortizationScheduleList;

}
