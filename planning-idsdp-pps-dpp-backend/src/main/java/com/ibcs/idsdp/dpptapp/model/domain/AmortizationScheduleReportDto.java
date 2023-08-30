package com.ibcs.idsdp.dpptapp.model.domain;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
public class AmortizationScheduleReportDto {

    private String projectName;

    private Double totalInvestment;

    private Long loanPortion;

    private Long rateOfInterest;

    List<DppAmortizationScheduleDetails> amortizationScheduleList;
}
