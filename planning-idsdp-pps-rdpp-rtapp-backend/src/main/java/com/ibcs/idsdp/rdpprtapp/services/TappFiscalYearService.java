package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappFiscalYearDTO;

import java.util.List;

public interface TappFiscalYearService {

    List<TappFiscalYearDTO> getByTappAnnualPhasingCostTabDetailsId(Long id);

    List<TappFiscalYearDTO> getByProjectConceptIdAndComponentName(Long conceptId, DppAnnualPhasing dppAnnualPhasing);

}
