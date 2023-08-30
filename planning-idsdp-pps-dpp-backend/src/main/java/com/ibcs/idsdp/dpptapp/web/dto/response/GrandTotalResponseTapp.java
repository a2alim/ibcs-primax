package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.web.dto.TappAnnualPhasingCostTotalDTO;
import lombok.Data;

import java.util.List;

@Data
public class GrandTotalResponseTapp {

    private DppAnnualPhasing componentName;
    private List<TappAnnualPhasingCostTotalDTO> tappAnnualPhasingCostTotal;
    private List<TappAnnualCostTotalWithFiscalYear> grandTotal;

}
