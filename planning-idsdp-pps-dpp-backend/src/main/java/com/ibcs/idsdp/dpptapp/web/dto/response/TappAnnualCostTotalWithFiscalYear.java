package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.dpptapp.web.dto.TappAnnualPhasingCostTotalDTO;
import lombok.Data;

@Data
public class TappAnnualCostTotalWithFiscalYear {

    private String fiscalYear;
    private TappAnnualPhasingCostTotalDTO tappAnnualPhasingCostTotal;


}
