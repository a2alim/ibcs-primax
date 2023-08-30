package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class GrandTotalDifferenceResponse {

    private List<GrandTotalResponse> referenceGrandTotal;
    private List<GrandTotalResponse> currentGrandTotal;

    private DppAnnualPhasingCostWithChildResponse referenceItemWiseRevenue;
    private DppAnnualPhasingCostWithChildResponse currentItemWiseRevenue;
    private DppAnnualPhasingCostWithChildResponse referenceItemWiseCapital;
    private DppAnnualPhasingCostWithChildResponse currentItemWiseCapital;

}
