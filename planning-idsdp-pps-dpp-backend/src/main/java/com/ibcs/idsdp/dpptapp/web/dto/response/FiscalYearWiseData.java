package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppFiscalYearDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class FiscalYearWiseData {

    private int lastYear;
    private String fiscalYear;
    private List<DppFiscalYearDTO> values;
    private DppAnnualPhasingCostTotalDTO dppAnnualPhasingCostTotal;


}
