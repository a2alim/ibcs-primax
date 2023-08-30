package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TrainingBudgetRequest {

    private Long itemOfExpenditureId;

    private int expenditureAmount;

    private Long fiscalYearId;

    private Long proposalId;
    
    private String expenditureName;
}
