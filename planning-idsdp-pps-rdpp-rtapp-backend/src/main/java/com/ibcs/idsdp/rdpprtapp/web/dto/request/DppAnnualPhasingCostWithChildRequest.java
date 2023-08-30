package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class DppAnnualPhasingCostWithChildRequest extends DppAnnualPhasingCostDTO {

    List<DppAnnualPhasingCostTotalDTO> fiscalYearsWiseTotal;
}
