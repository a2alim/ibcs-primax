package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import lombok.Data;

import java.util.List;

@Data
public class DppAnnualPhasingCostEconomicCodeWise extends UuidIdHolderRequestBodyDTO {

    private String projectConceptUuid;

    private Long projectConceptId;

    private DppAnnualPhasing componentName;

    private DppAnnualPhasingCostTotalDTO dppAnnualPhasingCostTotal;

    private List<DppAnnualPhasingCostTabDetailsAndEconomicCode> details;

}
