package com.ibcs.idsdp.rdpprtapp.web.dto.request;


import lombok.Data;

@Data
public class DppAmortizationScheduleDetailsLoanRequest{


    private Long year;
    private Double beginingPrincipalAmount;
    private Double yearlyFixedAmount;
    private Double yearlyInterestPaid;
    private Double totalPayment;
    private Double endingPrincipalBalance;
    private String types;
    private Long projectConceptMasterId;

}
