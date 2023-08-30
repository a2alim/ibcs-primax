package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTotalDTO;
import lombok.Data;

@Data
public class DppAnnualCostTotalWithFiscalYear {

    private String fiscalYear;
    private DppAnnualPhasingCostTotalDTO dppAnnualPhasingCostTotal;


}
