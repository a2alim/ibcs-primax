package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppFiscalYearDTO;

import java.util.List;

public interface DppFiscalYearService {

    List<DppFiscalYearDTO> getByDppAnnualPhasingCostTabDetailsId(Long id);

    List<DppFiscalYearDTO> getByProjectConceptIdAndComponentName(Long conceptId, DppAnnualPhasing dppAnnualPhasing);

}
