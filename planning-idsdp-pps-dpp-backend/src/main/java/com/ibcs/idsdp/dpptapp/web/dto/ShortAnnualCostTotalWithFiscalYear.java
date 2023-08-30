package com.ibcs.idsdp.dpptapp.web.dto;

import lombok.Data;

@Data
public class ShortAnnualCostTotalWithFiscalYear {
    private String fiscalYear;
    private ShortAnnualPhasingCostTotalDTO annualPhasingCost;
}
