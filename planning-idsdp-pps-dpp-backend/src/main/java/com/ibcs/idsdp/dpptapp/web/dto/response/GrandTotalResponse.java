package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTabDetailsDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTotalDTO;
import lombok.Data;

import java.util.List;

@Data
public class GrandTotalResponse {

    private DppAnnualPhasing dppAnnualPhasing;
    private List<DppAnnualPhasingCostTotalDTO> dppAnnualPhasingCostTotal;
    private List<DppAnnualCostTotalWithFiscalYear> grandTotal;

}
