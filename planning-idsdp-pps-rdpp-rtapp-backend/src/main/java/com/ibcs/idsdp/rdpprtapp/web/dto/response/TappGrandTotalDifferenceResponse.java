package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class TappGrandTotalDifferenceResponse {

    private List<GrandTotalResponseTapp> referenceGrandTotal;
    private List<GrandTotalResponseTapp> currentGrandTotal;

    private TappAnnualPhasingCostWithChildResponse referenceItemWiseRevenue;
    private TappAnnualPhasingCostWithChildResponse currentItemWiseRevenue;
    private TappAnnualPhasingCostWithChildResponse referenceItemWiseCapital;
    private TappAnnualPhasingCostWithChildResponse currentItemWiseCapital;

}
