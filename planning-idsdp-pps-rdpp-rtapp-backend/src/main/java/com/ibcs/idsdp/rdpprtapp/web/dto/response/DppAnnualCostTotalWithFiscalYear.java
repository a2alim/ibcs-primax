package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import lombok.Data;

@Data
public class DppAnnualCostTotalWithFiscalYear {

    private String fiscalYear;
    private DppAnnualPhasingCostTotalDTO dppAnnualPhasingCostTotal;


}
