package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTabDetailsDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTotalDTO;
import lombok.Data;

import java.util.List;

@Data
public class DppAnnualPhasingCostTabDetailsAndEconomicCode {

    private Long economicCodeId;

    private EconomicCode economicCode;

    private List<DppAnnualPhasingCostTotalDTO> yearWiseTotal;

    private List<DppAnnualPhasingCostTabDetailsDTO> dppAnnualPhasingCostTabDetails;

}
