package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;

import java.util.List;

public interface DppAnnualPhasingCostTotalService {

    List<DppAnnualPhasingCostTotalDTO> getByRdppMasterIdAndComponentName(Long conceptId, DppAnnualPhasing dppAnnualPhasing);

    public DppAnnualPhasingCostTotalDTO getByProjectConceptIdAndComponentNameAndFiscalYear(Long conceptId, DppAnnualPhasing dppAnnualPhasing, String fiscalYear);

}
