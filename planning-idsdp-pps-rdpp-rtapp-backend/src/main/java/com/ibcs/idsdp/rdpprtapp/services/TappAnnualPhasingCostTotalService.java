package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappAnnualPhasingCostTotalDTO;

import java.util.List;

public interface TappAnnualPhasingCostTotalService {

    List<TappAnnualPhasingCostTotalDTO> getByProjectConceptIdAndComponentName(Long conceptId, DppAnnualPhasing dppAnnualPhasing);

    TappAnnualPhasingCostTotalDTO getByProjectConceptIdAndComponentNameAndFiscalYear(Long conceptId, DppAnnualPhasing dppAnnualPhasing, String fiscalYear);

}
