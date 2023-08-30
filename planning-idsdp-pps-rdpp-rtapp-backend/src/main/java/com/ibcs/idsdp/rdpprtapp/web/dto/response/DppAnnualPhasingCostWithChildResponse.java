package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class DppAnnualPhasingCostWithChildResponse extends DppAnnualPhasingCostDTO {

    private List<FiscalYearWiseData> fiscalYearWiseCost;


}
