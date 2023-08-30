package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.web.dto.AnnualPhasingCostTotalDTO;
import lombok.Data;

@Data
public class AnnualCostTotalWithFiscalYear {
    private String fiscalYear;
    private AnnualPhasingCostTotalDTO cost;
}
