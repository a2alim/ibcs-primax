package com.ibcs.idsdp.dpptapp.web.dto.request;


import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class DppAmortizationScheduleDetailsGraceRequest{


    private Long year;
    private Double beginingPrincipalAmount;
    private Double yearlyFixedAmount;
    private Double yearlyInterestPaid;
    private Double totalPayment;
    private Double endingPrincipalBalance;
    private String types;
    private Long projectConceptMasterId;

}
