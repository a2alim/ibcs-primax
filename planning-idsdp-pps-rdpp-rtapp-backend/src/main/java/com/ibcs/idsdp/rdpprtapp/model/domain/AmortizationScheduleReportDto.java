package com.ibcs.idsdp.rdpprtapp.model.domain;

import lombok.Data;

import java.util.List;

@Data
public class AmortizationScheduleReportDto {

    private String projectName;

    private Double totalInvestment;

    private Long loanPortion;

    private Long rateOfInterest;

    List<DppAmortizationScheduleDetails> amortizationScheduleList;
}
