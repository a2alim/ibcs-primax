package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class GrandTotalResponse {
    private String revisedVersion;
    private LocalDate dateCommencement;
    private LocalDate dateCompletion;
    private LocalDate cumulativeDate;
    private DppAnnualPhasing dppAnnualPhasing;
    private List<DppAnnualPhasingCostTotalDTO> dppAnnualPhasingCostTotal;
    private List<DppAnnualCostTotalWithFiscalYear> grandTotal;
    private DppAnnualPhasingCostTotalDTO allGrandTotal;
}
