package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappAnnualPhasingCostTotalDTO;
import lombok.Data;

import java.util.List;

@Data
public class GrandTotalResponseTapp {

    private DppAnnualPhasing componentName;
    private List<TappAnnualPhasingCostTotalDTO> tappAnnualPhasingCostTotal;
    private List<TappAnnualCostTotalWithFiscalYear> grandTotal;
    private String revisedVersion;
    private TappAnnualPhasingCostTotalDTO allGrandTotal;
}
