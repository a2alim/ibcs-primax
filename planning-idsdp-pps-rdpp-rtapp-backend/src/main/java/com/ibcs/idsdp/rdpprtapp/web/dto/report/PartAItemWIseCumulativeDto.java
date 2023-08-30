package com.ibcs.idsdp.rdpprtapp.web.dto.report;

import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.DppAnnualPhasingCostWithChildResponse;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.GrandTotalResponse;
import lombok.Data;

import java.util.List;

@Data
public class PartAItemWIseCumulativeDto {

    private DppAnnualPhasingCostWithChildResponse revItemWiseCum;
    private DppAnnualPhasingCostWithChildResponse capItemWiseCum;
    private DppAnnualPhasingCostWithChildResponse contingency;
    private List<GrandTotalResponse> grandTotal;
    private DppAnnualPhasingCostWithChildResponse grand;
}
