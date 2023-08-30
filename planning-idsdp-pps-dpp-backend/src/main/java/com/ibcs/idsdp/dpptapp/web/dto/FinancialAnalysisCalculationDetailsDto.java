package com.ibcs.idsdp.dpptapp.web.dto;

import lombok.Data;

@Data
public class FinancialAnalysisCalculationDetailsDto {

    private Long detailsId;
    private Long projectConceptMasterId;
    private String fiscalYear;
    private Double noOfFiscalYear;
    private Double capitalCost;
    private Double operatingCost;
    private Double totalCost;
    private Double discValueOfTotalCost1;
    private Double benifit1;
    private Double discValueOfBenifit1;
    private Double discValueOfTotalCost2;
    private Double benifit2;
    private Double discValueOfBenifit2;

}
