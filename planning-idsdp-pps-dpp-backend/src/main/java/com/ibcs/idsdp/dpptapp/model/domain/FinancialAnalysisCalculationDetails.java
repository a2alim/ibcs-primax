package com.ibcs.idsdp.dpptapp.model.domain;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "financial_analysis_calculation_details")
public class FinancialAnalysisCalculationDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    @ManyToOne
    private FinancialAnalysisCalculation financialAnalysisCalculation;

}
