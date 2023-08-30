package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.rdpprtapp.web.dto.TappAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappFiscalYearDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class TappFiscalYearWiseData {

    private int lastYear;
    private String fiscalYear;
    private List<TappFiscalYearDTO> values;
    private TappAnnualPhasingCostTotalDTO tappAnnualPhasingCostTotal;


}
